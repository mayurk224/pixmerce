import { useEffect, useState } from "react";
import AvailableItems from "./AvailableItems.jsx";
import Cart from "./Cart.jsx";
import ChatComponent from "./ChatComponent.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { negotiationService } from "../service/negotiationService.js";

const createMessage = (type, text) => ({
  id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  type,
  text,
});

const formatCurrency = (value) => {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "--";
  }

  return `$${amount.toFixed(Number.isInteger(amount) ? 0 : 2)}`;
};

const formatCountdown = (timerExpiresAt) => {
  if (!timerExpiresAt) {
    return "60s";
  }

  const remainingMs = new Date(timerExpiresAt).getTime() - Date.now();
  const remainingSeconds = Math.max(0, Math.ceil(remainingMs / 1000));

  return `${remainingSeconds}s`;
};

const ParentModal = ({ isOpen, onClose, items, shop }) => {
  const { token, user, refreshUser } = useAuth();
  const [selectedItemIds, setSelectedItemIds] = useState([]);
  const [currentStep, setCurrentStep] = useState("selection");
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [sessionStatus, setSessionStatus] = useState("idle");
  const [roundsLeft, setRoundsLeft] = useState(0);
  const [startingPrice, setStartingPrice] = useState(0);
  const [currentOffer, setCurrentOffer] = useState(null);
  const [agreedPrice, setAgreedPrice] = useState(null);
  const [timerExpiresAt, setTimerExpiresAt] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isStartingSession, setIsStartingSession] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [countdownLabel, setCountdownLabel] = useState("60s");

  const selectedItems = items.filter((item) =>
    selectedItemIds.includes(item._id || item.id),
  );
  const selectedTotal = selectedItems.reduce(
    (sum, item) => sum + (Number(item.startingPrice) || 0),
    0,
  );
  const walletBalance = Number(user?.walletBalance) || 0;
  const canProceedToChat =
    selectedItems.length > 0 &&
    !isStartingSession &&
    Boolean(shop?._id && token);
  const canSendMessage =
    Boolean(sessionId) &&
    sessionStatus === "active" &&
    !isSendingMessage &&
    !isCheckingOut;
  const canCheckout =
    Boolean(sessionId) &&
    sessionStatus === "won" &&
    Number.isFinite(Number(agreedPrice ?? currentOffer)) &&
    !isCheckingOut;

  useEffect(() => {
    if (!timerExpiresAt || currentStep !== "chat") {
      setCountdownLabel("60s");
      return undefined;
    }

    const syncCountdown = () => {
      setCountdownLabel(formatCountdown(timerExpiresAt));
    };

    syncCountdown();
    const intervalId = window.setInterval(syncCountdown, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [currentStep, timerExpiresAt]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedItemIds([]);
      setCurrentStep("selection");
      setMessages([]);
      setInputValue("");
      setSessionId(null);
      setSessionStatus("idle");
      setRoundsLeft(0);
      setStartingPrice(0);
      setCurrentOffer(null);
      setAgreedPrice(null);
      setTimerExpiresAt(null);
      setFeedbackMessage("");
      setSuccessMessage("");
      setIsStartingSession(false);
      setIsSendingMessage(false);
      setIsCheckingOut(false);
      setCountdownLabel("60s");
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleToggleItem = (itemId) => {
    setFeedbackMessage("");
    setSuccessMessage("");
    setSelectedItemIds((currentIds) =>
      currentIds.includes(itemId)
        ? currentIds.filter((currentId) => currentId !== itemId)
        : [...currentIds, itemId],
    );
  };

  const handleProceed = async () => {
    if (!selectedItems.length) {
      setFeedbackMessage(
        "Select at least one item before starting a negotiation.",
      );
      return;
    }

    if (!shop?._id || !token) {
      setFeedbackMessage(
        "The shop session is missing. Reopen the shop and try again.",
      );
      return;
    }

    setIsStartingSession(true);
    setFeedbackMessage("");
    setSuccessMessage("");

    try {
      const response = await negotiationService.startSession(
        {
          shopId: shop._id,
          cartItems: selectedItems.map((item) => item._id || item.id),
        },
        token,
      );

      setSessionId(response.sessionId);
      setSessionStatus(response.status ?? "active");
      setRoundsLeft(response.roundsLeft ?? 0);
      setStartingPrice(response.totalStartingPrice ?? selectedTotal);
      setCurrentOffer(
        response.currentOffer ?? response.totalStartingPrice ?? null,
      );
      setAgreedPrice(null);
      setTimerExpiresAt(
        response.timerExpiresAt ?? new Date(Date.now() + 60000).toISOString(),
      );
      setMessages([
        createMessage(
          "ai",
          response.aiMessage ||
            "The shopkeeper leans in, waiting for your first offer.",
        ),
      ]);
      setInputValue("");
      setCurrentStep("chat");
    } catch (error) {
      setFeedbackMessage(error.message);
    } finally {
      setIsStartingSession(false);
    }
  };

  const handleSendMessage = async () => {
    const trimmedValue = inputValue.trim();

    if (!trimmedValue || !sessionId || !canSendMessage) {
      return;
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      createMessage("user", trimmedValue),
    ]);
    setInputValue("");
    setIsSendingMessage(true);
    setFeedbackMessage("");
    setSuccessMessage("");

    try {
      const response = await negotiationService.sendMessage(
        { sessionId, userMessage: trimmedValue },
        token,
      );

      setMessages((currentMessages) => [
        ...currentMessages,
        createMessage("ai", response.aiMessage),
      ]);
      setSessionStatus(response.status ?? "active");
      setRoundsLeft(response.roundsLeft ?? roundsLeft);
      setTimerExpiresAt(response.timerExpiresAt ?? timerExpiresAt);
      setCurrentOffer(response.currentOffer ?? currentOffer);

      if (Number.isFinite(Number(response.agreedPrice))) {
        setAgreedPrice(Number(response.agreedPrice));
        setSuccessMessage(
          `Deal locked at ${formatCurrency(response.agreedPrice)}.`,
        );
      }
    } catch (error) {
      const responseData = error.data;

      if (responseData?.status) {
        setSessionStatus(responseData.status);
        setRoundsLeft(responseData.roundsLeft ?? roundsLeft);
        setTimerExpiresAt(responseData.timerExpiresAt ?? timerExpiresAt);
        setCurrentOffer(responseData.currentOffer ?? currentOffer);

        if (responseData.aiMessage) {
          setMessages((currentMessages) => [
            ...currentMessages,
            createMessage("ai", responseData.aiMessage),
          ]);
        }

        setMessages((currentMessages) => [
          ...currentMessages,
          createMessage(
            "system",
            responseData.message ||
              (responseData.status === "lost"
                ? "The negotiation ended without a deal."
                : "The negotiation has ended."),
          ),
        ]);
      } else {
        setFeedbackMessage(error.message);
      }
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleCancelChat = () => {
    setCurrentStep("selection");
    setMessages([]);
    setInputValue("");
    setSessionId(null);
    setSessionStatus("idle");
    setRoundsLeft(0);
    setStartingPrice(0);
    setCurrentOffer(null);
    setAgreedPrice(null);
    setTimerExpiresAt(null);
    setFeedbackMessage("");
    setSuccessMessage("");
    setIsSendingMessage(false);
    setIsCheckingOut(false);
  };

  const handleAcceptChat = async () => {
    if (sessionStatus === "completed") {
      onClose();
      return;
    }

    if (!canCheckout) {
      setFeedbackMessage(
        "Keep negotiating until the shopkeeper accepts your offer.",
      );
      return;
    }

    setIsCheckingOut(true);
    setFeedbackMessage("");

    try {
      const finalPrice = Number(agreedPrice ?? currentOffer);
      const response = await negotiationService.checkout(
        { sessionId, agreedPrice: finalPrice },
        token,
      );

      await refreshUser(token);
      setSessionStatus("completed");
      setTimerExpiresAt(null);
      setSuccessMessage(
        `${response.itemsBought} item${response.itemsBought === 1 ? "" : "s"} purchased for ${formatCurrency(response.agreedPrice)}.`,
      );
      setMessages((currentMessages) => [
        ...currentMessages,
        createMessage(
          "system",
          "Checkout successful. The shopkeeper packs your order and sends you on your way.",
        ),
      ]);
    } catch (error) {
      setFeedbackMessage(error.message);
    } finally {
      setIsCheckingOut(false);
    }
  };

  const chatStatusLabel =
    sessionStatus === "won"
      ? "Deal ready"
      : sessionStatus === "completed"
        ? "Purchased"
        : sessionStatus === "lost"
          ? "Walked away"
          : sessionStatus === "timeout"
            ? "Timed out"
            : "Live";

  const acceptButtonLabel =
    sessionStatus === "completed"
      ? "Close"
      : isCheckingOut
        ? "Checking out..."
        : canCheckout
          ? `Checkout ${formatCurrency(agreedPrice ?? currentOffer)}`
          : "Checkout Locked";

  const cancelButtonLabel =
    sessionStatus === "completed" ? "Close" : "Back to items";

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 px-3 py-6 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[560px] rounded-2xl border border-white/10 bg-[#0b0b0d]/95 p-3 text-white shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex h-[min(88vh,680px)] flex-col rounded-xl border border-white/10 p-3">
          <div className="mb-3 flex items-start justify-between gap-4 border-b border-white/10 pb-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-yellow-300/70">
                Negotiation Bay
              </p>
              <h2
                className="text-xl font-bold tracking-[0.12em] text-yellow-200 sm:text-2xl"
                style={{ fontFamily: "'Pixelify Sans', sans-serif" }}
              >
                {shop?.name || "Shop"}
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                {shop?.keeperName
                  ? `${shop.keeperName} is handling the counter.`
                  : "Choose your cart, then start bargaining."}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-white/15 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-200 transition hover:bg-white/10"
            >
              Close
            </button>
          </div>

          <div className="mb-3 grid gap-2 rounded-xl border border-white/10 bg-black/20 p-3 text-[11px] uppercase tracking-[0.2em] text-slate-300 sm:grid-cols-4">
            <div>
              <p className="text-slate-500">Wallet</p>
              <p className="mt-1 text-sm text-white">
                {formatCurrency(walletBalance)}
              </p>
            </div>
            <div>
              <p className="text-slate-500">Sticker</p>
              <p className="mt-1 text-sm text-white">
                {formatCurrency(
                  currentStep === "chat" ? startingPrice : selectedTotal,
                )}
              </p>
            </div>
            <div>
              <p className="text-slate-500">Offer</p>
              <p className="mt-1 text-sm text-white">
                {formatCurrency(agreedPrice ?? currentOffer)}
              </p>
            </div>
            <div>
              <p className="text-slate-500">
                {currentStep === "chat" ? chatStatusLabel : "Selected"}
              </p>
              <p className="mt-1 text-sm text-white">
                {currentStep === "chat"
                  ? `${countdownLabel} / ${roundsLeft} rounds`
                  : `${selectedItems.length} item${selectedItems.length === 1 ? "" : "s"}`}
              </p>
            </div>
          </div>

          {(feedbackMessage || successMessage) && (
            <div
              className={`mb-3 rounded-xl border px-3 py-2 text-sm ${
                feedbackMessage
                  ? "border-rose-400/40 bg-rose-400/10 text-rose-100"
                  : "border-emerald-400/40 bg-emerald-400/10 text-emerald-100"
              }`}
            >
              {feedbackMessage || successMessage}
            </div>
          )}

          <div className="flex-1 space-y-3 overflow-y-auto pr-1">
            {currentStep === "selection" ? (
              <>
                <AvailableItems
                  items={items}
                  selectedItemIds={selectedItemIds}
                  onToggleItem={handleToggleItem}
                />

                <Cart items={selectedItems} />
              </>
            ) : (
              <ChatComponent
                inputValue={inputValue}
                messages={messages}
                onAccept={handleAcceptChat}
                onCancel={
                  sessionStatus === "completed" ? onClose : handleCancelChat
                }
                onInputChange={setInputValue}
                onSend={handleSendMessage}
                acceptLabel={acceptButtonLabel}
                cancelLabel={cancelButtonLabel}
                acceptDisabled={!canCheckout && sessionStatus !== "completed"}
                sendDisabled={!canSendMessage}
                inputDisabled={!canSendMessage}
                helperText={
                  sessionStatus === "won"
                    ? "The shopkeeper accepted. Lock in checkout when you're ready."
                    : sessionStatus === "completed"
                      ? "Purchase complete. Close the panel whenever you're ready."
                      : sessionStatus === "lost" || sessionStatus === "timeout"
                        ? "This negotiation is over. Return to your cart to try again."
                        : "Make your offer clearly with a price to help the backend lock the final deal."
                }
              />
            )}
          </div>

          {currentStep === "selection" ? (
            <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.18em] text-slate-100 transition hover:bg-white/10"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleProceed}
                disabled={!canProceedToChat}
                className="rounded-lg border border-yellow-300/70 bg-yellow-300/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-yellow-100 transition enabled:hover:bg-yellow-300/20 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/5 disabled:text-slate-500"
              >
                {isStartingSession ? "Opening chat..." : "Proceed to chat"}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ParentModal;

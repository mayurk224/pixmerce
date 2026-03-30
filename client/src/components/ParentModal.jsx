import { useEffect, useState } from "react";
import AvailableItems from "./AvailableItems.jsx";
import Cart from "./Cart.jsx";
import ChatComponent from "./ChatComponent.jsx";

const ParentModal = ({ isOpen, onClose, onProceed, items }) => {
  const [selectedItemIds, setSelectedItemIds] = useState([]);
  const [currentStep, setCurrentStep] = useState("selection");
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setSelectedItemIds([]);
      setCurrentStep("selection");
      setMessages([]);
      setInputValue("");
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

  const selectedItems = items.filter((item) => selectedItemIds.includes(item.id));

  const handleToggleItem = (itemId) => {
    setSelectedItemIds((currentIds) =>
      currentIds.includes(itemId)
        ? currentIds.filter((currentId) => currentId !== itemId)
        : [...currentIds, itemId],
    );
  };

  const handleProceed = () => {
    const selectionLabel =
      selectedItems.length === 0
        ? "No items selected yet."
        : `Selected: ${selectedItems.map((item) => item.name).join(", ")}.`;

    setMessages([
      {
        id: "system-selection",
        type: "system",
        text: `${selectionLabel} Send a message before you accept.`,
      },
    ]);
    setInputValue("");
    setCurrentStep("chat");
  };

  const handleSendMessage = () => {
    const trimmedValue = inputValue.trim();

    if (!trimmedValue) {
      return;
    }

    const messageId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: `user-${messageId}`,
        type: "user",
        text: trimmedValue,
      },
      {
        id: `system-${messageId}`,
        type: "system",
        text: "Loadout synced. Accept to continue or send another note.",
      },
    ]);
    setInputValue("");
  };

  const handleCancelChat = () => {
    setCurrentStep("selection");
    setMessages([]);
    setInputValue("");
  };

  const handleAcceptChat = () => {
    onProceed?.(selectedItems);
  };

  return (
    <div
  className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-[2px]"
  onClick={onClose}
>
  <div
    className="w-full max-w-[460px] rounded-2xl border border-white/10 bg-[#0b0b0d]/95 p-3 text-white shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
    onClick={(event) => event.stopPropagation()}
  >
    {/* INNER CONTAINER */}
    <div className="flex h-[min(85vh,560px)] flex-col rounded-xl border border-white/10 p-3">
      
      {/* HEADER */}
      <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-yellow-300/70">
            Loadout
          </p>
          <h2
            className="text-xl font-bold tracking-[0.12em] text-yellow-200 sm:text-2xl"
            style={{ fontFamily: "'Pixelify Sans', sans-serif" }}
          >
            Shop
          </h2>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-md border border-white/15 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-200 transition hover:bg-white/10"
        >
          Close
        </button>
      </div>

        {/* CONTENT */}
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
              onCancel={handleCancelChat}
              onInputChange={setInputValue}
              onSend={handleSendMessage}
            />
          )}
        </div>

        {/* ACTIONS */}
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
              className="rounded-lg border border-yellow-300/70 bg-yellow-300/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-yellow-100 transition hover:bg-yellow-300/20"
            >
              Proceed
            </button>
          </div>
        ) : null}
    </div>
  </div>
</div>
  );
};

export default ParentModal;

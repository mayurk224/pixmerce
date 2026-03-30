import { useEffect, useRef } from "react";

const ChatComponent = ({
  acceptDisabled,
  acceptLabel = "Accept",
  cancelLabel = "Cancel",
  helperText,
  inputDisabled,
  inputValue,
  messages,
  onAccept,
  onCancel,
  onInputChange,
  onSend,
  sendDisabled,
}) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSend();
  };

  return (
    <div className="flex h-full flex-col gap-3">
      <section className="rounded-xl border border-white/10 bg-black/20 p-3 sm:p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-yellow-300/70">
              Chat
            </p>
            <p className="mt-0.5 text-xs text-slate-400">
              Confirm your loadout
            </p>
          </div>

          <div className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-slate-300">
            {messages.length}
          </div>
        </div>

        <div className="flex h-[280px] flex-col gap-2 overflow-y-auto rounded-xl border border-white/10 bg-[#050506]/80 p-2.5">
          {messages.map((message) => {
            const isUserMessage = message.type === "user";
            const isSystemMessage = message.type === "system";

            return (
              <div
                key={message.id}
                className={`flex ${
                  isUserMessage ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[82%] rounded-2xl px-3 py-2 text-xs leading-relaxed shadow-[0_8px_18px_rgba(0,0,0,0.18)] ${
                    isUserMessage
                      ? "border border-yellow-300/60 bg-yellow-300/15 text-yellow-50"
                      : isSystemMessage
                        ? "border border-cyan-300/30 bg-cyan-300/10 text-cyan-50"
                        : "border border-white/10 bg-slate-900 text-slate-100"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>
      </section>

      <section className="rounded-xl border border-white/10 bg-black/20 p-3 sm:p-4">
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(event) => onInputChange(event.target.value)}
              disabled={inputDisabled}
              placeholder="Type your message..."
              className="flex-1 rounded-lg border border-white/10 bg-[#050506]/90 px-3 py-2 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-yellow-300/60 disabled:cursor-not-allowed disabled:border-white/5 disabled:bg-[#050506]/50 disabled:text-slate-500"
            />

            <button
              type="submit"
              disabled={sendDisabled}
              className="rounded-lg border border-yellow-300/70 bg-yellow-300/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-yellow-100 transition enabled:hover:bg-yellow-300/20 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/5 disabled:text-slate-500"
            >
              Send
            </button>
          </div>

          {helperText ? (
            <p className="text-[11px] leading-relaxed text-slate-400">
              {helperText}
            </p>
          ) : null}

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.18em] text-slate-100 transition hover:bg-white/10"
            >
              {cancelLabel}
            </button>

            <button
              type="button"
              onClick={onAccept}
              disabled={acceptDisabled}
              className="rounded-lg border border-yellow-300/70 bg-yellow-300/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-yellow-100 transition enabled:hover:bg-yellow-300/20 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/5 disabled:text-slate-500"
            >
              {acceptLabel}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default ChatComponent;

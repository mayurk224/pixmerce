const Cart = ({ items }) => {
  const visibleSlots = Math.max(items.length, 4);

  return (
    <section className="rounded-xl border border-white/10 bg-black/20 p-3 sm:p-4">
      {/* HEADER */}
      <div className="mb-3">
        <p className="text-[10px] uppercase tracking-[0.28em] text-yellow-300/70">
          Cart
        </p>
        <p className="mt-0.5 text-xs text-slate-400">
          {items.length === 0 ? "Select items above" : "Your loadout"}
        </p>
      </div>

      {/* SLOTS */}
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: visibleSlots }).map((_, index) => {
          const item = items[index];

          return (
            <div
              key={item?.id ?? `empty-slot-${index}`}
              className={`flex aspect-square w-16 items-center justify-center rounded-lg border text-center transition ${
                item
                  ? "border-yellow-300/60 bg-yellow-300/10 text-yellow-100"
                  : "border-dashed border-white/10 bg-white/[0.02] text-slate-500"
              }`}
            >
              {item ? (
                <div className="px-1">
                  <p className="text-[9px] uppercase tracking-[0.22em] text-yellow-300/70">
                    {item.tag}
                  </p>
                  <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]">
                    {item.name}
                  </p>
                </div>
              ) : (
                <span className="text-[9px] uppercase tracking-[0.22em]">
                  Empty
                </span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Cart;

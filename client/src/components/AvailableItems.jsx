const AvailableItems = ({ items, selectedItemIds, onToggleItem }) => {
  return (
    <section className="rounded-xl border border-white/10 bg-black/20 p-3 sm:p-4">
  
  {/* HEADER */}
  <div className="mb-3 flex items-center justify-between">
    <div>
      <p className="text-[10px] uppercase tracking-[0.28em] text-yellow-300/70">
        Items
      </p>
      <p className="mt-0.5 text-xs text-slate-400">
        Choose upgrades
      </p>
    </div>

    <div className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-slate-300">
      {selectedItemIds.length}
    </div>
  </div>

  {/* GRID */}
  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
    {items.map((item) => {
      const isSelected = selectedItemIds.includes(item.id);

      return (
        <button
          key={item.id}
          type="button"
          onClick={() => onToggleItem(item.id)}
          className={`group aspect-square rounded-lg border p-2 transition-all duration-200 ${
            isSelected
              ? "border-yellow-300 bg-yellow-300/10 shadow-[0_0_0_1px_rgba(253,224,71,0.4)]"
              : "border-white/10 bg-white/[0.02] hover:-translate-y-0.5 hover:border-yellow-300/50 hover:bg-white/[0.05]"
          }`}
        >
          <div className="flex h-full flex-col justify-between">
            
            {/* TAG */}
            <span className="text-[9px] uppercase tracking-[0.25em] text-slate-500">
              {item.tag}
            </span>

            {/* CONTENT */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-white">
                {item.name}
              </p>
              <p className="mt-0.5 text-[10px] text-slate-400">
                {item.price}
              </p>
            </div>
          </div>
        </button>
      );
    })}
  </div>
</section>
  );
};

export default AvailableItems;

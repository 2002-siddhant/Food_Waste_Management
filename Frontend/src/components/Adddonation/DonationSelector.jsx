const DonationTypeSelector = ({ type, setType }) => {
  const buttonBase =
    "flex items-center justify-center gap-3 rounded-3xl px-5 py-4 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-300";

  return (
    <aside className="rounded-4xl bg-slate-950/95 p-6 text-white shadow-2xl shadow-slate-900/20 ring-1 ring-slate-200/10">
      <div className="flex items-center gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-3xl bg-emerald-500/15 text-emerald-300">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 13a8 8 0 1 0 16 0" />
            <path d="M6 13l3-3 2 2 3-3 2 2 3-3" />
          </svg>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">Choose type</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Raw or Cooked</h2>
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        <button
          type="button"
          onClick={() => setType("raw")}
          className={`${buttonBase} ${
            type === "raw"
              ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-emerald-200">
            🍃
          </span>
          Raw Food
        </button>

        <button
          type="button"
          onClick={() => setType("cooked")}
          className={`${buttonBase} ${
            type === "cooked"
              ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-amber-200">
            🍲
          </span>
          Cooked Food
        </button>
      </div>
    </aside>
  );
};

export default DonationTypeSelector;
type CockpitMetricProps = {
  label: string;
  value: string;
  helper?: string;
};

export function CockpitMetric({ label, value, helper }: CockpitMetricProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-semibold text-slate-100">{value}</p>

      {helper && <p className="mt-2 text-sm text-slate-400">{helper}</p>}
    </div>
  );
}

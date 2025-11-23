export default function StatCard({ label, value }) {
  return (
    <div className="p-4 bg-white border rounded shadow-sm">
      <div className="text-sm font-semibold text-slate-500">{label}</div>

      <div className="text-xl font-medium break-all whitespace-normal">
        {value}
      </div>
    </div>
  );
}

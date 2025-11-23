import LinkRow from "./LinkRow";
export default function LinkTable({ links, baseUrl, onDeleted, onRefresh }) {
  return (
    <div className="bg-white shadow rounded overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-[#490ddf] text-white">
          <tr>
            <th className="p-3 text-left text-lg">Code</th>
            <th className="p-3 text-left text-lg">Target URL</th>
            <th className="p-3 text-right text-lg">Clicks</th>
            <th className="p-3 text-left text-lg">Last Clicked</th>
            <th className="p-3 text-left text-lg">Actions</th>
          </tr>
        </thead>
        <tbody>
          {links.map((item) => (
            <LinkRow
              key={item.code}
              item={item}
              baseUrl={baseUrl}
              onDeleted={onDeleted}
              onRefresh={onRefresh}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

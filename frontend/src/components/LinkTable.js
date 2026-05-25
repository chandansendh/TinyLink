import React from "react";
import LinkRow from "./LinkRow";

export default function LinkTable({ links, baseUrl, onDeleted, onRefresh }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm border-collapse">
        <thead>
          <tr className="border-b border-slate-800 text-slate-400 font-semibold">
            <th className="pb-3 px-4 text-sm uppercase tracking-wider">Code</th>
            <th className="pb-3 px-4 text-sm uppercase tracking-wider">Destination URL</th>
            <th className="pb-3 px-4 text-sm uppercase tracking-wider text-center">Clicks</th>
            <th className="pb-3 px-4 text-sm uppercase tracking-wider">Last Clicked</th>
            <th className="pb-3 px-4 text-sm uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/40 text-slate-300">
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

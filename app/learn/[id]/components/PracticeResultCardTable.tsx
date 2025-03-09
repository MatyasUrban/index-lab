import React from "react";

interface PracticeResultCardTableProps {
  rows: Record<string, any>[];
  maxRows?: number;
  emptyMessage?: string;
  className?: string;
}

export function PracticeResultCardTable({
  rows,
  maxRows = 50,
  emptyMessage = "No data available",
  className = "",
}: PracticeResultCardTableProps) {
  if (!rows || rows.length === 0) {
    return (
      <div className={`p-4 text-center text-gray-500 ${className}`}>
        {emptyMessage}
      </div>
    );
  }

  const displayRows = rows.slice(0, maxRows);
  const hasMoreRows = rows.length > maxRows;

  const columns = Object.keys(displayRows[0]);

  return (
    <div
      className={`max-h-[400px] overflow-auto border rounded-md ${className}`}
    >
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 sticky top-0">
          <tr>
            {columns.map((column) => (
              <th
                key={column}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {displayRows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {Object.values(row).map((value, valueIndex) => (
                <td
                  key={valueIndex}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                >
                  {String(value)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {hasMoreRows && (
        <div className="p-2 text-center text-sm text-gray-500 bg-gray-50 border-t">
          Showing {maxRows} of {rows.length} rows
        </div>
      )}
    </div>
  );
}

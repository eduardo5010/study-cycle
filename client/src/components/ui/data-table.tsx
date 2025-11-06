import * as React from "react";

export interface Column<T> {
  header: string;
  accessorKey: keyof T | "actions" | "id";
  cell?: (props: { row: T }) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: readonly Column<T>[];
  data: T[];
}

export function DataTable<T>({ columns, data }: DataTableProps<T>) {
  return (
    <div className="rounded-md border">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/50">
            {columns.map((column) => (
              <th
                key={String(column.accessorKey)}
                className="p-2 text-left font-medium"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b">
              {columns.map((column) => (
                <td key={String(column.accessorKey)} className="p-2">
                  {column.cell
                    ? column.cell({ row })
                    : column.accessorKey !== "actions"
                    ? String(row[column.accessorKey as keyof T])
                    : ""}
                </td>
              ))}
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
                className="p-2 text-center text-muted-foreground"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// TODO: fix type data and column

interface ITableData {
  title: string;
  peopleHappiness: string;
}

interface ITableColumnTitle {
  title: string;
  align?: 'left' | 'center' | 'right';
}

export default function TableJustDisplay({ columns, data }: { columns: ITableColumnTitle[]; data: ITableData[] }) {
  return (
    <div className="my-6 w-full overflow-y-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                align={column.align}
                className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right"
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="even:bg-muted m-0 border-t p-0">
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  align={column.align}
                  className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right"
                >
                  {row[column.title as keyof ITableData] as string}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

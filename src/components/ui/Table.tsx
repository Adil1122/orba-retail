'use client';

import React from 'react';

export interface TableColumn<T> {
  key: string;
  header: string;
  align?: 'left' | 'right' | 'center';
  render: (row: T, index: number) => React.ReactNode;
  className?: string;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  rowKey: (row: T, index: number) => string;
  onRowClick?: (row: T) => void;
  empty?: React.ReactNode;
}

export function Table<T>({ columns, data, rowKey, onRowClick, empty }: TableProps<T>) {
  if (!data.length && empty) return <>{empty}</>;

  return (
    <div className="w-full overflow-x-auto rounded-[16px] border border-[#E9E1D5] bg-white">
      <table className="w-full border-collapse text-left min-w-[540px]">
        <thead>
          <tr className="border-b border-[#E9E1D5] bg-[#F8F2E9]">
            {columns.map((col) => (
              <th
                key={col.key}
                className={[
                  'py-2.5 px-3.5 text-[12px] font-bold uppercase tracking-wider text-[#5B6585]',
                  col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left',
                  col.className || '',
                ].join(' ')}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#F6F0E7]">
          {data.map((row, idx) => (
            <tr
              key={rowKey(row, idx)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={[
                'row transition-colors',
                onRowClick ? 'cursor-pointer' : '',
              ].join(' ')}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={[
                    'py-3 px-3.5 text-[14px] text-[#162660]',
                    col.align === 'right' ? 'text-right num' : col.align === 'center' ? 'text-center' : 'text-left',
                    col.className || '',
                  ].join(' ')}
                >
                  {col.render(row, idx)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

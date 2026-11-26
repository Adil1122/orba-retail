'use client';

import React from 'react';
import type { ProductItem } from '@/types/pos';
import { rs } from '@/lib/common';
import { Table, type TableColumn } from '@/components/ui/Table';
import { StatusIndicator } from './StatusIndicator';
import { EmptyState } from '@/components/ui/EmptyState';

export interface StockTableProps {
  items: ProductItem[];
  onSelect?: (item: ProductItem) => void;
}

export function StockTable({ items, onSelect }: StockTableProps) {
  const columns: TableColumn<ProductItem>[] = [
    {
      key: 'name',
      header: 'Item',
      render: (row) => (
        <div className="min-w-0">
          <div className="font-semibold text-[#162660] truncate">{row.name}</div>
          <div className="text-[12px] text-[#5B6585]">{row.cat}</div>
        </div>
      ),
    },
    {
      key: 'sku',
      header: 'SKU',
      render: (row) => <span className="mono text-[12px] text-[#454F70]">{row.sku || row.id}</span>,
    },
    {
      key: 'price',
      header: 'Sell Price',
      align: 'right',
      render: (row) => <span className="num font-semibold">{rs(row.price)}</span>,
    },
    {
      key: 'stock',
      header: 'On Hand',
      align: 'right',
      render: (row) => {
        const qty =
          row.stock ??
          (row.variants ? row.variants.reduce((sum, v) => sum + (v.stock || 0), 0) : 0);
        return <span className="num font-bold">{qty}</span>;
      },
    },
    {
      key: 'status',
      header: 'Status',
      align: 'right',
      render: (row) => {
        const qty =
          row.stock ??
          (row.variants ? row.variants.reduce((sum, v) => sum + (v.stock || 0), 0) : 0);
        const st = qty <= 0 ? 'out' : qty <= 5 ? 'low' : 'online';
        return (
          <StatusIndicator
            status={st}
            label={qty <= 0 ? 'Out of stock' : qty <= 5 ? 'Low stock' : 'In stock'}
          />
        );
      },
    },
  ];

  return (
    <Table
      columns={columns}
      data={items}
      rowKey={(row) => row.id}
      onRowClick={onSelect}
      empty={
        <EmptyState
          icon="box"
          title="No stock items found"
          description="Adjust your search or add a new item to inventory."
        />
      }
    />
  );
}

'use client';
import { Payout } from '@/@types/user';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export const columns: ColumnDef<Payout>[] = [
  {
    accessorKey: 'orderId',
    header: 'ORDER ID'
  },
  {
    accessorKey: 'payout',
    header: 'AMOUNT($)'
  },
  {
    accessorKey: 'transferId',
    header: 'STRIPE PAYMENT ID'
  },
  {
    accessorKey: 'status',
    header: 'STATUS',
    cell: ({ row }) => {
      const status = row.getValue<string>('status');
      return (
        <div>
          {status === 'paid' ? (
            <span className="me-2 rounded bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
              PAID
            </span>
          ) : status === 'pending' ? (
            <span className="me-2 rounded bg-red-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
              PENDNG
            </span>
          ) : status === 'failed' ? (
            <span className="me-2 rounded bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-300">
              FAILED
            </span>
          ) : null}
        </div>
      );
    }
  },
  {
    accessorKey: 'createdAt',
    header: 'DATE',
    cell: ({ row }) => {
      const order_date = row.getValue<string>('createdAt');
      return (
        <p>{`${new Date(order_date).toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}`}</p>
      );
    }
  },

  {
    id: 'actions',
    header: 'ACTIONS',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];

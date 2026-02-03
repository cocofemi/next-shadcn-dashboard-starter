'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Orders, ShippingLabelTransactions } from '@/@types/user';

export const columns: ColumnDef<ShippingLabelTransactions>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  // {
  //   accessorKey: 'relatedOrderId',
  //   header: 'ORDER ID',
  //   cell: ({ row }) => {
  //     const order = row.getValue<Orders>('relatedOrderId');
  //     return (
  //       <div>
  //         <p className="uppercase">{`${order.orderId}`}</p>
  //       </div>
  //     );
  //   }
  // },
  {
    accessorKey: 'type',
    header: 'TYPE',
    cell: ({ row }) => {
      const type = row.getValue<string>('type');
      return <p className="uppercase">{type}</p>;
    }
  },
  {
    accessorKey: 'balanceBefore',
    header: 'BALANCE BEFORE'
  },

  {
    accessorKey: 'balanceAfter',
    header: 'BALANCE AFTER'
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
  }
  // {
  //   accessorKey: 'gender',
  //   header: 'GENDER'
  // },
  // {
  //   id: 'actions',
  //   cell: ({ row }) => <CellAction data={row.original} />
  // }
];

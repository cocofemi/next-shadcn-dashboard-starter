'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { Labels, Orders, Stores } from '@/@types/user';
import { CellAction } from './cell-action';
import Link from 'next/link';

export const columns: ColumnDef<Labels>[] = [
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

  {
    accessorKey: 'orderId',
    header: 'ORDER ID',
    cell: ({ row }) => {
      const data = row.getValue<Orders>('orderId');
      return (
        <div>
          <p className="uppercase">{`${data?.orderId}`}</p>
        </div>
      );
    }
  },
  {
    accessorKey: 'storeId',
    header: 'STORE NAME',
    cell: ({ row }) => {
      const store = row.getValue<Stores>('storeId');
      return (
        <div>
          <p className="uppercase">{`${store.storeName}`}</p>
        </div>
      );
    }
  },

  {
    accessorKey: 'trackingNumber',
    header: 'TRACKING NUMBER',
    cell: ({ row }) => {
      const trackingNumber = row.getValue<Orders>('trackingNumber');
      return (
        <div>
          <p className="uppercase">{`${trackingNumber}`}</p>
        </div>
      );
    }
  },

  {
    accessorKey: 'carrier',
    header: 'CARRIER',
    cell: ({ row }) => {
      const carrier = row.getValue<Orders>('carrier');
      return (
        <div>
          <p className="uppercase">{`${carrier}`}</p>
        </div>
      );
    }
  },
  {
    accessorKey: 'cost',
    header: 'COST ($)'
  },
  {
    accessorKey: 'labelUrl',
    header: 'DOWNLOAD URL',
    cell: ({ row }) => {
      const link = row.getValue<string>('labelUrl');
      return (
        <Link
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-blue-600 underline transition-colors hover:text-blue-800 hover:no-underline"
        >
          Download Label
        </Link>
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
  }

  // {
  //   id: 'actions',
  //   cell: ({ row }) => <CellAction data={row.original} />
  // }
];

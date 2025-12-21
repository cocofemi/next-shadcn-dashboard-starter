'use client';

import { Row } from '@tanstack/react-table'; // Import Row type
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import Cookies from 'universal-cookie';
import { Fulfilled, Orders } from '@/@types/user';
import { CellAction } from './cell-action';

const cookies = new Cookies();
const user = cookies.get('user');

export const columns: ColumnDef<Orders>[] = [
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
    header: 'Order ID'
  },

  {
    accessorKey: 'name',
    header: 'NAME',
    cell: ({ row }) => {
      const name = row.getValue<Orders>('name');
      //const name = row.getValue<string | null>('email');
      return (
        <div>
          <p className="lowercase">{`${name}`}</p>
        </div>
      );
    }
  },
  {
    accessorKey: 'phoneNumber',
    header: 'PHONE NUMBER',
    cell: ({ row }) => {
      const phoneNumber = row.getValue<Orders>('phoneNumber');
      return (
        <div>
          <p className="lowercase">{`${phoneNumber}`}</p>
        </div>
      );
    }
  },
  {
    accessorKey: 'email',
    header: 'EMAIL',
    cell: ({ row }) => {
      const email = row.getValue<Orders>('email');
      return (
        <div>
          <p className="lowercase">{`${email}`}</p>
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
    accessorKey: 'fulfilled',
    header: 'SHIPPED',
    cell: ({ row }) => {
      const fulfilledArray = row.getValue<Fulfilled[]>('fulfilled');
      const fulfilled = fulfilledArray?.[0]; // take the first element
      return (
        <div>
          {fulfilled?.fulfilled === true ? (
            <span className="me-2 rounded bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
              YES
            </span>
          ) : (
            <span className="me-2 rounded bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-300">
              NO
            </span>
          )}
        </div>
      );
    }
  },
  ...(user?.role === 'store'
    ? [
        {
          accessorKey: 'fulfilled',
          header: 'FULFILLED',
          cell: ({ row }: { row: Row<any> }) => {
            const fulfilledArray = row.getValue<Array<Fulfilled>>('fulfilled');
            return (
              <div>
                {fulfilledArray && fulfilledArray.length > 0 ? (
                  fulfilledArray.map((fulfilledItem: any, index: any) => (
                    <p key={index}>{fulfilledItem.fulfilled ? 'Yes' : 'No'}</p>
                  ))
                ) : (
                  <p>No Data</p>
                )}
              </div>
            );
          }
        }
      ]
    : []),

  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];

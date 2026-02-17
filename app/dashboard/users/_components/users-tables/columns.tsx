'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { Users } from '@/@types/user';
import { CellAction } from './cell-action';

export const columns: ColumnDef<Users>[] = [
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
  //   accessorKey: '_id',
  //   header: 'ID'
  // },
  {
    accessorKey: 'firstname',
    header: 'FIRST NAME'
  },
  {
    accessorKey: 'lastname',
    header: 'LAST NAME'
  },
  {
    accessorKey: 'email',
    header: 'EMAIL',
    cell: ({ row }) => {
      const email = row.getValue<boolean>('email');
      return (
        <div>
          <p className="lowercase">{email}</p>
        </div>
      );
    }
  },
  {
    accessorKey: 'phoneNumber',
    header: 'PHONE NUMBER'
  },
  // {
  //   accessorKey: 'gender',
  //   header: 'GENDER'
  // },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];

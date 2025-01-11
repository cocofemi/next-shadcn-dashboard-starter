'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { Stores } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<Stores>[] = [
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
    accessorKey: 'storeName',
    header: 'NAME'
  },
  {
    accessorKey: 'location',
    header: 'LOCATION'
  },
  {
    accessorKey: 'active',
    header: 'ACTIVE',
    cell: ({ row }) => {
      const active = row.getValue<boolean>('active');
      return (
        <div>
          <p>{active === true ? 'Yes' : 'No'}</p>
        </div>
      );
    }
  },
  {
    accessorKey: 'description',
    header: 'DESCRIPTION'
  },
  // {
  //   accessorKey: 'gender',
  //   header: 'GENDER'
  // },
  {
    id: 'actions'
    //cell: ({ row }) => <CellAction data={row.original} />
  }
];

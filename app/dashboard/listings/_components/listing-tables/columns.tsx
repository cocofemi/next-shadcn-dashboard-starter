'use client';
import { Listing, ListingImage } from '@/@types/user';
import { createSlug } from '@/lib/create-slug';
import { ColumnDef } from '@tanstack/react-table';
import { ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { CellAction } from './cell-action';

export const columns: ColumnDef<Listing>[] = [
  {
    accessorKey: 'listingImage',
    header: 'IMAGE',
    cell: ({ row }) => {
      const images = row.getValue<ListingImage[]>('listingImage');
      const imageUrl = images?.[0]?.url || '';
      return (
        <div className="relative aspect-square">
          <Image src={imageUrl} alt={'listing'} fill className="rounded-lg" />
        </div>
      );
    }
  },
  {
    accessorKey: 'listingName',
    header: 'NAME'
  },
  {
    accessorKey: 'category',
    header: 'CATEGORY'
  },
  {
    accessorKey: 'price',
    header: 'PRICE($)'
  },
  {
    accessorKey: 'quantity',
    header: 'QUANTITY'
  },
  {
    accessorKey: 'sku',
    header: 'SKU'
  },
  {
    accessorKey: 'upc',
    header: 'UPC'
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
    accessorKey: 'description',
    header: 'DESCRIPTION',
    cell: ({ row }) => {
      const description = row.getValue<string>('description');
      return <p>{`${description.substring(0, 20)}...`}</p>;
    }
  },
  // {
  //   accessorKey: '_id',
  //   header: 'VIEW',
  //   cell: ({ row }) => {
  //     const id = row.getValue<string>('_id');
  //     const listingName = row.getValue<string>('listingName');
  //     return (
  //       <>
  //         <a
  //           href={`${process.env.NEXT_PUBLIC_URL}/listing/${createSlug(listingName)}?id=${id}`}
  //           target="_blank"
  //         >
  //           <ExternalLink />
  //         </a>
  //       </>
  //     );
  //   }
  // },

  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];

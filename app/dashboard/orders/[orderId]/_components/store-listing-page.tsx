'use client';

import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Listing } from '@/constants/data';
import StoreTable from './store-tables';
import React, { useEffect, useState } from 'react';
import { getStoreListing } from '@/utils/store';
import { useSearchParams } from 'next/navigation';

type TUserListingPage = {};

export default function StoreListingPage({}: TUserListingPage) {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [totalListings, setTotalListings] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [storeListing, setStoreListing] = React.useState<Listing[]>([]);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 600);
    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  React.useEffect(() => {
    setLoading(true);
    getStoreListing(id, page, limit, debouncedSearch)
      .then((res) => {
        setStoreListing(res?.data);
        setTotalListings(res?.meta.total);
      })
      .finally(() => setLoading(false));
  }, [page, debouncedSearch]);

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading title={`Listings (${totalListings})`} description="" />

          {/* <Link
            href={'/dashboard/employee/new'}
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link> */}
        </div>
        <Separator />
        <StoreTable
          data={storeListing}
          totalData={totalListings}
          search={search}
          setSearch={setSearch}
          page={page}
          limit={limit}
          setPage={setPage}
          setLimit={setLimit}
          loading={loading}
        />
      </div>
    </PageContainer>
  );
}

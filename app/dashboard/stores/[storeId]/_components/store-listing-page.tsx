'use client';

import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import StoreTable from './store-tables';
import React, { useEffect, useState } from 'react';
import { getStoreListing } from '@/utils/store';
import { useSearchParams } from 'next/navigation';
import { Listing } from '@/@types/user';
import { Spinner } from '@/components/ui/spinner';

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
    getStoreListing(id, page, limit, debouncedSearch).then((res) => {
      setStoreListing(res?.data);

      setTotalListings(res?.meta.total);
    });
  }, [page, debouncedSearch]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
        <span className="ml-3 text-gray-500">Loading listings...</span>
      </div>
    );
  }

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading title={`Listings (${totalListings})`} description="" />
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

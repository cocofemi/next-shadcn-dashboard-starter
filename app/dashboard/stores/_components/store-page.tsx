'use client';

import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import StoreTable from './store-tables';
import React, { useEffect, useState } from 'react';
import { CurrentUserContextType, Stores } from '@/@types/user';
import { UserContext } from '@/context/UserProvider';
import { getAllStores } from '@/utils/store';
import { Spinner } from '@/components/ui/spinner';

type TUserListingPage = {};

export default function StorePage({}: TUserListingPage) {
  const { user } = React.useContext(UserContext) as CurrentUserContextType;

  const [totalStores, setTotalStores] = useState<number>(0);
  const [stores, setStores] = useState<Stores[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 600);
    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    if (user?.token) {
      setLoading(true);
      getAllStores(page, limit, debouncedSearch, user?.token)
        .then((res) => {
          setStores(res?.stores);
          setTotalStores(res?.meta.total);
        })
        .finally(() => setLoading(false));
    }
  }, [user, page, debouncedSearch]);

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading title={`Stores (${totalStores})`} description="" />
        </div>
        <Separator />
        <StoreTable
          data={stores}
          totalData={totalStores}
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

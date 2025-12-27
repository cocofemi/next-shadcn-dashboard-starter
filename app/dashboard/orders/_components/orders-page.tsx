'use client';

import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import OrdersTable from './order-tables';
import React, { useEffect, useState } from 'react';
import { CurrentUserContextType, Orders } from '@/@types/user';
import { UserContext } from '@/context/UserProvider';
import { getAllOrders } from '@/utils/orders';
import { getStoreOrders } from '@/utils/store';

type TUserListingPage = {};

export default function OrdersPage({}: TUserListingPage) {
  const { user } = React.useContext(UserContext) as CurrentUserContextType;

  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [orders, setOrders] = useState<Orders[]>([]);
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
    if (user.role === 'admin') {
      setLoading(true);
      getAllOrders(page, limit, debouncedSearch)
        .then((res) => {
          setOrders(res?.orders);
          setTotalOrders(res?.meta.total);
        })
        .finally(() => setLoading(false));
    }
  }, [user, page, debouncedSearch]);

  useEffect(() => {
    if (user.role === 'store') {
      setLoading(true);
      getStoreOrders(user?.storeId, page, limit, debouncedSearch)
        .then((res) => {
          setOrders(res?.data);
          setTotalOrders(res?.meta.total);
        })
        .finally(() => setLoading(false));
    }
  }, [user, page, debouncedSearch]);

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading title={`Orders (${totalOrders})`} description="" />
        </div>
        <Separator />
        <OrdersTable
          data={orders}
          totalData={totalOrders}
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

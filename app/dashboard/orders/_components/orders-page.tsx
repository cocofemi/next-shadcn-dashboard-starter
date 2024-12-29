'use client';

import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Listing, Orders } from '@/constants/data';
import ListingTable from './order-tables';
import React, { useEffect, useState } from 'react';
import { CurrentUserContextType } from '@/@types/user';
import { UserContext } from '@/context/UserProvider';
import { getAllOrders } from '@/utils/orders';

type TUserListingPage = {};

export default function OrdersPage({}: TUserListingPage) {
  const { user } = React.useContext(UserContext) as CurrentUserContextType;

  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [orders, setOrders] = useState<Orders[]>([]);
  const [search, setSearch] = useState(''); // Search query
  const [filteredOrders, setFilteredOrders] = useState<Orders[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  useEffect(() => {
    if (user?.token) {
      getAllOrders(page, limit, user?.token).then((res) => {
        console.log(res?.orders);
        setOrders(res?.orders);
        setFilteredOrders(res?.orders);
        setTotalOrders(res?.meta.total);
      });
    }
  }, [user, page]);

  // Filter the data based on the search query
  useEffect(() => {
    const filtered = orders.filter(
      (order) =>
        order?.orderId.toLowerCase().includes(search.toLowerCase()) ||
        order?.fulfilled.toString().toLowerCase().includes(search.toLowerCase())
    );
    setFilteredOrders(filtered);
  }, [search, orders]);

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading title={`Orders (${totalOrders})`} description="" />

          {/* <Link
            href={'/dashboard/employee/new'}
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link> */}
        </div>
        <Separator />
        <ListingTable
          data={filteredOrders}
          totalData={totalOrders}
          search={search}
          setSearch={setSearch}
          page={page}
          limit={limit}
          setPage={setPage}
          setLimit={setLimit}
        />
      </div>
    </PageContainer>
  );
}
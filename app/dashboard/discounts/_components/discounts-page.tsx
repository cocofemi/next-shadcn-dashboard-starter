'use client';

import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import React, { useEffect, useState } from 'react';
import { CurrentUserContextType, Discounts } from '@/@types/user';
import { UserContext } from '@/context/UserProvider';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { getAllDiscounts } from '@/utils/discount';
import DiscountsTable from './discounts-tables';

type TUserListingPage = {};

export default function DiscountsPage({}: TUserListingPage) {
  const { user } = React.useContext(UserContext) as CurrentUserContextType;

  const [totalDiscounts, setTotalDiscounts] = useState<number>(0);

  const [discounts, setDiscounts] = useState<Discounts[]>([]);
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
    if (user?.role === 'admin') {
      setLoading(true);
      getAllDiscounts(page, limit, debouncedSearch)
        .then((res) => {
          setDiscounts(res?.discounts);
          setTotalDiscounts(res?.meta.total);
        })
        .finally(() => setLoading(false));
    }
  }, [user, page, debouncedSearch]);

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading title={`Discounts (${totalDiscounts})`} description="" />
          <Link
            href={'/dashboard/discounts/create'}
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            <Plus className="mr-2 h-4 w-4" /> New Discount
          </Link>
        </div>
        <Separator />
        <DiscountsTable
          data={discounts}
          totalData={totalDiscounts}
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

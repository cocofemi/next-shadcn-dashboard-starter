'use client';

import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import {
  storePaymentOnboarding,
  storePayoutCompleteCheck
} from '@/utils/store';
import PaymentsTable from './discounts-tables';
import React, { useEffect, useState } from 'react';
import { CurrentUserContextType, Listing, Payout } from '@/@types/user';
import { UserContext } from '@/context/UserProvider';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Plus, Loader2 } from 'lucide-react';
import { getAllPayouts, getStorePayouts } from '@/utils/payouts';
import { useRouter } from 'next/navigation';

type TUserListingPage = {};

export default function DiscountsPage({}: TUserListingPage) {
  const router = useRouter();
  const { user } = React.useContext(UserContext) as CurrentUserContextType;

  const [totalPayouts, setTotalPayouts] = useState<number>(0);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [enableLoading, setEnableLoading] = useState<boolean>(false);

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

      getAllPayouts(page, limit, debouncedSearch)
        .then((res) => {
          setPayouts(res?.payouts);
          setTotalPayouts(res?.meta.total);
        })
        .finally(() => setLoading(false));
    }
  }, [user, page, debouncedSearch]);

  useEffect(() => {
    if (user?.role === 'store') {
      setLoading(true);
      getStorePayouts(user?.storeId, page, limit, debouncedSearch)
        .then((res) => {
          setPayouts(res?.payouts);
          setTotalPayouts(res?.meta.total);
        })
        .finally(() => setLoading(false));
    }
  }, [user, page, debouncedSearch]);

  useEffect(() => {
    if (user?.role === 'admin') return;
  }, [user]);

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading title={`Discounts (${totalPayouts})`} description="" />
          {user?.role === 'admin' && (
            <Button
              onClick={() => router.push('/dashboard/discounts/create')}
              disabled={enableLoading}
              className={cn(buttonVariants({ variant: 'default' }))}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Discount{' '}
            </Button>
          )}
        </div>
        <Separator />
        <PaymentsTable
          data={payouts}
          totalData={totalPayouts}
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

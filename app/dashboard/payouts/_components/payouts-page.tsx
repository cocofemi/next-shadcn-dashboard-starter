'use client';

import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import {
  storePaymentOnboarding,
  storePayoutCompleteCheck
} from '@/utils/store';
import PaymentsTable from './payouts-tables';
import React, { useEffect, useState } from 'react';
import { CurrentUserContextType, Listing } from '@/@types/user';
import { UserContext } from '@/context/UserProvider';
import { getAllListing } from '@/utils/listings';
import { getStoreListing } from '@/utils/store';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Plus, Loader2 } from 'lucide-react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@/components/ui/hover-card';

type TUserListingPage = {};

export default function PayoutsPage({}: TUserListingPage) {
  const { user } = React.useContext(UserContext) as CurrentUserContextType;

  const [totalListings, setTotalListings] = useState<number>(0);
  const [listings, setListings] = useState<Listing[]>([]);
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
    if (user?.token && user?.role === 'admin') {
      setLoading(true);
      getAllListing(page, limit, debouncedSearch)
        .then((res) => {
          setListings(res?.data);
          setTotalListings(res?.meta.total);
        })
        .finally(() => setLoading(false));
    }
  }, [user, page, debouncedSearch]);

  useEffect(() => {
    if (user?.token && user?.role === 'store') {
      setLoading(true);
      getStoreListing(user?.storeId, page, limit, debouncedSearch)
        .then((res) => {
          setListings(res?.data);
          setTotalListings(res?.meta.total);
        })
        .finally(() => setLoading(false));
    }
  }, [user, page, debouncedSearch]);

  const handleOnboarding = () => {
    setEnableLoading(true);
    storePaymentOnboarding(user?.storeId, user?.token)
      .then((res) => {
        console.log(res);
        if (res?.url) window.location.href = res?.url;
        setLoading(false);
      })
      .finally(() => setEnableLoading(false));
  };

  // useEffect(() => {
  //   if (user?.token) {
  //     storePayoutCompleteCheck(user?.storeId, user?.token).then(() => {
  //       console.log('Success');
  //     });
  //   }
  // }, [user]);

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading title={`Payouts (${totalListings})`} description="" />
          {user?.role === 'store' && !user?.stripeOnboardingComplete && (
            <HoverCard>
              <HoverCardTrigger>
                <Button
                  onClick={handleOnboarding}
                  disabled={enableLoading}
                  className={cn(buttonVariants({ variant: 'default' }))}
                >
                  <Plus className="mr-2 h-4 w-4" /> Enable payments{' '}
                  {enableLoading && <Loader2 className="animate-spin" />}
                </Button>
              </HoverCardTrigger>
              <HoverCardContent>
                Enable payments to start receiving payouts directly to your
                bank. We use stripe to securely handle all transactions. Make
                sure you have all your business details ready and a valid bank
                account.
              </HoverCardContent>
            </HoverCard>
          )}
        </div>
        <Separator />
        <PaymentsTable
          data={listings}
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

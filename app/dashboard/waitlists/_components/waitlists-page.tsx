'use client';

import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import BlogsTable from './blogs-tables';
import React, { useEffect, useState } from 'react';
import { Blogs, CurrentUserContextType, Waitlist } from '@/@types/user';
import { UserContext } from '@/context/UserProvider';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { getBlogs, getWailtists } from '@/utils/blogs';

type TUserListingPage = {};

export default function WaitlistsPage({}: TUserListingPage) {
  const { user } = React.useContext(UserContext) as CurrentUserContextType;

  const [totalWaitlists, setTotalWaitlists] = useState<number>(0);

  const [waitlists, setWaitlists] = useState<Waitlist[]>([]);
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
      getWailtists()
        .then((res) => {
          setWaitlists(res?.waitlists);
          setTotalWaitlists(res?.meta.total);
        })
        .finally(() => setLoading(false));
    }
  }, [page, debouncedSearch]);

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading title={`Waitlists (${totalWaitlists})`} description="" />
        </div>
        <Separator />
        <BlogsTable
          data={waitlists}
          totalData={totalWaitlists}
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

'use client';

import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import React, { useEffect, useState } from 'react';
import { getAllUsers } from '@/utils/user';
import { CurrentUserContextType, Users } from '@/@types/user';
import { UserContext } from '@/context/UserProvider';
import UsersTable from './users-tables';
import { Spinner } from '@/components/ui/spinner';

type TUserListingPage = {};

export default function UsersPage({}: TUserListingPage) {
  const { user } = React.useContext(UserContext) as CurrentUserContextType;

  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [users, setUsers] = useState<Users[]>([]);
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
      getAllUsers(page, user?.token, limit, debouncedSearch)
        .then((res) => {
          setUsers(res?.users);
          setTotalUsers(res?.meta.total);
        })
        .finally(() => setLoading(false));
    }
  }, [user, page, debouncedSearch]);

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading title={`Users (${totalUsers})`} description="" />
        </div>
        <Separator />
        <UsersTable
          data={users}
          totalData={totalUsers}
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

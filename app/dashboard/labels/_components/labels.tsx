'use client';

import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import LabelsTable from './label-tables';
import React, { useEffect, useState } from 'react';
import { CurrentUserContextType, Labels, Orders } from '@/@types/user';
import { UserContext } from '@/context/UserProvider';
import { getAllLabels, getStoreLabels } from '@/utils/labels';

export default function LablesPage() {
  const { user } = React.useContext(UserContext) as CurrentUserContextType;

  const [totalLabels, setTotalLabels] = useState<number>(0);
  const [labels, setLabels] = useState<Labels[]>([]);
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
      getAllLabels(page, limit, debouncedSearch)
        .then((res) => {
          setLabels(res?.labels);
          setTotalLabels(res?.meta.total);
        })
        .finally(() => setLoading(false));
    }
  }, [user, page, debouncedSearch]);

  useEffect(() => {
    if (user.role === 'store') {
      setLoading(true);
      getStoreLabels(user?.storeId, page, limit, debouncedSearch)
        .then((res) => {
          console.log(res);
          setLabels(res?.labels);
          setTotalLabels(res?.meta.total);
        })
        .finally(() => setLoading(false));
    }
  }, [user, page, debouncedSearch]);

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading title={`Shipping Labels (${totalLabels})`} description="" />
        </div>
        <Separator />
        <LabelsTable
          data={labels}
          totalData={totalLabels}
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

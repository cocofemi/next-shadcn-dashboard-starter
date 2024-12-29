import { searchParamsCache } from '@/lib/searchparams';
import { SearchParams } from 'nuqs/server';
import React from 'react';
import OrdersPage from './_components/orders-page';

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export const metadata = {
  title: 'Dashboard : Users'
};

export default async function Page(props: pageProps) {
  const searchParams = await props.searchParams;
  // Allow nested RSCs to access the search params (in a type-safe way)
  searchParamsCache.parse(searchParams);

  return <OrdersPage />;
}
import { searchParamsCache } from '@/lib/searchparams';
import { SearchParams } from 'nuqs/server';
import React from 'react';
import LabelsPage from './_components/labels';

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export const metadata = {
  title: 'Dashboard : Shipping Labels'
};

export default async function Page(props: pageProps) {
  const searchParams = await props.searchParams;
  // Allow nested RSCs to access the search params (in a type-safe way)
  searchParamsCache.parse(searchParams);

  return <LabelsPage />;
}

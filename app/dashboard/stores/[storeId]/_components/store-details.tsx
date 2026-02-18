'use client';
import * as React from 'react';
import Image from 'next/image';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription
} from '@/components/ui/card';
import { getStore } from '@/utils/store';
import { useSearchParams, useParams } from 'next/navigation';
import { useState } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { IdCard } from 'lucide-react';

interface IStore {
  _id: string;
  storeName: string;
  description: string;
  social: string;
  website: string;
  location: string;
  displayPicture: string;
}

export default function StoreDetails() {
  const search = useSearchParams();
  const id = search.get('id');
  const [loading, setLoading] = useState<boolean>(false);

  const [store, setStore] = React.useState<IStore>({
    _id: '',
    storeName: '',
    description: '',
    social: '',
    website: '',
    location: '',
    displayPicture: ''
  });

  React.useEffect(() => {
    setLoading(true);
    getStore(id)
      .then((res) => {
        console.log('store details', res);
        setLoading(false);
        setStore(res?.store);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
        <span className="ml-3 text-gray-500">Loading store profile...</span>
      </div>
    );
  }

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-left text-2xl font-bold capitalize">
          {store?.storeName}
          {store?.displayPicture != '' && (
            <div className="">
              <img
                src={store?.displayPicture}
                alt="my image"
                className="mb-3 w-32 rounded-lg"
              />
              <CardDescription>{store?.description}</CardDescription>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}

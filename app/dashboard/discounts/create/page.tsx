import React from 'react';
import { CreateDiscount } from '../_components/create-discount-form';

export const metadata = {
  title: 'Dashboard : Create-Discount'
};

export default async function Page() {
  return (
    <div className="p-4">
      <CreateDiscount />
    </div>
  );
}

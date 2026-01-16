import React from 'react';

import { DiscountDetailsPage } from './_components/discount-view-page';
import NewBlogForm from '../../blogs/_components/blog-form';

export const metadata = {
  title: 'Dashboard : Discount Detail View'
};

export default function Page() {
  return (
    <div className="p-4">
      <DiscountDetailsPage />
    </div>
  );
}

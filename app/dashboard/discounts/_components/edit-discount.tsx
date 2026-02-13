'use client';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Discounts } from '@/@types/user';
import { useSearchParams } from 'next/navigation';

import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { deleteDiscount, getDiscount } from '@/utils/discount';
import EditDiscountForm from './edit-discount-form';
import { AlertModal } from '@/components/modal/alert-modal';

export default function EditDiscount() {
  const search = useSearchParams();
  const id = search.get('id');

  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deleteLoading, setDeleteLoading] = React.useState<boolean>(false);

  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    getDiscount(id).then((res) => {
      setDiscount(res?.data);
      setLoading(false);
    });
  }, []);

  const [discount, setDiscount] = React.useState<Discounts | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatValue = (type: string, value: number) => {
    return type === 'percentage' ? `${value}%` : `$${value}`;
  };

  React.useEffect(() => {
    document.body.style.overflow = 'auto'; // Ensure scrolling is enabled
  }, []);

  const handleDelete = async () => {
    setDeleteLoading(true);
    await deleteDiscount(discount?._id).then((res) => {
      console.log('Response', res);
      setDeleteLoading(false);
      setDeleteOpen(false);
    });
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
        <span className="ml-3 text-gray-500">Loading discount...</span>
      </div>
    );
  }

  return (
    <>
      <Card className="mx-auto w-full">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            Edit Discount
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {discount && (
              <div className="flex items-start justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <code className="rounded bg-muted px-3 py-1 font-mono text-lg font-bold">
                      {discount.code}
                    </code>
                    <Badge
                      variant={discount.isActive ? 'default' : 'secondary'}
                    >
                      {discount.isActive ? 'Active' : 'Expired'}
                    </Badge>
                    <Badge variant="outline">
                      {formatValue(discount.type, discount.value)} off
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {discount.description}
                  </p>

                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {formatDate(discount.startDate)} -{' '}
                        {formatDate(discount.endDate)}
                      </span>
                    </div>
                    {discount.minPurchase > 0 && (
                      <span>Min: ${discount.minPurchase}</span>
                    )}
                    {discount.maxDiscount && (
                      <span>Max: ${discount.maxDiscount}</span>
                    )}
                    {discount.usageLimit && (
                      <span>
                        Used: {discount.usedCount}/{discount.usageLimit}
                      </span>
                    )}
                    {!discount.usageLimit && (
                      <span>Used: {discount.usedCount} times</span>
                    )}
                  </div>
                </div>

                <div className="ml-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditOpen(true)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteOpen(true)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      {editOpen && discount && <EditDiscountForm discount={discount} />}
      <AlertModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />
    </>
  );
}

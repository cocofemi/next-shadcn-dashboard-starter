'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Calendar } from 'lucide-react';
import { useState } from 'react';
import EditDiscountPage from './edit-discount';

interface Discount {
  code: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  minPurchase: number;
  maxDiscount: number | null;
  usageLimit: number | null;
  usedCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export function DiscountDetailsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([
    {
      code: 'SAVE20',
      description: '20% off your entire order',
      type: 'percentage',
      value: 20,
      minPurchase: 50,
      maxDiscount: 100,
      usageLimit: 100,
      usedCount: 45,
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      isActive: true
    }
  ]);

  const [newDiscount, setNewDiscount] = useState<Partial<Discount>>({
    type: 'percentage',
    minPurchase: 0,
    usedCount: 0,
    isActive: true
  });
  const [editOpen, setEditOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

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

  const handleEdit = (index: number) => {
    setEditOpen(true);
    setEditingIndex(index);
    setNewDiscount(discounts[index]);
  };

  const handleSubmit = () => {
    if (editingIndex !== null) {
      // Update existing discount
      const updatedDiscounts = [...discounts];
      updatedDiscounts[editingIndex] = newDiscount as Discount;
      setDiscounts(updatedDiscounts);
      setEditingIndex(null);
    } else {
      // Create new discount
      setDiscounts([...discounts, newDiscount as Discount]);
    }
    // Reset form
    setNewDiscount({
      type: 'percentage',
      minPurchase: 0,
      usedCount: 0,
      isActive: true
    });
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setNewDiscount({
      type: 'percentage',
      minPurchase: 0,
      usedCount: 0,
      isActive: true
    });
  };

  return (
    <>
      {/* Active Discounts */}
      <Card className="mx-auto w-full">
        <CardHeader>
          <CardTitle>Discount Codes</CardTitle>
          <CardDescription>
            Manage your active and expired discount codes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {discounts.map((discount, index) => (
              <div
                key={index}
                className="flex items-start justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
              >
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
                    onClick={() => handleEdit(index)}
                  >
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      {editOpen && <EditDiscountPage />}
    </>
  );
}

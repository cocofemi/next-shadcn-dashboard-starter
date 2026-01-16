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
import { useState } from 'react';

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

export function CreateDiscount() {
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
    },
    {
      code: 'FREESHIP',
      description: 'Free shipping on orders over $100',
      type: 'fixed',
      value: 10,
      minPurchase: 100,
      maxDiscount: null,
      usageLimit: null,
      usedCount: 230,
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      isActive: true
    },
    {
      code: 'WINTER50',
      description: '$50 off winter collection',
      type: 'fixed',
      value: 50,
      minPurchase: 200,
      maxDiscount: null,
      usageLimit: 50,
      usedCount: 50,
      startDate: '2024-12-01',
      endDate: '2025-02-28',
      isActive: false
    }
  ]);

  const [newDiscount, setNewDiscount] = useState<Partial<Discount>>({
    type: 'percentage',
    minPurchase: 0,
    usedCount: 0,
    isActive: true
  });

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Discount Code</CardTitle>
        <CardDescription>
          Add a new discount code for your customers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <Input
                id="code"
                placeholder="SAVE20"
                className="uppercase"
                value={newDiscount.code || ''}
                onChange={(e) =>
                  setNewDiscount({
                    ...newDiscount,
                    code: e.target.value.toUpperCase()
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={newDiscount.type}
                onValueChange={(value) =>
                  setNewDiscount({
                    ...newDiscount,
                    type: value as 'percentage' | 'fixed'
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="20% off your entire order"
              value={newDiscount.description || ''}
              onChange={(e) =>
                setNewDiscount({
                  ...newDiscount,
                  description: e.target.value
                })
              }
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="value">Value</Label>
              <Input
                id="value"
                type="number"
                placeholder="20"
                value={newDiscount.value || ''}
                onChange={(e) =>
                  setNewDiscount({
                    ...newDiscount,
                    value: Number.parseFloat(e.target.value)
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minPurchase">Min Purchase ($)</Label>
              <Input
                id="minPurchase"
                type="number"
                placeholder="0"
                value={newDiscount.minPurchase || ''}
                onChange={(e) =>
                  setNewDiscount({
                    ...newDiscount,
                    minPurchase: Number.parseFloat(e.target.value)
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxDiscount">Max Discount ($)</Label>
              <Input
                id="maxDiscount"
                type="number"
                placeholder="Optional"
                value={newDiscount.maxDiscount || ''}
                onChange={(e) =>
                  setNewDiscount({
                    ...newDiscount,
                    maxDiscount: e.target.value
                      ? Number.parseFloat(e.target.value)
                      : null
                  })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="usageLimit">Usage Limit</Label>
              <Input
                id="usageLimit"
                type="number"
                placeholder="Unlimited"
                value={newDiscount.usageLimit || ''}
                onChange={(e) =>
                  setNewDiscount({
                    ...newDiscount,
                    usageLimit: e.target.value
                      ? Number.parseFloat(e.target.value)
                      : null
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={newDiscount.startDate || ''}
                onChange={(e) =>
                  setNewDiscount({
                    ...newDiscount,
                    startDate: e.target.value
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={newDiscount.endDate || ''}
                onChange={(e) =>
                  setNewDiscount({ ...newDiscount, endDate: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button className="w-[220px]">Create Discount Code</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

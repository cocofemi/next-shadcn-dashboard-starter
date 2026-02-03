'use client';

import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import React, { useEffect, useState } from 'react';
import {
  Blogs,
  CurrentUserContextType,
  ShippingLabelTransactions
} from '@/@types/user';
import { UserContext } from '@/context/UserProvider';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { getBlogs } from '@/utils/blogs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import WalletTransactionsTable from './wallet-tables';
import { toast } from 'sonner';
import { getShippingLabelTransactions } from '@/utils/labels';

export default function Wallet() {
  const { user } = React.useContext(UserContext) as CurrentUserContextType;

  const [totalTransactions, setTotalTransactions] = useState<number>(0);

  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [loadingTopUp, setLoadingTopUp] = useState(false);

  const [transactions, setTransactions] = useState<ShippingLabelTransactions[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  const handleTopUp = async (e: any) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setLoadingTopUp(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/wallet/topup`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: parseFloat(amount) }),
          credentials: 'include'
        }
      );

      const data = await response.json();
      if (data.success) {
        toast.success('Wallet updated');
        setAmount('');
        setOpen(false);
        // Refresh data
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingTopUp(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 600);
    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    if (user?.role === 'admin') {
      setLoading(true);
      getShippingLabelTransactions(page, limit, debouncedSearch)
        .then((res) => {
          console.log('Transactions', res);
          setTransactions(res?.transactions);
          setTotalTransactions(res?.meta.total);
        })
        .finally(() => setLoading(false));
    }
  }, [page, debouncedSearch]);

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`Shipping Wallet (${totalTransactions})`}
            description=""
          />
          <Button
            onClick={() => setOpen(true)}
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Top up
          </Button>
        </div>
        <Separator />
        <WalletTransactionsTable
          data={transactions}
          totalData={totalTransactions}
          search={search}
          setSearch={setSearch}
          page={page}
          limit={limit}
          setPage={setPage}
          setLimit={setLimit}
          loading={loading}
        />
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleTopUp}>
            <DialogHeader>
              <DialogTitle>Top Up Wallet</DialogTitle>
              <DialogDescription>
                Enter the amount to add to the wallet balance.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loadingTopUp}>
                {loadingTopUp ? 'Processing...' : 'Top Up'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}

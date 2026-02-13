'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, CheckCircle2, Info } from 'lucide-react';
import { getPayout } from '@/utils/payouts';
import { useParams } from 'next/navigation';
import { UserContext } from '@/context/UserProvider';
import { CurrentUserContextType } from '@/@types/user';
import { Spinner } from '@/components/ui/spinner';

interface PayoutDetail {
  storeId: string;
  orderId: string;
  gross: number;
  platformFee: number;
  stripeFee: number;
  payout: number;
  currencySymbol: string;
  platformFeeRate: number;
  transferId: string;
  status: string;
  processedAt: string;
}

const PayoutDetails = () => {
  const { user } = React.useContext(UserContext) as CurrentUserContextType;
  const params = useParams();
  const { payoutId } = params;

  const [payout, setPayout] = useState<PayoutDetail | null>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    if (user) {
      getPayout(payoutId).then((res) => {
        setPayout(res?.data);
        setLoading(false);
      });
    }
  }, [user]);

  React.useEffect(() => {
    document.body.style.overflow = 'auto'; // Ensure scrolling is enabled
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
        <span className="ml-3 text-gray-500">Loading payout...</span>
      </div>
    );
  }
  return (
    <Card className="mx-auto w-full max-w-2xl border-none shadow-md">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Payout Details</CardTitle>
          <Badge
            variant="secondary"
            className="border-none bg-green-100 text-green-700 hover:bg-green-100"
          >
            <CheckCircle2 className="mr-1 h-3 w-3" /> Processed
          </Badge>
        </div>
        <CardDescription>
          Your payout for <strong>Order #{payout?.orderId}</strong> has been
          successfully sent to your connected Stripe account.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Highlight Section */}
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-6 text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Net payout amount
          </p>
          <div className="mt-2 text-4xl font-bold text-slate-900">
            {payout?.currencySymbol}
            {payout?.payout?.toFixed(2)}
          </div>
          <div className="mx-auto mt-4 flex w-fit items-center justify-center rounded-full border bg-white px-3 py-1 text-sm text-muted-foreground shadow-sm">
            <CalendarDays className="mr-2 h-4 w-4 text-blue-500" />
            Expected arrival:{' '}
            <span className="ml-1 font-semibold text-slate-900">
              1–3 business days
            </span>
          </div>
        </div>

        {/* Breakdown Table */}
        <div className="space-y-3">
          <h3 className="ml-1 text-sm font-semibold text-slate-900">
            Payout breakdown
          </h3>
          <div className="rounded-md border">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="w-[70%]">Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Gross sales</TableCell>
                  <TableCell className="text-right font-medium">
                    {payout?.currencySymbol}
                    {payout?.gross.toFixed(2)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-sm text-muted-foreground">
                    Mehchant platform fee ({payout?.platformFeeRate}%)
                  </TableCell>
                  <TableCell className="text-right text-destructive">
                    − {payout?.currencySymbol}
                    {payout?.platformFee.toFixed(2)}
                  </TableCell>
                </TableRow>
                {payout?.stripeFee !== undefined && payout?.stripeFee > 0 && (
                  <TableRow>
                    <TableCell className="text-sm text-muted-foreground">
                      Stripe processing fee
                    </TableCell>
                    <TableCell className="text-right text-destructive">
                      − {payout?.currencySymbol}
                      {payout?.stripeFee.toFixed(2)}
                    </TableCell>
                  </TableRow>
                )}
                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                  <TableCell className="font-bold text-slate-900">
                    Net payout
                  </TableCell>
                  <TableCell className="text-right font-bold text-slate-900">
                    {payout?.currencySymbol}
                    {payout?.payout.toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Metadata */}
        <div className="space-y-1 text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>Transfer reference:</span>
            <span className="font-mono font-medium text-slate-700">
              {payout?.transferId}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Processed on:</span>
            <span className="font-medium text-slate-700">
              {payout?.processedAt}
            </span>
          </div>
        </div>
      </CardContent>

      <Separator />

      <CardFooter className="flex flex-col items-start space-y-4 p-6">
        <div className="flex gap-3">
          <div className="mt-1">
            <Info className="h-4 w-4 text-slate-400" />
          </div>
          <div className="text-xs leading-relaxed text-muted-foreground">
            <p>
              This payout was processed automatically by{' '}
              <strong>Mehchant</strong> using Stripe Connect.
            </p>
            <p className="mt-2">
              For accounting records or questions, you can view payout details
              in your Mehchant dashboard or contact support.
            </p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PayoutDetails;

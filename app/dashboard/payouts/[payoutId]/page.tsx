import PayoutDetails from './_components/payouts-view-page';

import React from 'react';
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

interface PayoutDetailsProps {
  orderId: string;
  payout: number;
  gross: number;
  platformFee: number;
  platformFeeRate: number;
  stripeFee?: number;
  transferId: string;
  processedAt: string;
  currencySymbol?: string;
}
export const metadata = {
  title: 'Dashboard : Payout Detail View'
};

export default function Page() {
  return <PayoutDetails />;
}

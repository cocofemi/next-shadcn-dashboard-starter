'use client';

import Link from 'next/link';
import { CheckCircle2, ArrowRight, CreditCard, Store } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import React from 'react';

export default function StripeConnectSuccessPage() {
  React.useEffect(() => {
    document.body.style.overflow = 'auto'; // Ensure scrolling is enabled
  }, []);
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-6">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <CheckCircle2 className="h-16 w-16 text-green-600" />
          </div>

          <CardTitle className="text-2xl">
            Payments Enabled Successfully 🎉
          </CardTitle>

          <CardDescription className="text-base">
            Your Stripe account is now connected and ready to receive payments.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* What this means */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">You can now:</h3>

            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Accept card payments from buyers
              </li>

              <li className="flex items-center gap-2">
                <Store className="h-4 w-4" />
                Receive payouts directly to your bank account
              </li>

              <li className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4" />
                Track earnings in your dashboard
              </li>
            </ul>
          </div>

          <Separator />

          {/* Next steps */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Next steps</h3>

            <p className="text-sm text-muted-foreground">
              You can start listing products immediately. Payments will be
              processed securely through Stripe and paid out according to
              Stripe’s payout schedule.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Button asChild className="w-full">
              <Link href="/dashboard/overview">
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button variant="outline" asChild className="w-full">
              <Link href="/dashboard/listings">Create Your First Listing</Link>
            </Button>
          </div>

          {/* Support */}
          <p className="pt-2 text-center text-xs text-muted-foreground">
            Need help? Contact support or check your email for confirmation.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

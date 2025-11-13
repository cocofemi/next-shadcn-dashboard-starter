'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, CopyIcon, Download, Package } from 'lucide-react';
import { ShippingLabel } from '@/@types/user';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useState } from 'react';
import { toast } from 'sonner';

interface ShippingLabelProps {
  shippingLabel: ShippingLabel;
}

export function ShippingLabelCard({ shippingLabel }: ShippingLabelProps) {
  const handleDownload = () => {
    window.open(shippingLabel?.labelUrl, '_blank');
  };

  const [copied, setCopied] = useState(false);

  return (
    <Card className="mb-5 bg-card">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Package className="h-5 w-5" />
              Shipping Label
            </CardTitle>
            <CardDescription>Your shipping label is ready</CardDescription>
          </div>
          {shippingLabel?.paid && (
            <Badge
              variant="default"
              className="border-green-500/20 bg-green-500/10 text-green-600 hover:bg-green-500/20"
            >
              Paid
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex flex-col space-y-1">
            <p className="text-sm text-muted-foreground">Tracking Number</p>
            <div className="flex items-center gap-2 break-all font-mono text-lg font-semibold text-foreground">
              {shippingLabel?.trackingNumber}
              <CopyToClipboard
                text={shippingLabel?.trackingNumber || ''}
                onCopy={() =>
                  toast.success('Tracking number copied to clipboard')
                }
              >
                <CopyIcon
                  size={18}
                  className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
                />
              </CopyToClipboard>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Carrier</p>
            <p className="text-lg font-semibold text-foreground">
              {shippingLabel?.carrier}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Cost</p>
            <p className="text-2xl font-bold text-foreground">
              {shippingLabel?.currency === 'USD' ? '$' : ''}
              {shippingLabel?.cost.toFixed(2)} {shippingLabel?.currency}
            </p>
          </div>
          <Button onClick={handleDownload} size="lg" className="gap-2">
            <Download className="h-4 w-4" />
            Download Label
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

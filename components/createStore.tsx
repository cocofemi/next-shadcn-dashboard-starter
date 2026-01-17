import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function NoStoreWarning() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <Card className="w-full max-w-lg border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Create your store
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            You haven’t created a store yet. Please visit the link below to
            create your store, then come back here to manage it.
          </p>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Button asChild className="w-full sm:w-auto">
              <Link href="https://www.mehchant.com/store-create">
                Create store
              </Link>
            </Button>

            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/">Back to marketplace</Link>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            After your store is created, your products, orders, payouts, and
            analytics will appear here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

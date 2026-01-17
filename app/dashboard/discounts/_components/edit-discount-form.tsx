'use client';
import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CurrentUserContextType, Discounts } from '@/@types/user';
import { UserContext } from '@/context/UserProvider';
import { useRouter } from 'next/navigation';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { createDiscount, updateDiscount } from '@/utils/discount';
import { toast } from 'sonner';
import ClipLoader from 'react-spinners/ClipLoader';

const formSchema = z.object({
  code: z.string().min(2, {
    message: 'Code must be at least 2 characters.'
  }),
  description: z.string().min(1, {
    message: 'Please enter a description for the discount.'
  }),
  type: z.enum(['percentage', 'fixed'], {
    message: 'Please select a discount type.'
  }),
  value: z.coerce.number().min(0, {
    message: 'Please enter a discount value.'
  }),
  minPurchase: z.coerce.number().min(0, {
    message: 'Please enter a minimum purchase amount.'
  }),
  maxDiscount: z.coerce.number().min(0, {
    message: 'Please enter a maximum discount amount.'
  }),
  usageLimit: z.coerce.number().min(0, {
    message: 'Please enter a usage limit.'
  }),
  startDate: z.string().min(1, {
    message: 'Please select a start date.'
  }),
  endDate: z.string().min(1, {
    message: 'Please select an end date.'
  })
});

export default function EditDiscountForm({
  discount
}: {
  discount: Discounts;
}) {
  const { user } = React.useContext(UserContext) as CurrentUserContextType;
  const router = useRouter();

  function toDateInputValue(isoString: string) {
    return new Date(isoString).toISOString().split('T')[0];
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: discount?.code,
      description: discount?.description,
      type: discount?.type as 'percentage' | 'fixed' | undefined,
      value: discount?.value,
      minPurchase: discount?.minPurchase,
      maxDiscount: discount?.maxDiscount,
      usageLimit: discount?.usageLimit,
      startDate: toDateInputValue(discount?.startDate),
      endDate: toDateInputValue(discount?.endDate)
    }
  });

  React.useEffect(() => {
    document.body.style.overflow = 'auto'; // Ensure scrolling is enabled
  }, []);

  const [loading, setLoading] = React.useState<boolean>(false);

  function parseDate(dateString: string): Date {
    const [year, month, day] = dateString.split('-');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    const payload = {
      code: values.code.toUpperCase(),
      type: values.type,
      description: values.description,
      value: values.value,
      minPurchase: values.minPurchase,
      maxDiscount: values.maxDiscount,
      usageLimit: values.usageLimit,
      startDate: parseDate(values.startDate),
      endDate: parseDate(values.endDate)
    };
    updateDiscount(discount?._id, payload)
      .then((res) => {
        console.log('Res', res);
        toast.success('Discount was created');
        setLoading(false);
        router.back();
      })
      .catch((err) => {
        setLoading(false);
        console.log('Error', err);
        toast.warning('There was a problem creating discount.');
      });
  }

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-left text-2xl font-bold">
          New Discount
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code</FormLabel>
                      <FormControl>
                        <Input placeholder="SAVE20" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="percentage">Percentage</SelectItem>
                          <SelectItem value="fixed">Fixed Amount</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Value</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter value"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="minPurchase"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min Purchase ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter min purchase"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="maxDiscount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Discount ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter max discount"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="usageLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Usage Limit</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter usage limit"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button disabled={loading} type="submit" className="flex-1">
                {loading ? (
                  <>
                    Updating...
                    <ClipLoader
                      color="white"
                      loading={loading}
                      //cssOverride={override}
                      size={25}
                      aria-label="Loading Spinner"
                      data-testid="loader"
                    />
                  </>
                ) : (
                  'Update Discount'
                )}
              </Button>

              <Button type="button" variant="outline">
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

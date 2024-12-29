'use client';
import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import * as z from 'zod';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription
} from '@/components/ui/card';
import { getStore, getStoreListing } from '@/utils/store';
import { useSearchParams, useParams } from 'next/navigation';
import { AreaGraph } from '@/app/dashboard/overview/_components/area-graph';
import { BarGraph } from '@/app/dashboard/overview/_components/bar-graph';
import { PieGraph } from '@/app/dashboard/overview/_components/pie-graph';
import { RecentSales } from '@/app/dashboard/overview/_components/recent-sales';
import EmployeeForm from '@/app/dashboard/employee/_components/employee-form';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { getOrder } from '@/utils/orders';
import { CurrentUserContextType } from '@/@types/user';
import { UserContext } from '@/context/UserProvider';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import CompleteOrderForm from './complete-order-form';

interface IOrder {
  _id: string;
  storeName: string;
  description: string;
  social: string;
  website: string;
  location: string;
  displayPicture: string;
}

export default function OrderDetails() {
  const { user } = React.useContext(UserContext) as CurrentUserContextType;
  const search = useSearchParams();
  const id = search.get('id');
  const params = useParams();
  const { orderId } = params;

  const [visible, setVisible] = React.useState<boolean>(false);

  const [order, setOrder] = React.useState<[] | any>([]);

  React.useEffect(() => {
    if (user?.token) {
      getOrder(orderId, user?.token).then((res) => {
        console.log(res?.data);
        setOrder(res?.data);
      });
    }
  }, [user]);

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-left text-2xl font-bold capitalize">{`Order  #${order?.orderId}`}</CardTitle>
        <div className="font-normal text-gray-500">
          {`${new Date(order?.createdAt).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}`}
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4">
            {!order.fulfilled && (
              <div className="mb-5 flex justify-end">
                <Link
                  href={''}
                  onClick={() => setVisible((prevState) => !prevState)}
                  className={cn(buttonVariants({ variant: 'default' }))}
                >
                  <Plus className="mr-2 h-4 w-4" /> Complete Order
                </Link>
              </div>
            )}
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 rtl:text-right">
                <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Variation
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Quanitity
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Price($)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {order?.item &&
                    order?.item.map((item: any, index: number) => (
                      <tr
                        className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
                        key={index}
                      >
                        <th
                          scope="row"
                          className="flex items-center whitespace-nowrap px-6 py-4 text-gray-900 dark:text-white"
                        >
                          <img
                            className="h-10 w-10 rounded-md"
                            src={item?.image}
                            alt="Jese image"
                          />
                          <div className="ps-3">
                            <div className="text-base font-semibold">
                              {item?.listingName}
                            </div>
                            {/* <div className="font-normal text-gray-500">{}</div> */}
                          </div>
                        </th>
                        <td className="px-6 py-4">
                          {Object.entries(item.variation || {}).map(
                            ([key, value]) => (
                              <p key={key}>
                                {key}: {String(value)}
                              </p>
                            )
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="me-2 h-2.5 w-2.5 rounded-full bg-green-500"></div>{' '}
                            {item.quantity}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <a
                            href="#"
                            className="font-medium text-blue-600 dark:text-blue-500"
                          >
                            {item.price}
                          </a>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <div className="mt-5 flex justify-end">
                <ul>
                  <li>Subotal: $2,000</li>
                  <li>Shipping Fee: $5.99</li>
                  <li>Tax: $2.00</li>
                  <li>Total: $2,070</li>
                </ul>
              </div>
            </div>
          </div>
          {order.userId && (
            <Card className="col-span-4 md:col-span-3">
              <CardHeader>
                <CardTitle>Customer Details</CardTitle>
                {/* <CardDescription>
                You made 265 sales this month.
              </CardDescription> */}
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="flex items-center">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="uppercase">
                        {order?.userId.firstname.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">{`${order?.userId.firstname} ${order?.userId.lastname}`}</p>
                      <p className="text-sm text-muted-foreground">
                        {order?.userId?.phoneNumber &&
                          `${order?.userId?.phoneNumber}`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {` ${order?.userId.email}`}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
                <p className="text-muted-foreground">{`${order.shippingDetails[0].line1}`}</p>
                <p className="text-muted-foreground">
                  {order.shippingDetails[0].line2 &&
                    `${order.shippingDetails[0].line2}`}
                </p>
                <p className="text-muted-foreground">{`${order.shippingDetails[0].postal_code} ${order.shippingDetails[0].city} `}</p>
                <p className="text-muted-foreground">{`${order.shippingDetails[0].country}`}</p>
              </CardHeader>
              {order.fulfilled && order.shipment && (
                <CardHeader>
                  <CardTitle>Order Fulfillment</CardTitle>
                  <p className="text-muted-foreground">
                    OrderID ~ {`${order.shipment.orderId}`}
                  </p>
                  <p className="text-muted-foreground">
                    Tracking Number ~ {`${order.shipment.trackingNumber}`}
                  </p>
                  <p className="capitalize text-muted-foreground">
                    Shipping Provider ~ {`${order.shipment.shippingProvider}`}
                  </p>
                  <p className="text-muted-foreground">
                    Shipping Date ~ {`${order.shipment.shipmentDate}`}
                  </p>
                </CardHeader>
              )}
            </Card>
          )}
        </div>
      </CardHeader>
      {visible && (
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold capitalize">
            Complete Order
          </CardTitle>
          <CompleteOrderForm />
        </CardHeader>
      )}
    </Card>
  );
}

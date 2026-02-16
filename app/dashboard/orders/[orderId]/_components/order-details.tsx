'use client';
import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useSearchParams, useParams } from 'next/navigation';
import {
  getOrder,
  getShippingLabel,
  getStoreOrderDetails
} from '@/utils/orders';
import {
  CurrentUserContextType,
  Orders,
  ShippingBreakdown,
  ShippingLabel,
  StoreBreakDown
} from '@/@types/user';
import { UserContext } from '@/context/UserProvider';
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar';
import CompleteOrderForm from './complete-order-form';
import { ShippingRatesCard } from './shipping-rates-card';
import { ShippingLabelCard } from './shipping-label-card';

export default function OrderDetails() {
  const { user } = React.useContext(UserContext) as CurrentUserContextType;
  const shippingCardRef = React.useRef<HTMLDivElement>(null);
  const search = useSearchParams();
  const id = search.get('id');
  const params = useParams();
  const { orderId } = params;

  const [order, setOrder] = React.useState<Orders | any>([]);
  const [shippingLabel, setShippingLabel] = React.useState<ShippingLabel>();
  const [totalPrice, setTotalPrice] = React.useState(0);

  React.useEffect(() => {
    if (user && user?.role === 'admin') {
      getOrder(orderId).then((res) => {
        setOrder(res?.data);
      });
    }
  }, [user]);

  React.useEffect(() => {
    if (user && user?.role === 'store') {
      getStoreOrderDetails(user?.storeId, orderId).then((res) => {
        setOrder(res?.data);
      });
    }
  }, [user]);

  // Calculate totalPrice whenever `order` changes
  React.useEffect(() => {
    if (order && order?.item?.length > 0) {
      const calculatedTotalPrice = order?.item?.reduce(
        (sum: number, item: any) => sum + item.price * item.quantity,
        0
      );
      setTotalPrice(calculatedTotalPrice);
    }
  }, [order]); // This effect depends on `order`

  React.useEffect(() => {
    if (user && order?.item?.length > 0) {
      getShippingLabel(order?._id, user?.storeId)
        .then((res) => {
          setShippingLabel(res?.data);
        })
        .catch((e) =>
          console.log('There was a problem getting shipping label')
        );
    }
  }, [order]);

  const handleScrollToShippingCard = () => {
    setTimeout(() => {
      shippingCardRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        {Object?.keys(order).length != 0 ? (
          <>
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
                  <div className="mt-10 max-w-3xl rounded-2xl border shadow-sm">
                    <div className="border-b px-6 py-5">
                      <h2 className="text-xl font-semibold">Order Summary</h2>
                      <p className="text-sm text-gray-500">
                        Breakdown of items, shipping, and totals
                      </p>
                    </div>

                    <div className="space-y-8 px-6 py-6">
                      {/* Listing Price */}
                      <div className="flex items-center justify-between">
                        <p className="font-medium">Listing Price</p>

                        {user?.role === 'admin' && (
                          <p className="text-lg font-semibold">
                            ${order.subTotal.toFixed(2)}
                          </p>
                        )}

                        {user?.role === 'store' && (
                          <p className="text-lg font-semibold">
                            ${totalPrice.toFixed(2)}
                          </p>
                        )}
                      </div>

                      {/* Divider */}
                      <div className="border-t" />

                      {/* Shipping Breakdown */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">
                          Shipping Breakdown
                        </h3>

                        <div className="space-y-4">
                          {order?.shippingBreakDown.map(
                            (item: ShippingBreakdown) => (
                              <div
                                key={item._id}
                                className="flex flex-col gap-6 rounded-xl border bg-gray-50 p-5 sm:flex-row sm:items-center sm:justify-between"
                              >
                                {/* Left */}
                                <div className="space-y-1">
                                  <p className="text-sm font-medium text-gray-600">
                                    Carrier:{' '}
                                    <span className="font-semibold">
                                      {item.carrier}
                                    </span>
                                  </p>

                                  <p className="text-sm text-gray-600">
                                    Shipping type:{' '}
                                    <span className="font-medium capitalize text-gray-600">
                                      Standard
                                    </span>
                                  </p>

                                  <p className="text-sm text-gray-600">
                                    Time of Arrival:{' '}
                                    <span className="font-medium">
                                      {new Date(
                                        item.eta.earliest
                                      ).toLocaleDateString()}{' '}
                                      –{' '}
                                      {new Date(
                                        item.eta.latest
                                      ).toLocaleDateString()}
                                    </span>
                                  </p>
                                </div>

                                {/* Right */}
                                <div className="flex items-center justify-between gap-6">
                                  <div className="text-right">
                                    <p className="text-sm text-gray-600">
                                      Shipping Fee
                                    </p>
                                    <p className="text-lg font-semibold text-gray-600">
                                      ${item.shippingFee.toFixed(2)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="border-t" />

                      {/* Store Totals */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Store Totals</h3>

                        <div className="space-y-3">
                          {order?.storeBreakDown.map((item: StoreBreakDown) => (
                            <div
                              key={item.storeId}
                              className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3"
                            >
                              <p className="text-sm font-medium text-gray-700">
                                Gross
                              </p>

                              <p className="text-lg font-semibold text-gray-900">
                                ${Number(item.gross).toFixed(2)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {order && (
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
                            {order?.userId != null
                              ? order?.userId.firstname.slice(0, 2)
                              : order?.name.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="ml-4 space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {order?.userId != null
                              ? `${order?.userId.firstname} ${order?.userId.lastname}`
                              : `${order?.name}`}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {order?.userId?.phoneNumber &&
                              `${order?.userId?.phoneNumber}`}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {order.phoneNumber && `${order?.phoneNumber}`}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {order?.userId != null
                              ? ` ${order?.userId.email}`
                              : `${order?.email}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardHeader>
                    <CardTitle>Shipping Address</CardTitle>
                    <p className="text-muted-foreground">{`${order.shippingDetails[0]?.line1}`}</p>
                    <p className="text-muted-foreground">
                      {order.shippingDetails[0]?.line2 &&
                        `${order.shippingDetails[0]?.line2}`}
                    </p>
                    <p className="text-muted-foreground">{`${order.shippingDetails[0]?.postal_code} ${order.shippingDetails[0]?.city} `}</p>
                    <p className="text-muted-foreground">{`${order.shippingDetails[0].country}`}</p>
                  </CardHeader>
                  {order.fulfilled && order.fulfilled[0].fulfilled != false && (
                    <>
                      {order.item.slice(0, 1).map((item: any, index: any) => (
                        <CardHeader key={index}>
                          <CardTitle>Order Fulfillment</CardTitle>
                          <p className="text-muted-foreground">
                            OrderID ~ {`${item?.fulfillmentDetails?.orderId}`}
                          </p>
                          <p className="text-muted-foreground">
                            Tracking Number ~{' '}
                            {`${item?.fulfillmentDetails?.trackingNumber}`}
                          </p>
                          <p className="capitalize text-muted-foreground">
                            Shipping Provider ~{' '}
                            {`${item?.fulfillmentDetails?.shippingProvider}`}
                          </p>
                          <p className="text-muted-foreground">
                            Shipping Date ~{' '}
                            {`${item?.fulfillmentDetails?.shipmentDate}`}
                          </p>
                          <p className="text-muted-foreground">
                            Notes ~ {`${item?.fulfillmentDetails?.notes}`}
                          </p>
                        </CardHeader>
                      ))}
                    </>
                  )}
                </Card>
              )}
            </div>
          </>
        ) : (
          <CardTitle>Loading...</CardTitle>
        )}
      </CardHeader>
      {user?.role === 'store' &&
        order.fulfilled &&
        order.fulfilled[0].fulfilled === false && (
          <>
            {!shippingLabel?.paid && (
              <ShippingRatesCard
                orderAddress={order.shippingDetails[0]}
                order={order}
                onRatesLoaded={handleScrollToShippingCard}
              />
            )}
            {shippingLabel?.paid && (
              <div ref={shippingCardRef}>
                <ShippingLabelCard shippingLabel={shippingLabel} />
              </div>
            )}
            <CompleteOrderForm />
          </>
        )}
    </Card>
  );
}

'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Image from 'next/image';
import {
  CurrentUserContextType,
  OrderItem,
  Orders,
  ShippingAddress
} from '@/@types/user';
import { UserContext } from '@/context/UserProvider';
import * as z from 'zod';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  getShippingRates,
  buyLabel,
  getOrdersMaxDimensions
} from '@/utils/orders';
import { countries } from 'countries-list';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';
import { Autocomplete, useJsApiLoader } from '@react-google-maps/api';
import { getListing } from '@/utils/listings';

interface ShippingRate {
  provider: string;
  providerImage200: string;
  amount: string;
  currency: string;
  estimatedDays: number;
  objectId: string;
  durationTerms: string;
  attributes: string[];
  arrivesBy: string;
}

interface ShippingProps {
  orderAddress: ShippingAddress;
  order: Orders;
  onRatesLoaded: () => void;
}

const parcelSchema = z.object({
  weight: z.string().min(1, { message: 'Weight required' }),
  length: z.string().min(1, { message: 'Length required' }),
  width: z.string().min(1, { message: 'Width required' }),
  height: z.string().min(1, { message: 'Height required' })
});

const addressSchema = parcelSchema.extend({
  address: z.string().min(2, { message: 'Address required' }),
  city: z.string().min(2, { message: 'City required' }),
  state: z.string().min(2, { message: 'State is required' }),
  zipcode: z.string().min(2, { message: 'Zip Code required' }),
  country: z.string().min(2, { message: 'Country required' })
});

type FormSchema = z.infer<typeof addressSchema> & z.infer<typeof parcelSchema>;

export function ShippingRatesCard({
  orderAddress,
  order,
  onRatesLoaded
}: ShippingProps) {
  const { user } = React.useContext(UserContext) as CurrentUserContextType;
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const ratesResultRef = useRef<HTMLDivElement>(null);

  const [addressOption, setAddressOption] = useState('default');
  const [chooseRate, setChooseRate] = useState('');
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [ratesLoading, setRatesLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rateError, setRateError] = useState('');
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors }
  } = useForm<FormSchema>({
    resolver: zodResolver(
      addressOption === 'manual' ? addressSchema : parcelSchema
    )
  });

  const countryValue = useWatch({
    control,
    name: 'country'
  });

  useEffect(() => {
    if (order) {
      const fetchDimensions = async () => {
        try {
          const res = await getOrdersMaxDimensions(
            order?.item as OrderItem[],
            getListing
          );
          setValue('weight', res.weight.toString(), { shouldValidate: true });
          setValue('length', res.length.toString(), { shouldValidate: true });
          setValue('width', res.width.toString(), { shouldValidate: true });
          setValue('height', res.height.toString(), { shouldValidate: true });
        } catch (e) {
          console.log(e);
        }
      };
      fetchDimensions();
    }
  }, [order]);

  const onSubmit = (data: any) => {
    setRatesLoading(true);
    const {
      address,
      city,
      state,
      zipcode,
      country,
      height,
      weight,
      width,
      length
    } = data;

    const fromAddress =
      addressOption === 'manual'
        ? {
            name: user?.storeName,
            street1: address,
            city: city,
            state: state,
            zip: zipcode,
            country: country
          }
        : {
            name: user?.storeName,
            street1: user?.storeAddress[0].address,
            city: user?.storeAddress[0].city,
            state: user?.storeAddress[0].state,
            zip: user?.storeAddress[0].zipCode,
            country: user?.storeAddress[0].country
          };
    const toAddress = {
      name: order.name,
      street1: order.shippingDetails[0].line1,
      city: order?.shippingDetails[0].city,
      state: order?.shippingDetails[0].state,
      zip: order?.shippingDetails[0].postal_code,
      country: order?.shippingDetails[0].country
    };

    const parcels = [
      {
        length,
        width,
        height,
        distanceUnit: 'in',
        weight,
        massUnit: 'lb'
      }
    ];

    getShippingRates(fromAddress, toAddress, parcels)
      .then((res) => {
        if (res?.rates.length === 0) {
          setRateError(
            "Couldn't get shipping rates for this address. Try again!"
          );
        }
        setRates(res?.rates);

        setTimeout(() => {
          ratesResultRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }, 200); // Increased timeout to ensure render

        onRatesLoaded?.();
      })
      .catch((e) => {
        setRateError('There was a problem getting rates, please try again!');
        console.log(e);
      })
      .finally(() => setRatesLoading(false));
  };

  const onError = (err: any) => {};
  const handleBuyLabel = () => {
    setLoading(true);
    buyLabel(chooseRate, order?.orderId, order?._id, user?.storeId)
      .then((res) => {
        if (res?.url) window.location.href = res?.url;
        setLoading(false);
      })
      .finally(() => setLoading(false));
  };

  function getContinentFromCountry(countryCode: string | number) {
    if (!countryCode) return null;

    const continentCode =
      countries[countryCode as keyof typeof countries]?.continent;
    if (!continentCode) return null;

    const CONTINENT_LABELS = {
      AF: 'Africa',
      EU: 'Europe',
      AS: 'Asia',
      NA: 'North America',
      SA: 'South America',
      OC: 'Oceania',
      AN: 'Antarctica'
    };

    return CONTINENT_LABELS[continentCode] || null;
  }

  const onPlaceChanged = () => {
    if (!autocompleteRef.current) return;

    const place = autocompleteRef.current.getPlace();
    if (!place.address_components) return;

    const components = place.address_components;

    const get = (type: string) =>
      components.find((c: { types: string | string[] }) =>
        c.types.includes(type)
      )?.long_name || '';

    const getShort = (type: string) =>
      components.find((c: { types: string | string[] }) =>
        c.types.includes(type)
      )?.short_name || '';

    // City resolution (important for UK / EU)
    const city =
      get('locality') ||
      get('postal_town') ||
      get('administrative_area_level_2') ||
      get('administrative_area_level_1');

    const countryCode = getShort('country');
    const continent = getContinentFromCountry(countryCode);

    console.log('Country Code', countryCode);

    const streetNumber = get('street_number');
    const route = get('route');
    const address = [streetNumber, route].filter(Boolean).join(' ');

    // Set all form values using react-hook-form's setValue
    setValue('address', address, { shouldValidate: true });
    setValue('city', city, { shouldValidate: true });
    setValue('state', get('administrative_area_level_1'), {
      shouldValidate: true
    });
    setValue('zipcode', get('postal_code'), { shouldValidate: true });
    setValue('country', countryCode, { shouldValidate: true });

    // If you have a continent field
    // setValue('continent', continent, { shouldValidate: true });
  };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY!,
    libraries: ['places']
  });

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  if (!isLoaded) {
    return <div>Loading address autocomplete…</div>;
  }

  return (
    <div className="mb-5 space-y-6">
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Get Shipping Rates</CardTitle>
          <CardDescription>
            Enter shipping details to compare rates from different carriers and
            buy shipping labels or you can choose to complete the order below
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form
            onSubmit={handleSubmit(onSubmit, onError)}
            className="space-y-8"
          >
            {/* Shipping From and To */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-foreground">Shipping From</Label>
                <RadioGroup
                  value={addressOption}
                  onValueChange={setAddressOption}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="default" id="default" />
                    <Label
                      htmlFor="default"
                      className="cursor-pointer font-normal"
                    >
                      Use default shipping address
                    </Label>
                  </div>
                  <Input
                    id="from_address"
                    value={`${user?.storeAddress[0]?.address} ${user?.storeAddress[0]?.city} ${user?.storeAddress[0]?.zipCode} ${user?.storeAddress[0]?.country}`}
                    placeholder="123 Main St, New York, NY 10001"
                    disabled
                    className="bg-background text-foreground"
                  />
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="manual" id="manual" />
                    <Label
                      htmlFor="manual"
                      className="cursor-pointer font-normal"
                    >
                      Enter manually
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="mt-9 space-y-2">
                <Label htmlFor="to_address" className="text-foreground">
                  Shipping To
                </Label>
                <Input
                  id="to_address"
                  value={`${orderAddress?.line1} ${orderAddress?.line2 === null && ''} ${orderAddress?.city} ${orderAddress?.postal_code} ${orderAddress?.country}`}
                  placeholder="123 Main St, New York, NY 10001"
                  disabled
                  className="bg-background text-foreground"
                />
              </div>
            </div>

            {/* Manual Address Form */}
            {addressOption === 'manual' && (
              <div className="grid grid-cols-1 gap-4 rounded-lg border border-border bg-muted/30 p-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address" className="text-foreground">
                    Address
                  </Label>
                  <Autocomplete
                    onLoad={onLoad}
                    onPlaceChanged={onPlaceChanged}
                    options={{
                      types: ['address'],
                      fields: ['address_component']
                    }}
                  >
                    <Input
                      {...register('address')}
                      id="address"
                      placeholder="Street address"
                      className="bg-background text-foreground"
                    />
                  </Autocomplete>
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.address.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-foreground">
                    City
                  </Label>
                  <Input
                    {...register('city')}
                    id="city"
                    placeholder="City"
                    className="bg-background text-foreground"
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.city.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-foreground">
                    State
                  </Label>
                  <Input
                    {...register('state')}
                    id="state"
                    placeholder="State"
                    className="bg-background text-foreground"
                  />
                  {errors.state && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.state.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipcode" className="text-foreground">
                    Zip Code
                  </Label>
                  <Input
                    {...register('zipcode')}
                    id="zipcode"
                    placeholder="12345"
                    className="bg-background text-foreground"
                  />
                  {errors.zipcode && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.zipcode.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-foreground">
                    Country
                  </Label>
                  <Select
                    value={countryValue}
                    onValueChange={(val) =>
                      setValue('country', val, { shouldValidate: true })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <ScrollArea className="h-64">
                        {Object.entries(countries)
                          .sort((a, b) => a[1].name.localeCompare(b[1].name))
                          .map(([iso, data]) => (
                            <SelectItem key={iso} value={iso}>
                              {data.name}
                            </SelectItem>
                          ))}
                      </ScrollArea>
                    </SelectContent>
                  </Select>
                  {errors.country && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.country.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Parcel Specifications */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold text-foreground">
                Enter Parcel Specs
              </Label>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="weight" className="text-foreground">
                    Weight (lbs)
                  </Label>
                  <Input
                    {...register('weight')}
                    id="weight"
                    type="number"
                    placeholder="5"
                    className="bg-background text-foreground"
                  />
                  {errors.weight && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.weight.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="length" className="text-foreground">
                    Length (in)
                  </Label>
                  <Input
                    {...register('length')}
                    id="length"
                    type="number"
                    placeholder="12"
                    className="bg-background text-foreground"
                  />
                  {errors.length && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.length.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="width" className="text-foreground">
                    Width (in)
                  </Label>
                  <Input
                    {...register('width')}
                    id="width"
                    type="number"
                    placeholder="8"
                    className="bg-background text-foreground"
                  />
                  {errors.width && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.width.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height" className="text-foreground">
                    Height (in)
                  </Label>
                  <Input
                    {...register('height')}
                    id="height"
                    type="number"
                    placeholder="6"
                    className="bg-background text-foreground"
                  />
                  {errors.height && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.height.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <Button
              type="submit"
              disabled={ratesLoading}
              className="w-full md:w-auto"
              size="lg"
            >
              {ratesLoading ? 'Generating Rates...' : 'Generate Shipping Rates'}
              {ratesLoading && <Loader2 className="animate-spin" />}
            </Button>
            {rateError != '' && (
              <p className="mt-1 text-sm text-red-500">{rateError}</p>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Rates Results Card */}
      {rates.length > 0 && (
        <div ref={ratesResultRef}>
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">
                Available Shipping Rates
              </CardTitle>
              <CardDescription>
                Compare rates from different carriers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <RadioGroup
                  value={chooseRate}
                  onValueChange={setChooseRate}
                  className="space-y-3"
                >
                  {rates.map((rate, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-accent/50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                          <RadioGroupItem
                            value={rate.objectId}
                            id={`r-${String(index)}`}
                          />
                        </div>
                        <div className="relative flex h-[75px] w-[75px] items-center justify-center overflow-hidden rounded-md bg-muted">
                          <Image
                            src={rate.providerImage200 || '/placeholder.svg'}
                            alt={`${rate.provider} logo`}
                            width={75}
                            height={75}
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-foreground">
                            {rate.provider}
                          </p>
                          <p className="text-sm text-green-500">
                            {rate?.attributes[0]}
                          </p>
                          {/* <p className="text-sm text-green-500 text-muted-foreground">
                          Arrives by: {rate?.arrivesBy}
                        </p> */}
                          <p className="text-sm text-muted-foreground">
                            {`Estimated days ~ ${rate?.estimatedDays}`}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {rate?.durationTerms}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-foreground">
                          {rate.currency === 'USD' ? '$' : ''}
                          {rate.amount}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {rate.currency}
                        </p>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleBuyLabel}
                disabled={loading || chooseRate === ''}
                className="w-full md:w-auto"
                size="lg"
              >
                {loading ? 'Hold on...' : ' Buy shipping label'}
                {loading && <Loader2 className="animate-spin" />}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}

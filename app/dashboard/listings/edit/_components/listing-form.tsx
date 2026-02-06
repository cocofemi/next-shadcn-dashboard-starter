'use client';
import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Heading } from '@/components/ui/heading';
import { Globe, Plus, Trash } from 'lucide-react';
import FileUpload from './fileUpload';
import { cn } from '@/lib/utils';
import { updateListing, getListing, deleteListing } from '@/utils/listings';
import { CurrentUserContextType } from '@/@types/user';
import { UserContext } from '@/context/UserProvider';
import { useRouter, useSearchParams } from 'next/navigation';

import ClipLoader from 'react-spinners/ClipLoader';

import MDEditor from '@uiw/react-md-editor';
import { Spinner } from '@/components/ui/spinner';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface IListing {
  name: string;
  category: string;
  description: string;
  tags: string;
  type: string;
  price: string;
  quantity: string;
  sku: string;
  upc: string;
  shipping: string;
  variation: any[];
  shippingSpec: {
    width: number;
    length: number;
    height: number;
    weight: number;
  };
  shippingManualSpec: {
    shippingFee: number;
    processingTime: string;
    location: string[];
  };
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.'
  }),
  category: z.string({
    required_error: 'Please select a category.'
  }),
  // description: z.string().min(1, {
  //   message: 'Please enter a description'
  // }),
  tags: z.string().min(1, {
    message: 'Please enter tags associated with the listing.'
  }),
  type: z.string().min(1, {
    message: 'Please select a type.'
  }),
  price: z.coerce.number().min(1, {
    message: 'Please enter price'
  }),
  quantity: z.coerce.number().min(1, {
    message: 'Please enter quantity'
  }),
  sku: z.string().min(1, {
    message: 'Please enter sku'
  }),
  upc: z.coerce.number().min(1, {
    message: 'Please enter upc'
  }),
  shippingFee: z.coerce.number().optional(),
  processingTime: z.coerce.string().optional(),
  weight: z.coerce.number().min(1, { message: 'Weight required' }),
  length: z.coerce.number().min(1, { message: 'Length required' }),
  width: z.coerce.number().min(1, { message: 'Width required' }),
  height: z.coerce.number().min(1, { message: 'Height required' })
});

const continents = [
  'Africa',
  'Antarctica',
  'Asia',
  'Europe',
  'North America',
  'Oceania',
  'South America'
];

export default function EditListingForm() {
  const { user } = React.useContext(UserContext) as CurrentUserContextType;
  const router = useRouter();

  const search = useSearchParams();
  const id = search.get('id');
  const [markdown, setMarkdown] = React.useState('');

  const [shippingMode, setShippingMode] = React.useState('automatic');
  const [hasVariants, setHasVariants] = React.useState(false);

  const [listing, setListing] = React.useState<IListing>();
  const [variants, setVariants] = React.useState([{ option: '', value: '' }]);
  const [images, setImages] = React.useState([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [updateLoading, setUpdateLoading] = React.useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = React.useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      category: '',
      //description: '',
      tags: '',
      type: '',
      shippingFee: 0,
      price: 0,
      quantity: 0,
      sku: '',
      upc: 0,
      weight: 0,
      height: 0,
      width: 0,
      length: 0
    }
  });

  React.useEffect(() => {
    getListing(id)
      .then((res: any) => {
        if (res.status === 200) {
          setLoading(false);
          setListing(res?.data?.listing);
          form.reset({
            name: res?.data?.listing?.listingName,
            category: res?.data?.listing?.category,
            //description: res?.data?.listing?.description,
            tags: Array.isArray(res?.data?.listing?.tags)
              ? res?.data?.listing.tags.join(', ')
              : res?.data?.listing.tags,
            type: res?.data?.listing?.type,
            price: res?.data?.listing?.price,
            quantity: res?.data?.listing?.quantity,
            sku: String(res?.data?.listing?.sku),
            upc: res?.data?.listing?.upc,
            weight: res?.data?.listing?.shippingSpec?.weight ?? 0,
            height: res?.data?.listing?.shippingSpec?.height ?? 0,
            length: res?.data?.listing?.shippingSpec?.length ?? 0,
            width: res?.data?.listing?.shippingSpec?.width ?? 0,
            shippingFee:
              res?.data?.listing?.shippingManualSpec?.shippingFee ?? 0,
            processingTime:
              res?.data?.listing?.shippingManualSpec?.processingTime ?? 0
          });
          setShippingMode(res?.data?.listing?.shipping || 'automatic');
          setSelectedLocation(
            res?.data?.listing?.shippingManualSpec?.location || continents
          );
          setMarkdown(res?.data?.listing?.description);
          // Check if listing has variations
          const hasExistingVariants =
            res?.data?.listing?.variation &&
            res?.data?.listing?.variation.length > 0;
          setHasVariants(hasExistingVariants);
          const images = res.data.listing.listingImage.map(
            (item: any) => item.url
          );
          setImages(images);
          setListingImages(images);
        } else {
          router.push('/not-found');
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, [form.reset]);

  React.useEffect(() => {
    if (listing) {
      const formatedData: { option: string; value: string }[] =
        listing?.variation.flatMap((item: any) =>
          item.value.map((val: any) => ({
            option: item.option,
            value: val
          }))
        ) || [];

      if (formatedData.length > 0) {
        setVariants(formatedData);
      }
    }
  }, [listing]);

  React.useEffect(() => {
    document.body.style.overflow = 'auto'; // Ensure scrolling is enabled
  }, []);

  const [listingImages, setListingImages] = React.useState([]);
  const [reRender, setReRender] = React.useState<boolean>(false);

  const fileImages = (images: any) => {
    setListingImages(images);
    setReRender((prevState) => !prevState);
  };

  const [selectedLocation, setSelectedLocation] = React.useState<string[]>([]);

  const isAllSelected = selectedLocation?.length === continents.length;

  const toggleWorldwide = (checked: boolean) => {
    if (checked) {
      setSelectedLocation(continents);
    } else {
      setSelectedLocation([]);
    }
  };

  const toggleContinent = (continent: string) => {
    setSelectedLocation((prev) =>
      prev?.includes(continent)
        ? prev.filter((item) => item !== continent)
        : [...prev, continent]
    );
  };

  const handleVariantChange = (
    index: number,
    field: 'option' | 'value',
    value: string
  ) => {
    const updatedVariants = [...variants];
    updatedVariants[index][field] = value;
    setVariants(updatedVariants);
  };

  const addVariant = () => {
    setVariants([...variants, { option: '', value: '' }]);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const combineVariants = () => {
    const combined = variants.reduce(
      (acc, curr) => {
        const existing = acc.find((item) => item.option === curr.option);
        if (existing) {
          existing.value.push(curr.value);
        } else {
          acc.push({ option: curr.option, value: [curr.value] });
        }
        return acc;
      },
      [] as { option: string; value: string[] }[]
    );

    return combined;
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    setUpdateLoading(true);
    const {
      name,
      category,
      //description,
      tags,
      type,
      price,
      quantity,
      sku,
      upc,
      width,
      height,
      weight,
      length,
      shippingFee,
      processingTime
    } = values;

    //Only combine variants if hasVariants is true
    let variants = hasVariants ? combineVariants() : [];

    const shippingSpec = {
      width,
      height,
      length,
      weight
    };

    const shippingManualSpec = {
      shippingFee,
      processingTime,
      location: selectedLocation
    };

    const formData = new FormData();
    formData.append('listingName', name);
    formData.append('category', category);
    formData.append('description', markdown);
    formData.append('type', type);
    formData.append('tags', tags);
    formData.append('price', price.toString());
    formData.append('quantity', quantity.toString());
    formData.append('sku', sku);
    formData.append('upc', upc.toString());
    formData.append('shipping', shippingMode);
    formData.append('variation', JSON.stringify(variants));
    formData.append('shippingSpec', JSON.stringify(shippingSpec));
    formData.append('shippingManualSpec', JSON.stringify(shippingManualSpec));

    formData.append('userId', user?.userId);
    formData.append('storeId', user?.storeId);

    for (const image of listingImages) {
      formData.append('images', image);
    }

    // const dataObject = Object.fromEntries(formData.entries());
    // console.log(dataObject);

    updateListing(formData, id)
      .then((res) => {
        setUpdateLoading(false);
        router.back();
      })
      .catch((e) => {
        console.log(e);
      });
  }
  function removeOptions(): void {
    setListing((prevListing: any) => ({
      ...prevListing,
      variation: []
    }));
  }

  function handleDelete(): void {
    deleteListing(id, user?.userId).then((res) => {
      router.back();
      setDeleteLoading(true);
    });
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
        <span className="ml-3 text-gray-500">Loading listing...</span>
      </div>
    );
  }

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-left text-2xl font-bold">
          Edit Listing
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="clothing">Clothing</SelectItem>
                        <SelectItem value="fashion">
                          Fashion Accessories
                        </SelectItem>
                        <SelectItem value="digital-assets">
                          Digital Assets
                        </SelectItem>
                        <SelectItem value="beauty">Beauty</SelectItem>
                        <SelectItem value="music">
                          Music e.g vinyl, cds
                        </SelectItem>
                        <SelectItem value="collections">
                          Rare Collections
                        </SelectItem>
                        {/* <SelectItem value="japan">Japan</SelectItem>
                        <SelectItem value="brazil">Brazil</SelectItem> */}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
            </div>
            <div data-color-mode="light">
              <Heading
                title={'Description'}
                description=" Please write a detailed description of your listing."
              />
              <MDEditor
                value={markdown}
                onChange={(val) => setMarkdown(val || '')}
              />
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <Heading
                      title={'Tags'}
                      description="Enter tags associated with the listing."
                    />
                    <FormControl>
                      <Textarea placeholder="Enter tags" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <Heading
                      title={'Type'}
                      description=" Choose the type of listing you want."
                    />
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="physical" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Physical
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="digital" />
                          </FormControl>
                          <FormLabel className="font-normal">Digital</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="other" />
                          </FormControl>
                          <FormLabel className="font-normal">Other</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <Heading
                title={'Photos'}
                description=" Please upload clean, clear photos of your listing. Also
            upload the different photos of variants if added as an
            option."
              />
              <FileUpload defaultImages={images} fileImages={fileImages} />
            </div>
            <div>
              <Heading
                title={'Variation'}
                description=" This item has variations e.g color, size, length etc."
              />

              {/* ✅ Checkbox to enable/disable variants */}
              <div className="mt-4 flex items-center space-x-3">
                <Checkbox
                  id="hasVariants"
                  checked={hasVariants}
                  onCheckedChange={(checked) => {
                    setHasVariants(!!checked);
                    // Reset variants when unchecked
                    if (!checked) {
                      setVariants([{ option: '', value: '' }]);
                    }
                  }}
                />
                <Label
                  htmlFor="hasVariants"
                  className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  This listing has variations
                </Label>
              </div>

              {/* ✅ Only show variant inputs if hasVariants is true */}
              {hasVariants && (
                <div className="mt-5 space-y-4">
                  {variants.map((option, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <select
                        value={option.option}
                        onChange={(e) =>
                          handleVariantChange(index, 'option', e.target.value)
                        }
                        className={cn(
                          'flex h-9 w-48 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
                        )}
                      >
                        <option value="" disabled>
                          Select Variant
                        </option>
                        <option value="Size">Size</option>
                        <option value="Color">Color</option>
                        <option value="Width">Width</option>
                        <option value="Length">Length</option>
                        <option value="Material">Material</option>
                      </select>

                      <input
                        type="text"
                        value={option.value}
                        onChange={(e) =>
                          handleVariantChange(index, 'value', e.target.value)
                        }
                        placeholder="Enter value"
                        className={cn(
                          'flex h-9 w-72 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
                        )}
                      />

                      {/* ✅ Show trash icon on all variants */}
                      {variants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeVariant(index)}
                          className="text-red-500 hover:underline"
                        >
                          <Trash size={15} />
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addVariant}
                    className={cn(buttonVariants({ variant: 'default' }))}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Another Option
                  </button>
                </div>
              )}
            </div>

            <Heading
              title={'Inventory And Pricing'}
              description=" Price entered here are assumed for all the the different item variations."
            />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter Price"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter quantity"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Enter sku" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="upc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>UPC</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter upc" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <div>
                <Heading
                  title={'Shipping'}
                  description=" Choose the shipping option available to deliver this listing."
                />

                <div className="space-y-4">
                  <Label className="text-lg font-semibold text-foreground">
                    Enter Parcel Specs
                  </Label>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Weight (lbs)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Enter weight"
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
                        name="length"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Length (in)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Enter length"
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
                        name="height"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Height (in)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Enter height"
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
                        name="width"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Width (in)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Enter width"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="card mt-3 border-0 shadow-sm">
                  <div className="card-body p-0">
                    <label className="form-label fw-bold mb-3">
                      Shipping Setup
                    </label>

                    {/* Step 1: Choose Mode */}
                    <div className="my-4 grid grid-cols-3 gap-4">
                      <div className="flex flex-col">
                        <div
                          className={`h-full rounded border p-3 transition-all ${
                            shippingMode === 'automatic'
                              ? 'bg-light border-primary'
                              : 'border-light-subtle'
                          }`}
                          onClick={() => setShippingMode('automatic')}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="d-flex align-items-start">
                            {/* Radio Button */}
                            <div className="form-check mb-0 flex">
                              <input
                                className="form-check-input"
                                type="radio"
                                checked={shippingMode === 'automatic'}
                                onChange={() => {}} // Controlled by parent onClick
                              />
                              <h6 className="fw-bold ms-1">Automatic</h6>
                            </div>

                            {/* Text Content */}
                            <div className="ms-2">
                              <p className="small mb-0">
                                Allow mehchant generate the best rates from your
                                address to buyers address at checkout.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col">
                        <div
                          className={`h-full rounded border p-3 transition-all ${
                            shippingMode === 'manual'
                              ? 'bg-light border-primary'
                              : 'border-light-subtle'
                          }`}
                          onClick={() => setShippingMode('manual')}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="card-body">
                            <div className="form-check mb-0 flex">
                              <input
                                className="form-check-input"
                                type="radio"
                                checked={shippingMode === 'manual'}
                                onChange={() => {}}
                              />
                              <h6 className="card-title fw-bold ms-1">
                                Manual
                              </h6>
                            </div>

                            <p className="card-text small">
                              Enter your own fixed shipping rates and delivery
                              types for your customers.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col">
                        <div
                          className={`h-full rounded border p-3 transition-all ${
                            shippingMode === 'free'
                              ? 'bg-light border-primary'
                              : 'border-light-subtle'
                          }`}
                          onClick={() => setShippingMode('free')}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="card-body">
                            <div className="form-check mb-0 flex">
                              <input
                                className="form-check-input"
                                type="radio"
                                checked={shippingMode === 'free'}
                                onChange={() => {}}
                              />
                              <h6 className="card-title fw-bold ms-1">
                                Free Shipping
                              </h6>
                            </div>

                            <p className="card-text small">
                              Shipping fee is incured by you. Buyers are charged
                              automatic rates from mehchant outside selected
                              shipping regions.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Step 2: Conditional Content */}
                    <div className="bg-light rounded p-3">
                      {shippingMode === 'automatic' ? (
                        <div className="d-flex align-items-center">
                          <i className="bi bi-magic me-2"></i>
                          <small className="fw-medium">
                            Mechant will automatically fetch the most
                            cost-effective rates from FedEx, UPS, and DHL.
                          </small>
                        </div>
                      ) : (
                        <div className="animate-fade-in">
                          <div className="grid grid-cols-2 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <FormField
                                control={form.control}
                                name="shippingFee"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Shipping Fee (USD)</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        placeholder="Enter shipping fee"
                                        {...field}
                                        disabled={shippingMode === 'free'}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="form-label small fw-bold mb-3">
                                Select processing time
                              </label>
                              <Controller
                                control={form.control}
                                name="processingTime"
                                render={({ field }) => (
                                  <Select
                                    onValueChange={field.onChange}
                                    value={String(field.value)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Processing time" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectGroup>
                                        <SelectLabel>Days</SelectLabel>
                                        <SelectItem value="3">3</SelectItem>
                                        <SelectItem value="7">7</SelectItem>
                                        <SelectItem value="14">14</SelectItem>
                                        <SelectItem value="21">21</SelectItem>
                                        <SelectItem value="30">30</SelectItem>
                                      </SelectGroup>
                                    </SelectContent>
                                  </Select>
                                )}
                              />
                            </div>
                          </div>
                          <Card className="mt-4 w-full max-w-md">
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <Globe className="h-5 w-5 text-primary" />
                                Region Selection
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                              {/* Worldwide Toggle */}
                              <div className="flex items-center space-x-3 space-y-0 rounded-lg border bg-muted/50 p-3 transition-colors">
                                <Checkbox
                                  id="worldwide"
                                  checked={isAllSelected}
                                  onCheckedChange={(checked) =>
                                    toggleWorldwide(!!checked)
                                  }
                                />
                                <Label
                                  htmlFor="worldwide"
                                  className="w-full cursor-pointer text-sm font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  Worldwide
                                </Label>
                              </div>

                              <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                  <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                  <span className="bg-background px-2 text-muted-foreground">
                                    Individual Continents
                                  </span>
                                </div>
                              </div>

                              {/* List of Continents */}
                              <div className="grid grid-cols-1 gap-3 px-1">
                                {continents.map((continent) => (
                                  <div
                                    key={continent}
                                    className="flex items-center space-x-3 space-y-0"
                                  >
                                    <Checkbox
                                      id={continent}
                                      checked={selectedLocation?.includes(
                                        continent
                                      )}
                                      onCheckedChange={() =>
                                        toggleContinent(continent)
                                      }
                                    />
                                    <Label
                                      htmlFor={continent}
                                      className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                      {continent}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Button type="submit" disabled={updateLoading || deleteLoading}>
              Update
              <ClipLoader
                color="white"
                loading={updateLoading}
                //cssOverride={override}
                size={25}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            </Button>
            <Button
              type="submit"
              className="ms-5 bg-red-700"
              onClick={handleDelete}
              disabled={updateLoading || deleteLoading}
            >
              Delete Listing
              <ClipLoader
                color="white"
                loading={deleteLoading}
                //cssOverride={override}
                size={25}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

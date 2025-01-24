'use client';
import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Heading } from '@/components/ui/heading';
import { Plus, Trash } from 'lucide-react';
import FileUpload from './fileUpload';
import { cn } from '@/lib/utils';
import { updateListing, getListing, deleteListing } from '@/utils/listings';
import { CurrentUserContextType } from '@/@types/user';
import { UserContext } from '@/context/UserProvider';
import { useRouter, useSearchParams } from 'next/navigation';

import ClipLoader from 'react-spinners/ClipLoader';

import MDEditor from '@uiw/react-md-editor';

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
  shipping: z.string().min(1, {
    message: 'Please select a shipping option.'
  })
});

export default function EditListingForm() {
  const { user } = React.useContext(UserContext) as CurrentUserContextType;
  const router = useRouter();

  const search = useSearchParams();
  const id = search.get('id');
  const [markdown, setMarkdown] = React.useState('');

  //console.log(markdown)

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
      shipping: '',
      price: 0,
      quantity: 0,
      sku: '',
      upc: 0
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
            shipping: res?.data?.listing?.shipping,
            price: res?.data?.listing?.price,
            quantity: res?.data?.listing?.quantity,
            sku: String(res?.data?.listing?.sku),
            upc: res?.data?.listing?.upc
          });
          setMarkdown(res?.data?.listing?.description);
          const images = res.data.listing.listingImage.map(
            (item: any) => item.url
          );
          setImages(images);
          setListingImages(images);
          //console.log(res.data.listing.variation.length)
          // setAddedOptions(res.data.listing.variation)
          // if (res.data.listing.variation.length > 0) {
          //   setIsChecked(true)
          // }
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
      setVariants(formatedData);
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
    console.log(values);
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
      shipping
    } = values;

    let variants = combineVariants();

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
    formData.append('shipping', shipping);
    formData.append('variation', JSON.stringify(variants));

    formData.append('userId', user?.userId);
    formData.append('storeId', user?.storeId);

    for (const image of listingImages) {
      formData.append('images', image);
    }

    updateListing(formData, user?.token, id)
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
    deleteListing(user?.token, id, user?.userId).then((res) => {
      router.back();
      setDeleteLoading(true);
    });
  }

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-left text-2xl font-bold">
          Edit Listing
        </CardTitle>
      </CardHeader>
      {!loading && (
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
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
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
                            <FormLabel className="font-normal">
                              Digital
                            </FormLabel>
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
                <div className="mt-5 space-y-4">
                  {variants.map((option, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      {/* Dropdown for Variant Type */}
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

                      {/* Input for Value */}
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

                      {/* Remove Variant Button */}
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

                  {/* Add Another Option Button */}
                  <button
                    type="button"
                    onClick={addVariant}
                    className={cn(buttonVariants({ variant: 'default' }))}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Another Option
                  </button>
                </div>

                {/* {listing?.variation.map((item: any, index: number) => (
                  <div className="rounded-md p-4 shadow" key={index}>
                    <div>
                      <>
                        <h5 className="capitalize">{`${item?.option}`}</h5>
                        {item.value.map((option: any, index: number) => (
                          <p
                            
                            className="mt-2 inline-flex items-center rounded-md text-sm capitalize"
                            key={index}
                          >
                            <Tag className="mr-2" /> {option}
                          </p>
                        ))}
                      </>
                    </div>
                  </div>
                ))} */}

                {/* {listing?.variation && listing.variation.length > 0 && (
                  <div className="mt-4">
                    <button
                      onClick={() => removeOptions()}
                      type="submit"
                      className={cn(buttonVariants({ variant: 'default' }))}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Clear Variations
                    </button>
                  </div>
                )} */}
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
                        <Input
                          type="number"
                          placeholder="Enter upc"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormField
                  control={form.control}
                  name="shipping"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <Heading
                        title={'Shipping'}
                        description=" Choose the shipping option available to deliver this listing."
                      />
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroupItem value="standard" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Standard Delivery ($4.99)
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroupItem value="express" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Express Delivery ($8.99)
                            </FormLabel>
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
              <Button type="submit" disabled={updateLoading || deleteLoading}>
                Submit
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
      )}
      {loading && (
        <CardTitle className="ms-6 text-left text-2xl font-bold">
          Loading...
        </CardTitle>
      )}
    </Card>
  );
}

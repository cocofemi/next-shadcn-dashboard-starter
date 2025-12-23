export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  userId: string;
  token: string;
  role: string;
  storeId: string;
  storeName: string;
  stripeAccountId: string;
  stripeOnboardingComplete: boolean;
  storeAddress: Address[];
  description: string;
  storeEmail: string;
}

export interface Address {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface ShippingAddress {
  line1: string;
  line2?: string;
  city: string;
  postal_code: string;
  state: string;
  country: string;
}

export interface ShippingLabel {
  labelUrl: string;
  trackingNumber: string;
  carrier: string;
  cost: number;
  currency: string;
  paid: boolean;
}

export interface IMetrics {
  totalOrders: number;
  signupCount: number;
  totalSales: number;
  storesCount: number;
}

export interface IStoreData {
  _id: string;
  storeName: string;
  description: string;
  social: string;
  website: string;
  pending: numnber;
  total: number;
}

export type CurrentUserContextType = {
  user: IUser;
  setUser: (user: IUser) => void;
  loading: boolean;
};

//user interface

export interface Users {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
}

export interface Stores {
  _id: string;
  storeName: string;
  location: string;
  description: string;
}

export interface Listing {
  _id: string;
  listingId: string;
  listingName: string;
  description: string;
  price: number;
  category: string;
  sku: string;
  upc: number;
  listingImage: ListingImage;
  storeName: string;
  createdAt: string;
}

export interface Blogs {
  _id: string;
  title: string;
  tag: string;
  author: UserId;
  content: string;
  createdAt: string;
}

export interface ListingImage {
  _id: string;
  url: string;
}

export interface Payout {
  _id: string;
  storeId: string;
  orderId: string;
  amount: number;
  stripeTransferId: string;
  status: string;
  date: string;
}

export interface Orders {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  orderId: string;
  item: OrderItem[];
  subTotal: number;
  userId: UserId;
  storeId: Store;
  shippingDetails: [ShippingAddress];
  fulfilled: [Fulfilled];
  createdAt: string;
}

export interface UserId {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
}
export type Store = {
  _id: string;
  storeName: string;
};

export interface OrderItem {
  price: number;
  quantity: number;
  storeId: string;
  fulfilled: boolean;
}

export interface Fulfilled {
  _id: string;
  storeId: string;
  fulfilled: boolean;
  fulfillmentDetails: string;
}

export interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string; // Consider using a proper date type if possible
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  longitude?: number; // Optional field
  latitude?: number; // Optional field
  job: string;
  profile_picture?: string | null; // Profile picture can be a string (URL) or null (if no picture)
}

export interface Product {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
}

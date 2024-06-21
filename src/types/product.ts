import { IUser } from "./user";

export interface IReview {
  user: IUser;
  comment: string;
  rating: number;
  like?: string;
  _id: string;
}

export interface Share {
  user: string | null;
  hashed: string;
  time: Date | null;
}

export interface ViewCount {
  hashed: string;
  time: Date | string;
}

export interface ISize {
  _id: string;
  size: string;
  quantity: number;
}

export interface IProduct {
  _id: string;
  name: string;
  // seller: string;
  seller: Seller;
  slug: string;
  images: string[];
  tags: string[];
  video?: string;
  brand?: string;
  color?: string;
  mainCategory: string;
  category?: string;
  subCategory?: string;
  material?: string;
  description: string;
  sizes: ISize[];
  buyers: string[];
  deliveryOption: IDeliveryOption[];
  condition: string;
  keyFeatures?: string;
  specification?: string;
  overview?: string;
  sellingPrice: number;
  costPrice: number;
  rating: number;
  likes: string[];
  shares: Share[];
  viewcount: ViewCount[];
  reviews: Review[];
  sold?: boolean;
  badge?: boolean;
  meta: Meta;
  active?: boolean;
  vintage?: boolean;
  luxury?: boolean;
  luxuryImage?: string;
  countInStock: number;
  region: "NGN" | "ZAR";
  isAvailable: boolean;
  sellingPriceHistory: SellingPriceHistory[];
  costPriceHistory: CostPriceHistory[];
  createdAt: string;
  updatedAt: string;
}

export type ProductWithPagination = Pagination & { products: IProduct[] };

export interface Seller {
  address: {
    street: string;
    state: string;
    zipcode: number;
  };
  rebundle: {
    status: boolean;
    count: number;
  };
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  image: string;
  rating?: number;
  email: string;
  followers: string[];
  sold: string[];
  numReviews: number;
  badge: boolean;
  region?: "NGN" | "ZAR";
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export interface IDeliveryOption {
  name: string;
  value: number;
}

export interface DeliveryMeta {
  name?: string;
  address?: string;
  phone?: string;
  lat?: number | string;
  lng?: number | string;
  stationId?: string;
}

export interface Stations {
  stationId: string;
  StateName: string;
}

export interface Review {
  user: IUser;
  comment: string;
  rating: number;
  like: string;
  createdAt?: string;
  _id: string;
}

export interface Meta {
  lat?: number;
  lng?: number;
  name: string;
  address: string;
  phone: string;
  stationId: number;
  point?: string;
  province?: string;
  shortName?: string;
  pickUp?: string;
  postalcode?: string;
  city?: string;
  suburb?: string;
  email?: string;
}

export interface SellingPriceHistory {
  value: number;
  updatedAt: string;
}

export interface CostPriceHistory {
  value: number;
  updatedAt: string;
}

export type ICreateProduct = Omit<
  IProduct,
  | "_id"
  | "seller"
  | "slug"
  | "buyers"
  | "rating"
  | "likes"
  | "shares"
  | "viewcount"
  | "sold"
  | "badge"
  | "active"
  | "region"
  | "isAvailable"
  | "sellingPriceHistory"
  | "costPriceHistory"
  | "createdAt"
  | "updatedAt"
  | "reviews"
>;

export type IBrand = {
  name: string;
  alpha: string;
  type: "SYSTEM" | "USER";
  published: boolean;
  _id: string;
  createdAt: string;
  updatedAt: string;
};

export type ICreateBrand = {
  published: boolean;
  name: string;
};

export type RecentProduct = {
  score: number;
  numViews: number;
  productId: string;
  product: IProduct;
};

export type Coupon =
  | {
      type: "fixed";
      value: number;
    }
  | {
      type: "percent";
      percentOff: number;
    };

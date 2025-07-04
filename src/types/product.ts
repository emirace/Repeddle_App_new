import { IUser } from "./user"

export interface IReview {
  user: IUser
  comment: string
  rating: number
  like: boolean
  _id: string
  createdAt: string
  updatedAt: string
}

export interface Share {
  user: string | null
  hashed: string
  time: Date | null
}

export interface ViewCount {
  hashed: string
  time: Date | string
}

export interface ISize {
  size: string
  quantity: number
}

export interface IProduct {
  _id: string
  name: string
  seller: Seller
  slug: string
  images: string[]
  tags: string[]
  video?: string
  brand?: string
  color?: string[]
  mainCategory: string
  category?: string
  subCategory?: string
  material?: string
  description: string
  sizes: ISize[]
  buyers: string[]
  deliveryOption: IDeliveryOption[]
  condition: string
  keyFeatures?: string
  specification?: string
  overview?: string
  sellingPrice: number
  costPrice?: number
  rating: number
  likes: string[]
  shares: Share[]
  viewcount: ViewCount[]
  reviews: IReview[]
  comments?: IComment[]
  sold?: boolean
  badge?: boolean
  meta: ProductMeta
  active?: boolean
  vintage?: boolean
  luxury?: boolean
  luxuryImage?: string
  countInStock: number
  region: "NG" | "ZA"
  isAvailable: boolean
  sellingPriceHistory: SellingPriceHistory[]
  costPriceHistory: CostPriceHistory[]
  createdAt: string
  updatedAt: string
  isInvalid?: boolean
}

export type ProductWithPagination = Pagination & { products: IProduct[] }

export type IComment = {
  _id: string
  comment: string
  userId?: IUser
  replies: ICommentReply[]
  likes: string[]
  image?: string
  createdAt: string
  updatedAt: string
}
export type ICommentReply = {
  _id: string
  comment: string
  userId: IUser
  likes: string[]
  createdAt: string
  updatedAt: string
}

export interface Seller {
  address: {
    street: string
    state: string
    zipcode: number
    region?: string
  }
  rebundle: {
    status: boolean
    count: number
  }
  _id: string
  username: string
  firstName: string
  lastName: string
  image: string
  email: string
  followers: string[]
  sold: string[]
  numReviews: number
  badge: boolean
  createdAt: string
  updatedAt: string
  rating: number
}

export interface Pagination {
  totalCount: number
  currentPage: number
  totalPages: number
}

export interface IDeliveryOption {
  name: string
  value: number
}

export interface DeliveryMeta {
  name?: string
  address?: string
  phone?: string
  lat?: number | string
  lng?: number | string
  stationId?: string
}

export interface Stations {
  stationId: string
  StateName: string
}

export interface ProductMeta {
  name?: string
  address?: string
  phone?: string
  stationId?: string | number
  lat?: string | number
  lng?: string | number
}

export interface SellingPriceHistory {
  value: number
  updatedAt: string
}

export interface CostPriceHistory {
  value: number
  updatedAt: string
}

export type ICreateProduct = Partial<IProduct>

export type IBrand = {
  name: string
  alpha: string
  type: "SYSTEM" | "USER"
  published: boolean
  _id: string
  createdAt: string
  updatedAt: string
}

export type ICreateBrand = {
  published: boolean
  name: string
}

export type RecentlyViewed = {
  numViews: number
  product: IProduct
  productId: string
  score: number
}

export type Coupon =
  | {
      type: "fixed"
      value: number
    }
  | {
      type: "percent"
      percentOff: number
    }

export type InputData = {
  name: string
  product: string
  category: string
  subCategory: string
  condition: string
  material: string
  description: string
  price: string
  keyFeatures: string
  selectedSize: string
  specification: string
  brand: string
  tag: string
}

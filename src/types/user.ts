import { IProduct, IReview, Pagination } from "./product"

export interface IAddress {
  apartment?: string
  street?: string
  state?: string
  zipcode?: number
}

export interface IRebundle {
  status: boolean
  count: number
  method?: string
}

export interface IGuestUser {
  fullName: string
  email: string
}

export interface IUser {
  _id: string
  username: string
  firstName: string
  lastName: string
  image?: string
  email: string
  role: string
  followers: string[]
  following: string[]
  likes: IProduct[]
  wishlist: string[]
  sold: string[]
  buyers: string[]
  rating: number
  phone?: string
  isSeller: boolean
  allowNewsletter: boolean
  numReviews: number
  reviews?: IReview[]
  active: boolean
  isVerifiedEmail: boolean
  region: "NG" | "ZA"
  socketId?: string
  activeLastUpdated?: string
  usernameLastUpdated?: string
  createdAt: string
  updatedAt?: string
  about?: string
  dob?: string
  accountNumber?: number
  accountName?: string
  bankName?: string
  tokenVersion?: string
  address?: IAddress
  badge?: boolean
  delected?: boolean
  influencer?: boolean
  rebundle?: IRebundle
  earnings?: number
  balance?: number
}

export type Wishlist = IProduct

export interface UpdateFields {
  // TODO: ask about username
  // username: string
  firstName: string
  lastName: string
  image?: string
  about: string
  dob: string
  phone: string
  address: {
    apartment: string
    street: string
    state: string
    zipcode: number
  }
  rebundle: {
    status: boolean
    count: number
  }
}

export type UpdateUser = Partial<IUser>

export type UserBalance = {
  currency: string
  balance: number
  userId: string
}

export type IUsersWithPagination = Pagination & { users: IUser[] }
export type ITopSellersWithPagination = {
  sellers: TopSellers[]
  currentPage: number
  totalPages: number
  totalSellers: number
}

export type TopSellers = {
  _id: string
  username: string
  image: string
  badge?: boolean
  totalEarnings: number
}

export type UserByUsername = {
  user: {
    _id: string
    username: string
    followers: string[]
    following: string[]
    likes: string[]
    sold: string[]
    numReviews: number
    region: string
    createdAt: string
    image?: string
    badge?: boolean
    about?: string
    rating?: number
    buyers?: string[]
    rebundle?: IRebundle
    reviews?: IReview[]
  }
  products: {
    all: IProduct[]
    sold: IProduct[]
    liked: IProduct[]
    selling: IProduct[]
  }
}

export type Analytics = {
  totalUsers: number
  totalOrders: number
  totalProducts: number
  totalEarnings: number
  newMembers: {
    _id: string
    email: string
    createdAt: string
    firstName: string
    image: string
    lastName: string
    username: string
  }[]
  recentProducts: {
    _id: string
    name: string
    slug: string
    images: string[]
    createdAt: string
  }[]
  topSellers: {
    _id: string
    username: string
    image: string
    totalSales: number
    createdAt?: string
  }[]
  mostViewedProducts: {
    _id: string
    name: string
    slug: string
    images: string[]
    viewcount: string[]
  }[]
  outOfStockProducts: {
    _id: string
    name: string
    slug: string
    images: string[]
    viewcount: string[]
    createdAt?: string
  }[]
}

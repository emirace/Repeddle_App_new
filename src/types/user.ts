import { IProduct, Pagination } from "./product"

export interface IAddress {
  apartment?: string
  street?: string
  state?: string
  zipcode?: number
}

export interface IRebundle {
  status: boolean
  count: number
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
  wishlist: IProduct[]
  sold: string[]
  buyers: string[]
  rating: number
  phone?: string
  allowNewsletter: boolean
  numReviews: number
  active: boolean
  isVerifiedEmail: boolean
  region: "NGN" | "ZAR"
  socketId?: string
  activeLastUpdate: string
  usernameLastUpdate?: string
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
}

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

export type UserBalance = {
  currency: string
  balance: number
  userId: string
}

export type IUsersWithPagination = Pagination & { users: IUser[] }

export type TopSellers = {
  username: string
  firstName: string
  lastName: string
  image: string
  sold: number
}

import { IDeliveryOption, IProduct } from "./product"
import { IUser } from "./user"

export type DeliverStatus =
  | "In Transit"
  | "Processing"
  | "Dispatched"
  | "Return Logged"
  | "Received"
  | "Delivered"
  | "Rejected"
  | "Hold"

export type OrderItem = {
  product: IProduct
  seller: IUser
  quantity: number
  price: number
  selectedSize: string
  selectedColor: string
  trackingNumber?: string
  isHold?: boolean
  deliveryOption: {
    fee: number
    method: string
    _id: string
  }
  deliveryTracking: {
    currentStatus: {
      status: string
      timestamp: string
      _id: string
    }
    history: {
      status: string
      timestamp: string
      _id: string
    }[]
  }
  _id: string
}

export type IOrder = {
  buyer: IUser
  items: OrderItem[]
  totalAmount: number
  paymentMethod: string
  transactionId: string
  _id: string
  createdAt: string
  updatedAt: string
}

export type ICreateOrder = {
  items: {
    _id: string
    quantity: number
    selectedSize?: string
    selectedColor?: string
    deliveryOption?: IDeliveryOption[]
  }[]
  totalAmount: number
  paymentMethod: string
  transactionId?: string
}

export type IOrderSummary = {
  purchaseOrders: {
    numOrders: number
    numSales: number
  }
  soldOrders: {
    numOrders: number
    numSales: number
  }
  dailyPurchasedOrders: {
    _id: string
    orders: number
    sales: number
  }[]
  dailySoldOrders: {
    _id: string
    orders: number
    sales: number
  }[]
}

export type Order = {
  buyer: string
  items: OrderItem[]
  totalAmount: number
  paymentMethod: string
  transactionId: string
  _id: string
  createdAt: string
  updatedAt: string
}

export enum DeliverStatusEnum {
  Processing = 1,
  Dispatched = 2,
  "In Transit" = 3,
  Delivered = 4,
  Received = 5,
  "Return Logged" = 6,
  "Return Approved" = 8,
  "Return Declined" = 7,
  "Return Dispatched" = 9,
  "Return Delivered" = 10,
  "Return Received" = 11,
  Refunded = 12,
  "Payment to Seller Initiated" = 13,
}

export type IReturn = {
  orderId: IOrder
  productId: IProduct
  reason: string
  refund: string
  image: string
  images?: string[]
  others: string
  region: string
  adminReason: string
  trackingNumber?: string
  status: string
  deliveryOption: {
    fee: number
    method: string
    _id: string
  }
  deliverySelected?: {
    fee: number
    method: string
    _id: string
  }
  deliveryTracking: {
    currentStatus: {
      status: string
      timestamp: string
      _id: string
    }
    history: {
      status: string
      timestamp: string
      _id: string
    }[]
  }
  _id: string
  createdAt: string
  updatedAt: string
}

export type CreateReturn = {
  orderId: string
  productId: string
  reason: string
  refund: string
  image: string
  images?: string[]
  others: string
  deliveryOption: {
    method: string
    fee: number
  }
}

export type IDeliveryMeta = {
  lat?: number | string
  lng?: number | string
  name?: string
  email?: string
  phone?: string
  company?: string
  stationId?: string
  shortName?: string
  address?: string
  province?: string
  city?: string
  suburb?: string
  postalcode?: string
  pickUp?: string
  "delivery Option"?: string
  deliveryOption?: string
  fee?: number
  cost?: number
}

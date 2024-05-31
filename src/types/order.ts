/* eslint-disable @typescript-eslint/no-explicit-any */
// TODO: remove the lint above
import { IProduct } from "./product"
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
  onHold?: boolean
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

// TODO: remove when return is implemented
export type IOrder1 = {
  buyer: string
  items: {
    product: IProduct
    seller: string
    quantity: number
    price: number
    selectedSize: string
    selectedColor: string
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
  }[]
  totalAmount: number
  paymentMethod: string
  transactionId: string
  _id: string
  createdAt: string
  updatedAt: string
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
    selectedSize: string
    selectedColor: string
    deliveryOption: string
  }[]
  totalAmount: number
  paymentMethod: string
  transactionId: string
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
    date: string
    orders: number
    sales: number
  }[]
  dailySoldOrders: {
    date: string
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
  comfirmDelivery?: string
  _id: string
  orderId: {
    _id: string
    orderItems: Array<{
      _id: string
      name: string
      sellerName: string
      seller: {
        address: {
          street: string
          state: string
          zipcode: number
          apartment?: string
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
        followers: Array<string>
        sold: Array<string>
        rating: number
        numReviews: number
        badge: boolean
        region: "NGN" | "ZAR"
      }
      slug: string
      image: string
      images: Array<string | undefined>
      tags: Array<string>
      video: string
      brand: string
      color: string
      category: string
      product: string
      subCategory: string
      material: string
      description: string
      sizes: Array<{
        size: string
        value: string
      }>
      userBuy: Array<any>
      deliveryOption: Array<{
        name: string
        value: any
      }>
      condition: string
      shippingLocation: string
      keyFeatures: string
      price: number
      actualPrice: number
      rating: number
      currency: string
      numReviews: number
      likes: Array<any>
      sold: boolean
      soldAll: boolean
      meta?: {
        lat: number
        lng: number
        name: string
        address: string
        phone: string
        stationId: number
      }
      active: boolean
      countInStock: number
      region: "NGN" | "ZAR"
      isAvailable: boolean
      shares: Array<any>
      viewcount: Array<{
        hashed: string
        time: string
        _id: string
      }>
      reviews: Array<any>
      createdAt: string
      updatedAt: string
      productId: string
      quantity: number
      selectSize: string
      deliverySelect: {
        "delivery Option": string
        cost: any
        total: {
          status: boolean
          cost: any
        }
        province?: string
        address?: string
        phone?: string
      }
      deliveryStatus: string
      deliveredAt: number
      notifications: Array<string>
      trackingNumber?: string
      returnTrackingNumber: any
    }>
    user: {
      _id: string
      username: string
    }
  }
  productId: IProduct
  sellerId: string
  buyerId: string
  reason: string
  sending: {
    "delivery Option": string
    cost: any
    total: {
      status: boolean
      cost: any
    }
    province?: string
    address?: string
    phone?: string
  }
  refund: string
  image: string
  others: string
  region: "NGN" | "ZAR"
  status: string
  returnId: string
  createdAt: string
  updatedAt: string
  adminReason?: string
  returnDelivery?: {
    "delivery Option": string
    cost: any
  }
}

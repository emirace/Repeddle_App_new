import { IOrder, Order } from "../types/order"
import { IProduct, Seller } from "../types/product"
import { IUser } from "../types/user"

export const seller: Seller = {
  address: {
    street: "1 Fagba Street",
    state: "Lagos",
    zipcode: 1234,
  },
  rebundle: {
    status: true,
    count: 1,
  },
  _id: "63cf9a386f44b86e44e3b31e",
  username: "KendoMash",
  firstName: "Repeddle",
  lastName: "Nigeria",
  image:
    "https://res.cloudinary.com/emirace/image/upload/v1692275468/mcph4bdajocqwg4dnxmz.jpg",
  email: "repeddleng@gmail.com",
  followers: ["63cfcd166f44b86e44e3b7e2"],
  sold: ["654b7a7a8698d309f6f768bc", "654b76048698d309f6f767fd"],
  numReviews: 0,
  rating: 0,
  badge: false,
  createdAt: "2023-02-19T13:25:59.641Z",
  updatedAt: "2023-09-15T21:13:45.394Z",
}

export const user: IUser = {
  address: {
    street: "1 Fagba Street",
    state: "Lagos",
    zipcode: 1234,
  },
  role: "user",
  // earnings: 0,
  isVerifiedEmail: true,
  _id: "63cf9a386f44b86e44e3b31e",
  username: "KendoMash",
  firstName: "Repeddle",
  lastName: "Nigeria",
  image:
    "https://res.cloudinary.com/emirace/image/upload/v1692275468/mcph4bdajocqwg4dnxmz.jpg",
  email: "repeddleng@gmail.com",
  followers: ["63cfcd166f44b86e44e3b7e2"],
  following: [
    "63f2164fc1128baf474cd433",
    "63c9cde6b677973f8c09dec8",
    "64b262e93861c827cbd5c822",
    "63cfcd166f44b86e44e3b7e2",
  ],
  likes: [],
  rebundle: {
    status: true,
    count: 1,
  },
  wishlist: [],
  sold: ["654b7a7a8698d309f6f768bc", "654b76048698d309f6f767fd"],
  activeLastUpdate: "2023-01-24T09:48:48.167Z",
  rating: 0,
  phone: "0815133377",
  numReviews: 0,
  badge: false,
  delected: false,
  dob: "",
  tokenVersion: "1",
  active: true,
  influencer: false,
  region: "NGN",
  buyers: [],
  createdAt: "2023-01-24T08:43:36.887Z",
  allowNewsletter: true,
  accountName: "Repeddle Ng",
  accountNumber: 1234567,
  bankName: "Union Bank",
  about:
    "You will find beautiful rear finds in my store from ladies, men, kids wear, shoes and accessories. Happy Exploring and thank you for checking my store out🤗\n\nMy products ships fast within 2-4 days😍",
}

export const productDetails: IProduct = {
  name: "Summer Shirt",
  _id: "654b7a7a8698d309f6f768bc",
  condition: "Fair Condition",
  countInStock: 0,
  description: "Summer time shirt.",
  images: [
    "https://res.cloudinary.com/emirace/image/upload/v1699445166/kz62skutfsvwx41us3ll.jpg",
    "https://res.cloudinary.com/emirace/image/upload/v1699445220/k6ycrmabw1fgztkmyaai.jpg",
    "https://res.cloudinary.com/emirace/image/upload/v1699445251/ok8e4k7uv97obqkhtmdf.jpg",
  ],
  buyers: [],
  costPriceHistory: [],
  deliveryOption: [],
  sellingPriceHistory: [],
  createdAt: "2023-02-19T13:25:59.641Z",
  updatedAt: "2023-09-15T21:13:45.394Z",
  isAvailable: true,
  likes: [],
  category: "clothing",
  mainCategory: "clothing",
  subCategory: "Shirts",
  meta: {
    lat: -25.9735997,
    lng: 28.1100373,
    name: "Kendo",
    address: "1 Folaoshibo Street Lekki",
    phone: "0992272788",
    stationId: 4,
  },
  rating: 0,
  region: "NGN",
  reviews: [],
  seller: seller,
  sellingPrice: 900,
  costPrice: 900,
  shares: [],
  sizes: [
    {
      size: "XL",
      quantity: 0,
    },
  ],
  slug: "summer-shirt",
  tags: ["T-Shirt", "Menclothing", "Menshirt"],
  active: true,
  badge: false,
  brand: "nautica",
  color: "multiculour",
  keyFeatures: "men",
  material: "Cotton",
  sold: true,
  specification: "cotton",
  video: "",
  vintage: false,
  viewcount: [
    {
      hashed: "c0b2f9e4cc9ba3087bfe873fa00664e6",
      time: "2023-11-21T08:29:14.889Z",
    },
    {
      hashed: "c0574527ebec7ee6042b669c195ae304",
      time: "2023-11-21T08:29:30.036Z",
    },
    {
      hashed: "42e189efe36e946da0e00f1fec20ffba",
      time: "2023-11-24T09:53:27.484Z",
    },
    {
      hashed: "be71d831bf361b71231178a543a8366a",
      time: "2023-12-10T07:28:52.258Z",
    },
    {
      hashed: "56f59448fe30bba3aaa5d8bde329231b",
      time: "2023-12-20T02:47:56.269Z",
    },
    {
      hashed: "4efbfb805f8eccf66e659b3e2b8aba53",
      time: "2024-01-05T12:45:49.260Z",
    },
    {
      hashed: "fb6a7e3f33d4efd9608b3ab7eafb8613",
      time: "2024-03-15T03:30:33.217Z",
    },
    {
      hashed: "c9fe9d89da945343315815fa3c9b7b42",
      time: "2024-04-04T13:15:11.263Z",
    },
    {
      hashed: "e694067113defed3717b5fb575384821",
      time: "2024-04-12T20:10:34.842Z",
    },
  ],
}

export const orderData: IOrder = {
  items: [
    {
      ...productDetails,
      quantity: 2,
      onHold: false,

      deliveryOption: { fee: 100, _id: "ee", method: "gig" },
      price: 334,
      selectedColor: "dd111",
      _id: "fdf",
      selectedSize: "dsds",
      seller: user,
      product: productDetails,
      deliveryTracking: {
        currentStatus: {
          _id: "dffddf",
          status: "dsdsfd",
          timestamp: "2023-01-24T08:43:36.887Z",
        },
        history: [
          {
            _id: "dkdkf",
            status: "Delivered",
            timestamp: "2023-01-24T08:43:36.887Z",
          },
        ],
      },
    },
  ],
  paymentMethod: "paypal",
  totalAmount: 600,
  buyer: user,
  transactionId: "fddff",
  _id: "dsddf",
  createdAt: "2023-01-24T08:43:36.887Z",
  updatedAt: "2023-01-24T08:43:36.887Z",
}

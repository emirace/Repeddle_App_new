import { saveImageService } from "../services/image"
import { IProduct } from "../types/product"
import * as WebBrowser from "expo-web-browser"

export const currency = (region: IProduct["region"]) => {
  if (region === "NGN") return "₦"
  return "R"
}

export const region = (): IProduct["region"] => {
  // TODO:
  return "NGN"
}

export const goto = async (address: string) => {
  let result = await WebBrowser.openBrowserAsync(address)
}

export const currentAddress = (region: IProduct["region"]) =>
  region === "NGN" ? "https://repeddle.com" : "https://repeddle.co.za"

export const daydiff = (start: Date | string | number, end: number) => {
  if (!start) return 0
  const startNum = timeDifference(new window.Date(start), new window.Date())
  console.log("startNum", start, end - startNum)
  return end - startNum
}

export function timeDifference(date1: Date, date2: Date) {
  console.log(date1, date2)
  const Difference_In_Time = date2.getTime() - date1.getTime()
  const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24)
  return Math.floor(Difference_In_Days)
}

export const uploadImage = async (file: File, image?: string) => {
  const formData = new FormData()
  formData.append("image", file)
  image && formData.append("deleteImage", image)

  try {
    const url = await saveImageService(formData)
    return url
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    throw new Error(error as any)
  }
}

export const deliveryNumber = (status: string) => {
  const deliveryStatusMap = {
    Processing: 1,
    Dispatched: 2,
    "In Transit": 3,
    Delivered: 4,
    Received: 5,
    "Return Logged": 6,
    "Return Approved": 8,
    "Return Declined": 7,
    "Return Dispatched": 9,
    "Return Delivered": 10,
    "Return Received": 11,
    Refunded: 12,
    "Payment to Seller Initiated": 13,
  } as const

  return deliveryStatusMap[status as keyof typeof deliveryStatusMap] ?? 0
}

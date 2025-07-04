import { CartItem } from "../contexts/CartContext";
import { deleteImageService, saveImageService } from "../services/image";
import { Coupon, IProduct } from "../types/product";
import * as WebBrowser from "expo-web-browser";
import * as SecureStore from "expo-secure-store";
import { v4 as uuidv4 } from "uuid";

export const currency = (region: IProduct["region"]) => {
  if (region === "NG") return "₦";
  return "R";
};

export const region = (): IProduct["region"] => {
  // TODO:
  return "NG";
};

export const goto = async (address: string) => {
  let result = await WebBrowser.openBrowserAsync(address);
};

export const currentAddress = (region: IProduct["region"]) =>
  region === "NG" ? "https://repeddle.com" : "https://repeddle.co.za";

export const daydiff = (start: Date | string | number, end: number) => {
  if (!start) return 0;
  const startNum = timeDifference(new window.Date(start), new window.Date());
  console.log("startNum", start, end - startNum);
  return end - startNum;
};

export function timeDifference(date1: Date, date2: Date) {
  console.log(date1, date2);
  const Difference_In_Time = date2.getTime() - date1.getTime();
  const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
  return Math.floor(Difference_In_Days);
}

export const uploadImage = async (file: File, image?: string) => {
  const formData = new FormData();
  formData.append("image", file);
  image && formData.append("deleteImage", image);

  try {
    const url = await saveImageService(formData);
    return url;
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    throw new Error(error as any);
  }
};

export const deleteImage = async (url: string) => {
  try {
    const res = await deleteImageService(url);
    console.log(res);
    return res;
  } catch (error) {
    throw new Error(error as any);
  }
};

export const deliveryStatusMap = {
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
} as const;

export const deliveryNumber = (status: string) => {
  return deliveryStatusMap[status as keyof typeof deliveryStatusMap] ?? 0;
};

export const conditionDetails = (item: string) => {
  if (item === "New with Tags") {
    return "New with Tags: A preowned secondhand product that has never been worn or used. These products reflect no sign of use and has its original purchase tags on it. This product shows no alterations, no defects and comes with Original purchase tags.";
  } else if (item === "New with No Tags") {
    return "A preowned secondhand product that has never been worn or use but doesn’t have original purchase tags. This product should show no defects or alterations.";
  } else if (item === "Excellent Condition") {
    return "A preowned secondhand Product still in an excellent condition that has only been used or worn very slightly, (perhaps 1–3 times) and carefully maintained. These Product may reflect very minimal worn or usage sign. Product do not have any damage on the fabric or material, no worn smell and no missing accessory, button or pieces. ";
  } else if (item === "Good Condition") {
    return "A preowned secondhand product in a very good condition which has been used or worn and properly maintained. No remarkable defects (Tear, Hole or Rust) expected.";
  } else if (item === "Fair Condition") {
    return "A preowned secondhand product which has been frequently used or worn. Products may show reasonable defects signs, scratches, worn corners or interior wear. Defects are shown on product photos and mentioned in description.";
  } else {
    return "No condition Selected";
  }
};

export const checkDeliverySelect = (cart: CartItem[]) => {
  var success = true;
  cart.map((x) => {
    if (!x.deliverySelect) {
      success = false;
    }
  });
  return success;
};

export const generateTransactionRef = (length: number) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return `rep_tx_ref_${result}`;
};

export const couponDiscount = (coupon: Coupon, price: number) => {
  if (coupon.type === "fixed") {
    return coupon.value;
  } else if (coupon.type === "percent") {
    return (coupon.percentOff / 100) * price;
  } else {
    return 0;
  }
};

export const createSearchParam = (params: [string, string][] | string[][]) => {
  let string = "";

  params = params.filter((param) => param[1] !== "");

  if (params.length) {
    string = new URLSearchParams(params).toString();
  }

  return string;
};

const DEVICE_ID_KEY = "device-unique-id";

export async function getOrCreateDeviceId(): Promise<string> {
  let deviceId = await SecureStore.getItemAsync(DEVICE_ID_KEY);

  if (!deviceId) {
    deviceId = uuidv4();
    await SecureStore.setItemAsync(DEVICE_ID_KEY, deviceId);
  }

  return deviceId;
}

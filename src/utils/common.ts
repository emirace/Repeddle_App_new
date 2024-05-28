import { IProduct } from "../types/product"

export const currency = (region: IProduct["region"]) => {
  if (region === "NGN") return "₦"
  return "R"
}

import { useContext } from "react"
import { ProductContext } from "../contexts/ProductContext"

const useProducts = () => {
  const context = useContext(ProductContext)

  if (!context)
    throw new Error("UseProducts must be used within a category context")

  return context
}

export default useProducts

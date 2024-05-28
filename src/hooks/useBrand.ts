import { useContext } from "react"
import { BrandContext } from "../contexts/BrandContext"

const useBrands = () => {
  const context = useContext(BrandContext)

  if (!context)
    throw new Error("useBrands must be used within a category context")

  return context
}

export default useBrands

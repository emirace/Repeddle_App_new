import { useContext } from "react"
import { CategoryContext } from "../contexts/CategoryContext"

const useCategory = () => {
  const context = useContext(CategoryContext)

  if (!context)
    throw new Error("UseCategory must be used within a category context")

  return context
}

export default useCategory

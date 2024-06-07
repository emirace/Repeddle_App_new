import { useContext } from "react"
import { StoreContext } from "../contexts/StoreContext"

const useStore = () => {
  const context = useContext(StoreContext)

  if (!context)
    throw new Error("useStore must be used within a category context")

  return context
}

export default useStore

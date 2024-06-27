import { useContext } from "react"
import { ReturnContext } from "../contexts/ReturnContext"

const useReturn = () => {
  const context = useContext(ReturnContext)

  if (!context)
    throw new Error("useReturn must be used within a Return context")

  return context
}

export default useReturn

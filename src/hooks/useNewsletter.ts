import { useContext } from "react"
import { NewsletterContext } from "../contexts/NewsletterContext"

const useNewsletter = () => {
  const context = useContext(NewsletterContext)

  if (!context)
    throw new Error("useNewsletter must be used within a category context")

  return context
}

export default useNewsletter

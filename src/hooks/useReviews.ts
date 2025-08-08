import { useContext } from "react"
import { ReviewContext } from "../contexts/ReviewContext"

const useReviews = () => {
  const context = useContext(ReviewContext)

  if (!context)
    throw new Error("useReviews must be used within a review context")

  return context
}

export default useReviews

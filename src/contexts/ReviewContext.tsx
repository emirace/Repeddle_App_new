import { createContext, PropsWithChildren, useState } from "react"
import {
  IComment,
  ICommentReply,
  ICreateProduct,
  IProduct,
  IReview,
  ProductWithPagination,
  ReviewWithPagination,
} from "../types/product"
import useAuth from "../hooks/useAuth"
import {
  createProductReviewService,
  createUserReviewService,
  deleteProductReviewService,
  deleteUserReviewService,
  editProductReviewService,
  editUserReviewService,
  fetchUserReviewsService,
} from "../services/review"

type ContextType = {
  fetchUserReviews: (params?: string) => Promise<ReviewWithPagination | string>
  createProductReview: (
    id: string,
    review: { comment: string; rating: number; like: boolean }
  ) => Promise<{ message: string; review: IReview } | string>
  createUserReview: (
    id: string,
    review: { comment: string; rating: number; like: boolean }
  ) => Promise<{ message: string; review: IReview } | string>
  editProductReview: (
    id: string,
    review: {
      comment: string
      rating: number
      like: boolean
      _id: string
      itemType: "Product"
    }
  ) => Promise<{ message: string; review: IReview } | string>
  editUserReview: (
    id: string,
    review: {
      comment: string
      rating: number
      like: boolean
      _id: string
      itemType: "User"
    }
  ) => Promise<{ message: string; review: IReview } | string>
  deleteProductReview: (id: string) => Promise<{ message: string } | string>
  deleteUserReview: (id: string) => Promise<{ message: string } | string>
  // likeProductReview: (id: string) => Promise<{ message: string } | string>
  // unlikeProductReview: (id: string) => Promise<{ message: string } | string>
  loading: boolean
  error: string
}

// Create product context
export const ReviewContext = createContext<ContextType | undefined>(undefined)

export const ReviewProvider = ({ children }: PropsWithChildren) => {
  const { setAuthErrorModalOpen } = useAuth()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleError = (error: any) => {
    setLoading(false)

    // Check if the error indicates an invalid or expired token
    if (error === "Token expired" || error === "Invalid token") {
      setError("")
      // Set the state to open the auth error modal
      setAuthErrorModalOpen(true)
    } else {
      setError(error || "An error occurred.")
    }
  }

  // Function to fetch products
  const fetchUserReviews = async (params?: string) => {
    try {
      setError("")
      setLoading(true)
      const result = await fetchUserReviewsService(params)
      // setProducts(result)
      setLoading(false)
      return result
    } catch (error) {
      handleError(error as string)
      setLoading(false)
      return error as string
    }
  }

  // Function to fetch product by slug
  const createProductReview = async (
    id: string,
    review: { comment: string; rating: number; like: boolean }
  ) => {
    try {
      setError("")
      setLoading(true)
      const result = await createProductReviewService(id, review)
      setLoading(false)
      return result
    } catch (error) {
      handleError(error as string)
      setLoading(false)
      return error as string
    }
  }

  const createUserReview = async (
    id: string,
    review: { comment: string; rating: number; like: boolean }
  ) => {
    try {
      setError("")
      setLoading(true)
      const result = await createUserReviewService(id, review)
      setLoading(false)
      return result
    } catch (error) {
      handleError(error as string)
      setLoading(false)
      return error as string
    }
  }

  const editProductReview = async (
    id: string,
    review: { comment: string; rating: number; like: boolean; _id: string }
  ) => {
    try {
      setError("")
      setLoading(true)
      const result = await editProductReviewService(id, review)
      setLoading(false)
      return result
    } catch (error) {
      handleError(error as string)
      setLoading(false)
      return error as string
    }
  }

  const editUserReview = async (
    id: string,
    review: { comment: string; rating: number; like: boolean; _id: string }
  ) => {
    try {
      setError("")
      setLoading(true)
      const result = await editUserReviewService(id, review)

      setLoading(false)
      return result
    } catch (error) {
      handleError(error as string)
      setLoading(false)
      return error as string
    }
  }

  const deleteProductReview = async (id: string) => {
    try {
      setError("")
      setLoading(true)
      const result = await deleteProductReviewService(id)
      // setProducts((prevProducts) => {
      //   const updatedProducts = prevProducts.products.map((p) =>
      //     p._id === id ? result : p
      //   )

      //   const newProd = { ...prevProducts, products: updatedProducts }
      //   return newProd
      // })
      setLoading(false)
      return result
    } catch (error) {
      handleError(error as string)
      setLoading(false)
      return error as string
    }
  }

  const deleteUserReview = async (id: string) => {
    try {
      setError("")
      setLoading(true)
      const data = await deleteUserReviewService(id)
      // setProducts((prevProducts) => {
      //   const updatedProducts = prevProducts.products.filter(
      //     (Product) => Product._id !== id
      //   )

      //   const newProd = {
      //     ...prevProducts,
      //     products: updatedProducts,
      //   }
      //   return newProd
      // })
      setLoading(false)
      return { message: data.message }
    } catch (error) {
      // handleError(error as string)
      setLoading(false)
      return error as string
    }
  }

  // const likeProductReview = async (id: string) => {
  //   try {
  //     setError("")
  //     // setLoading(true)
  //     const result = await likeProductReviewService(id)
  //     // setProducts((prevProducts) => {
  //     //   const updatedProducts = prevProducts.products.map((prod) => {
  //     //     if (prod._id === id) {
  //     //       prod.likes = result.likes
  //     //     }
  //     //     return prod
  //     //   })
  //     //   const newProd = { ...prevProducts, products: updatedProducts }
  //     //   return newProd
  //     // })
  //     // setLoading(false)
  //     return result
  //   } catch (error) {
  //     handleError(error as string)
  //     // setLoading(false)
  //     return error as string
  //   }
  // }
  // const unlikeProductReview = async (id: string) => {
  //   try {
  //     setError("")
  //     // setLoading(true)
  //     const result = await unlikeProductReviewService(id)
  //     // setProducts((prevProducts) => {
  //     //   const updatedProducts = prevProducts.products.map((prod) => {
  //     //     if (prod._id === id) {
  //     //       prod.likes = result.likes
  //     //     }
  //     //     return prod
  //     //   })
  //     //   const newProd = { ...prevProducts, products: updatedProducts }
  //     //   return newProd
  //     // })
  //     // setLoading(false)
  //     return result
  //   } catch (error) {
  //     handleError(error as string)
  //     // setLoading(false)
  //     return error as string
  //   }
  // }

  return (
    <ReviewContext.Provider
      value={{
        fetchUserReviews,
        loading,
        error,
        createProductReview,
        deleteProductReview,
        editProductReview,
        editUserReview,
        deleteUserReview,
        createUserReview,
      }}
    >
      {children}
    </ReviewContext.Provider>
  )
}

import { createContext, PropsWithChildren, useState } from "react"
import {
  IComment,
  ICommentReply,
  ICreateProduct,
  IProduct,
  IReview,
  ProductWithPagination,
} from "../types/product"
import useAuth from "../hooks/useAuth"
import {
  commentProductService,
  createProductReviewService,
  createProductService,
  deleteProductService,
  fetchProductByIdService,
  fetchProductBySlugService,
  fetchProductsService,
  fetchUserProductsService,
  likeProductCommentReplyService,
  likeProductCommentService,
  likeProductService,
  replyProductCommentService,
  unlikeProductCommentReplyService,
  unlikeProductCommentService,
  unlikeProductService,
  updateProductService,
} from "../services/product"

type ContextType = {
  products: ProductWithPagination
  loading: boolean
  error: string
  fetchProducts: (params?: string) => Promise<boolean>
  fetchUserProducts: (params?: string) => Promise<boolean>
  fetchProductBySlug: (slug: string) => Promise<IProduct | null>
  fetchProductById: (id: string) => Promise<IProduct | string>
  createProduct: (product: ICreateProduct) => Promise<IProduct | null>
  updateProduct: (id: string, product: ICreateProduct) => Promise<boolean>
  deleteProduct: (id: string) => Promise<{ message?: string }>
  likeProduct: (id: string) => Promise<{
    message: string
    likes: string[]
  } | null>
  unlikeProduct: (id: string) => Promise<{
    message: string
    likes: string[]
  } | null>
  commentProduct: (
    id: string,
    comment: string
  ) => Promise<{
    comment: IComment
  } | null>
  likeProductComment: (
    id: string,
    commentId: string
  ) => Promise<{
    message: string
    comment: IComment
  } | null>
  unlikeProductComment: (
    id: string,
    commentId: string
  ) => Promise<{
    message: string
    comment: IComment
  } | null>
  replyProductComment: (
    id: string,
    commentId: string,
    comment: string
  ) => Promise<{
    message: string
    comment: ICommentReply
  } | null>
  likeProductCommentReply: (
    id: string,
    commentId: string,
    replyId: string
  ) => Promise<{
    message: string
    reply: ICommentReply
  } | null>
  unlikeProductCommentReply: (
    id: string,
    commentId: string,
    replyId: string
  ) => Promise<{
    message: string
    reply: ICommentReply
  } | null>
  createProductReview: (
    id: string,
    review: {
      comment: string
      rating: number
      like: boolean
    }
  ) => Promise<{
    message: string
    review: IReview
  } | null>
}

// Create product context
export const ProductContext = createContext<ContextType | undefined>(undefined)

export const ProductProvider = ({ children }: PropsWithChildren) => {
  const { setAuthErrorModalOpen } = useAuth()
  const [products, setProducts] = useState<ProductWithPagination>({
    currentPage: 0,
    products: [],
    totalCount: 0,
    totalPages: 0,
  })
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
  const fetchProducts = async (params?: string) => {
    try {
      setError("")
      setLoading(true)
      const result = await fetchProductsService(params)
      setProducts(result)
      setLoading(false)
      return true
    } catch (error) {
      handleError(error as string)
      setLoading(false)
      return false
    }
  }

  // Function to fetch products
  const fetchUserProducts = async (params?: string) => {
    try {
      setError("")
      setLoading(true)
      const result = await fetchUserProductsService(params)
      setProducts(result)
      setLoading(false)
      return true
    } catch (error) {
      handleError(error as string)
      setLoading(false)
      return false
    }
  }

  // Function to fetch product by slug
  const fetchProductBySlug = async (slug: string) => {
    try {
      setError("")
      setLoading(true)
      const result = await fetchProductBySlugService(slug)
      setLoading(false)
      return result
    } catch (error) {
      handleError(error as string)
      setLoading(false)
      return null
    }
  }

  const fetchProductById = async (id: string) => {
    try {
      setError("")
      setLoading(true)
      const result = await fetchProductByIdService(id)
      setLoading(false)
      return result
    } catch (error) {
      handleError(error as string)
      setLoading(false)
      return error as string
    }
  }

  const createProduct = async (product: ICreateProduct) => {
    try {
      setError("")
      setLoading(true)
      const result = await createProductService(product)
      setProducts((prevProducts) => {
        const updatedProducts = [result, ...prevProducts.products]
        const newProd = {
          ...prevProducts,
          products: updatedProducts,
        }
        return newProd
      })
      setLoading(false)
      return result
    } catch (error) {
      handleError(error as string)
      setLoading(false)
      return null
    }
  }

  const updateProduct = async (id: string, product: ICreateProduct) => {
    try {
      setError("")
      setLoading(true)
      const result = await updateProductService(id, product)
      setProducts((prevProducts) => {
        const updatedProducts = prevProducts.products.map((p) =>
          p._id === id ? result : p
        )

        const newProd = { ...prevProducts, products: updatedProducts }
        return newProd
      })
      setLoading(false)
      return true
    } catch (error) {
      handleError(error as string)
      setLoading(false)
      return false
    }
  }

  const deleteProduct = async (id: string) => {
    try {
      setError("")
      setLoading(true)
      const data = await deleteProductService(id)
      setProducts((prevProducts) => {
        const updatedProducts = prevProducts.products.filter(
          (Product) => Product._id !== id
        )

        const newProd = {
          ...prevProducts,
          products: updatedProducts,
        }
        return newProd
      })
      setLoading(false)
      return { message: data.message }
    } catch (error) {
      // handleError(error as string)
      setLoading(false)
      return { message: error as string }
    }
  }

  const likeProduct = async (id: string) => {
    try {
      setError("")
      // setLoading(true)
      const result = await likeProductService(id)
      setProducts((prevProducts) => {
        const updatedProducts = prevProducts.products.map((prod) => {
          if (prod._id === id) {
            prod.likes = result.likes
          }
          return prod
        })
        const newProd = { ...prevProducts, products: updatedProducts }
        return newProd
      })
      // setLoading(false)
      return result
    } catch (error) {
      handleError(error as string)
      // setLoading(false)
      return null
    }
  }
  const unlikeProduct = async (id: string) => {
    try {
      setError("")
      // setLoading(true)
      const result = await unlikeProductService(id)
      setProducts((prevProducts) => {
        const updatedProducts = prevProducts.products.map((prod) => {
          if (prod._id === id) {
            prod.likes = result.likes
          }
          return prod
        })
        const newProd = { ...prevProducts, products: updatedProducts }
        return newProd
      })
      // setLoading(false)
      return result
    } catch (error) {
      handleError(error as string)
      // setLoading(false)
      return null
    }
  }

  const commentProduct = async (id: string, comment: string) => {
    try {
      setError("")
      // setLoading(true)
      const result = await commentProductService(id, comment)
      setProducts((prevProducts) => {
        const updatedProducts = prevProducts.products.map((prod) => {
          if (prod._id === id) {
            const comments = prod.comments ?? []
            prod.comments = [...comments, result.comment]
          }
          return prod
        })
        const newProd = { ...prevProducts, products: updatedProducts }
        return newProd
      })
      // setLoading(false)
      return result
    } catch (error) {
      handleError(error as string)
      // setLoading(false)
      return null
    }
  }

  const likeProductComment = async (id: string, commentId: string) => {
    try {
      setError("")
      // setLoading(true)
      const result = await likeProductCommentService(id, commentId)
      setProducts((prevProducts) => {
        const updatedProducts = prevProducts.products.map((prod) => {
          if (prod._id === id) {
            const comments = prod.comments ?? []
            prod.comments = [...comments, result.comment]
          }
          return prod
        })
        const newProd = { ...prevProducts, products: updatedProducts }
        return newProd
      })
      // setLoading(false)
      return result
    } catch (error) {
      handleError(error as string)
      // setLoading(false)
      return null
    }
  }

  const unlikeProductComment = async (id: string, commentId: string) => {
    try {
      setError("")
      // setLoading(true)
      const result = await unlikeProductCommentService(id, commentId)
      setProducts((prevProducts) => {
        const updatedProducts = prevProducts.products.map((prod) => {
          if (prod._id === id) {
            const comments = prod.comments ?? []
            prod.comments = [...comments, result.comment]
          }
          return prod
        })
        const newProd = { ...prevProducts, products: updatedProducts }
        return newProd
      })
      // setLoading(false)
      return result
    } catch (error) {
      handleError(error as string)
      // setLoading(false)
      return null
    }
  }

  const replyProductComment = async (
    id: string,
    commentId: string,
    comment: string
  ) => {
    try {
      setError("")
      // setLoading(true)
      const result = await replyProductCommentService(id, commentId, comment)
      setProducts((prevProducts) => {
        const updatedProducts = prevProducts.products.map((prod) => {
          if (prod._id === id) {
            const comments = prod.comments ?? []
            prod.comments = [...comments, result.comment]
          }
          return prod
        })
        const newProd = { ...prevProducts, products: updatedProducts }
        return newProd
      })
      // setLoading(false)
      return result
    } catch (error) {
      handleError(error as string)
      // setLoading(false)
      return null
    }
  }

  const likeProductCommentReply = async (
    id: string,
    commentId: string,
    replyId: string
  ) => {
    try {
      setError("")
      // setLoading(true)
      const result = await likeProductCommentReplyService(
        id,
        commentId,
        replyId
      )
      setProducts((prevProducts) => {
        const updatedProducts = prevProducts.products.map((prod) => {
          if (prod._id === id) {
            const comments = prod.comments ?? []
            if (comments.length > 0) {
              const newComment = comments.map((comm) => {
                if (comm._id === commentId) {
                  comm.replies = comm.replies.map((rep) =>
                    rep._id == replyId ? result.reply : rep
                  )
                }

                return comm
              })
              prod.comments = newComment
            }
          }
          return prod
        })
        const newProd = { ...prevProducts, products: updatedProducts }
        return newProd
      })
      // setLoading(false)
      return result
    } catch (error) {
      handleError(error as string)
      // setLoading(false)
      return null
    }
  }

  const unlikeProductCommentReply = async (
    id: string,
    commentId: string,
    replyId: string
  ) => {
    try {
      setError("")
      // setLoading(true)
      const result = await unlikeProductCommentReplyService(
        id,
        commentId,
        replyId
      )
      setProducts((prevProducts) => {
        const updatedProducts = prevProducts.products.map((prod) => {
          if (prod._id === id) {
            const comments = prod.comments ?? []
            if (comments.length > 0) {
              const newComment = comments.map((comm) => {
                if (comm._id === commentId) {
                  comm.replies = comm.replies.map((rep) =>
                    rep._id == replyId ? result.reply : rep
                  )
                }

                return comm
              })
              prod.comments = newComment
            }
          }
          return prod
        })
        const newProd = { ...prevProducts, products: updatedProducts }
        return newProd
      })
      // setLoading(false)
      return result
    } catch (error) {
      handleError(error as string)
      // setLoading(false)
      return null
    }
  }

  const createProductReview = async (
    id: string,
    review: {
      comment: string
      rating: number
      like: boolean
    }
  ) => {
    try {
      setError("")
      // setLoading(true)
      const result = await createProductReviewService(id, review)
      setProducts((prevProducts) => {
        const updatedProducts = prevProducts.products.map((prod) => {
          if (prod._id === id) {
            const reviews = prod.reviews ?? []
            prod.reviews = [...reviews, result.review]
          }
          return prod
        })
        const newProd = { ...prevProducts, products: updatedProducts }
        return newProd
      })
      // setLoading(false)
      return result
    } catch (error) {
      handleError(error as string)
      // setLoading(false)
      return null
    }
  }

  return (
    <ProductContext.Provider
      value={{
        fetchProducts,
        fetchUserProducts,
        products,
        loading,
        error,
        createProduct,
        deleteProduct,
        fetchProductBySlug,
        fetchProductById,
        updateProduct,
        commentProduct,
        createProductReview,
        likeProduct,
        likeProductComment,
        likeProductCommentReply,
        replyProductComment,
        unlikeProduct,
        unlikeProductComment,
        unlikeProductCommentReply,
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}

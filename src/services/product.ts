import {
  IComment,
  ICommentReply,
  ICreateProduct,
  IProduct,
  IReview,
  ProductWithPagination,
} from "../types/product"
import { getBackendErrorMessage } from "../utils/error"
import api from "./api"

export const fetchProductsService = async (
  params?: string
): Promise<ProductWithPagination> => {
  try {
    let url = "/products"

    if (params && params.length) {
      url = url + `?${params}`
    }

    const resp: { data: ProductWithPagination; status: boolean } =
      await api.get(url)

    if (!resp.status) {
      // Handle Fetch products error, e.g., display an error message to the user
      throw new Error("Fetch products failed: " + getBackendErrorMessage(resp))
    }

    return resp.data
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Fetch products error:", getBackendErrorMessage(error))

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error)
  }
}

export const fetchUserProductsService = async (
  params?: string
): Promise<ProductWithPagination> => {
  try {
    let url = "/products/user"

    if (params && params.length) {
      url = url + `?${params}`
    }

    const resp: { data: ProductWithPagination; status: boolean } =
      await api.get(url)

    if (!resp.status) {
      // Handle Fetch products error, e.g., display an error message to the user
      throw new Error("Fetch products failed: " + getBackendErrorMessage(resp))
    }

    return resp.data
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Fetch products error:", getBackendErrorMessage(error))

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error)
  }
}

export const createProductService = async (
  product: ICreateProduct
): Promise<IProduct> => {
  try {
    const data: {
      status: boolean
      product: IProduct
    } = await api.post("/products", product)

    if (!data.status) {
      // Handle Create product error, e.g., display an error message to the user
      throw new Error("Create product failed: " + getBackendErrorMessage(data))
    }

    return data.product
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Create product error:", getBackendErrorMessage(error))

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error)
  }
}

export const fetchProductBySlugService = async (
  slug: string
): Promise<IProduct> => {
  try {
    const data: {
      status: boolean
      product: IProduct
    } = await api.get(`/products/${slug}`)

    if (!data.status) {
      // Handle Fetch product error, e.g., display an error message to the user
      throw new Error("Fetch product failed: " + getBackendErrorMessage(data))
    }

    return data.product
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Fetch product error:", getBackendErrorMessage(error))

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error)
  }
}

export const fetchProductByIdService = async (
  id: string
): Promise<IProduct> => {
  try {
    const data: {
      status: boolean
      product: IProduct
    } = await api.get(`/products/product/${id}`)

    if (!data.status) {
      // Handle Fetch product error, e.g., display an error message to the user
      throw new Error("Fetch product failed: " + getBackendErrorMessage(data))
    }

    return data.product
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Fetch product error:", getBackendErrorMessage(error))

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error)
  }
}

export const updateProductService = async (
  id: string,
  product: ICreateProduct
): Promise<IProduct> => {
  try {
    const data: {
      status: boolean
      product: IProduct
    } = await api.put(`/products/${id}`, product)

    if (!data.status) {
      // Handle Update product error, e.g., display an error message to the user
      throw new Error("Update product failed: " + getBackendErrorMessage(data))
    }

    return data.product
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Update product error:", getBackendErrorMessage(error))

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error)
  }
}

export const deleteProductService = async (
  id: string
): Promise<{ status: boolean; message: string }> => {
  try {
    const data: { message: string; status: boolean } = await api.delete(
      `/products/${id}`
    )

    if (!data.status) {
      // Handle Delete product error, e.g., display an error message to the user
      throw new Error("Delete product failed: " + getBackendErrorMessage(data))
    }

    return { status: true, message: data.message }
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Delete product error:", getBackendErrorMessage(error))

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error)
  }
}

export const likeProductService = async (id: string) => {
  try {
    const data: { message: string; likes: string[] } = await api.post(
      `/products/${id}/like`
    )

    // if (!data.status) {
    //   // Handle Like product error, e.g., display an error message to the user
    //   throw new Error("Like product failed: " + getBackendErrorMessage(data))
    // }

    return data
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Like product error:", getBackendErrorMessage(error))

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error)
  }
}

export const unlikeProductService = async (id: string) => {
  try {
    const data: { message: string; likes: string[] } = await api.post(
      `/products/${id}/unlike`
    )

    // if (!data.status) {
    //   // Handle Unlike product error, e.g., display an error message to the user
    //   throw new Error("Unlike product failed: " + getBackendErrorMessage(data))
    // }

    return data
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Unlike product error:", getBackendErrorMessage(error))

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error)
  }
}

export const commentProductService = async (id: string, comment: string) => {
  try {
    const data: { comment: IComment } = await api.post(
      `/products/${id}/comments`,
      { comment }
    )

    // if (!data.status) {
    //   // Handle comment product error, e.g., display an error message to the user
    //   throw new Error("comment product failed: " + getBackendErrorMessage(data))
    // }

    return data
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Unlike product error:", getBackendErrorMessage(error))

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error)
  }
}

export const likeProductCommentService = async (
  id: string,
  commentId: string
) => {
  try {
    const data: { message: string; comment: IComment } = await api.post(
      `/products/${id}/comments/${commentId}/like`
    )

    // if (!data.status) {
    //   // Handle Like product error, e.g., display an error message to the user
    //   throw new Error("Like product failed: " + getBackendErrorMessage(data))
    // }

    return data
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Like product error:", getBackendErrorMessage(error))

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error)
  }
}

export const unlikeProductCommentService = async (
  id: string,
  commentId: string
) => {
  try {
    const data: { message: string; comment: IComment } = await api.post(
      `/products/${id}/comments/${commentId}/unlike`
    )

    // if (!data.status) {
    //   // Handle Unlike product error, e.g., display an error message to the user
    //   throw new Error("Unlike product failed: " + getBackendErrorMessage(data))
    // }

    return data
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Unlike product error:", getBackendErrorMessage(error))

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error)
  }
}

export const replyProductCommentService = async (
  id: string,
  commentId: string,
  comment: string
) => {
  try {
    const data: { message: string; comment: IComment } = await api.post(
      `/products/${id}/comments/${commentId}/unlike`,
      { comment }
    )

    // if (!data.status) {
    //   // Handle reply comment product error, e.g., display an error message to the user
    //   throw new Error("reply comment product failed: " + getBackendErrorMessage(data))
    // }

    return data
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("reply comment product error:", getBackendErrorMessage(error))

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error)
  }
}

export const likeProductCommentReplyService = async (
  id: string,
  commentId: string,
  replyId: string
) => {
  try {
    const data: { message: string; reply: ICommentReply } = await api.post(
      `/products/${id}/comments/${commentId}/replies/${replyId}/like`
    )

    // if (!data.status) {
    //   // Handle Like product comment error, e.g., display an error message to the user
    //   throw new Error("Like product comment failed: " + getBackendErrorMessage(data))
    // }

    return data
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Like product comment error:", getBackendErrorMessage(error))

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error)
  }
}

export const unlikeProductCommentReplyService = async (
  id: string,
  commentId: string,
  replyId: string
) => {
  try {
    const data: { message: string; reply: ICommentReply } = await api.post(
      `/products/${id}/comments/${commentId}/replies/${replyId}/like`
    )

    // if (!data.status) {
    //   // Handle Unlike product comment error, e.g., display an error message to the user
    //   throw new Error("Unlike product comment failed: " + getBackendErrorMessage(data))
    // }

    return data
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error(
      "Unlike product comment error:",
      getBackendErrorMessage(error)
    )

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error)
  }
}

export const createProductReviewService = async (
  id: string,
  review: { comment: string; rating: number; like: boolean }
) => {
  try {
    const data: { message: string; review: IReview } = await api.post(
      `/products/${id}/reviews`,
      review
    )

    // if (!data.status) {
    //   // Handle Create review product error, e.g., display an error message to the user
    //   throw new Error(
    //     "Create review product failed: " + getBackendErrorMessage(data)
    //   )
    // }

    return data
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Create review product error:", getBackendErrorMessage(error))

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error)
  }
}

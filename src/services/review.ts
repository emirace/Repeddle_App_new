import { IReview, ReviewWithPagination } from "../types/product"
import { getBackendErrorMessage } from "../utils/error"
import api from "./api"

export const fetchUserReviewsService = async (
  params?: string
): Promise<ReviewWithPagination> => {
  try {
    let url = "/reviews/user"

    if (params && params.length) {
      url = url + `?${params}`
    }

    const resp: { data: ReviewWithPagination; status: boolean } = await api.get(
      url
    )

    if (!resp.status) {
      // Handle Fetch products error, e.g., display an error message to the user
      throw new Error("Fetch reviews failed: " + getBackendErrorMessage(resp))
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

export const createProductReviewService = async (
  id: string,
  review: { comment: string; rating: number; like: boolean }
): Promise<{ message: string; review: IReview }> => {
  try {
    const data: {
      status: boolean
      message: string
      review: IReview
    } = await api.post(`/products/${id}/reviews`, review)

    if (!data.status) {
      // Handle Create product error, e.g., display an error message to the user
      throw new Error(
        "Create product review failed: " + getBackendErrorMessage(data)
      )
    }

    return data
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Create product review error:", getBackendErrorMessage(error))

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error)
  }
}

export const createUserReviewService = async (
  id: string,
  review: { comment: string; rating: number; like: boolean }
): Promise<{ message: string; review: IReview }> => {
  try {
    const data: {
      status: boolean
      message: string
      review: IReview
    } = await api.post(`/users/${id}/reviews`, review)

    // if (!data.status) {
    //   // Handle Fetch product error, e.g., display an error message to the user
    //   throw new Error("Fetch product failed: " + getBackendErrorMessage(data))
    // }

    return data
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Fetch product error:", getBackendErrorMessage(error))

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error)
  }
}

export const editProductReviewService = async (
  id: string,
  review: { comment: string; rating: number; like: boolean; _id: string }
): Promise<{ message: string; review: IReview }> => {
  try {
    const data: {
      status: boolean
      message: string
      review: IReview
    } = await api.put(`/reviews/${id}`, review)

    if (!data.status) {
      // Handle Fetch product error, e.g., display an error message to the user
      throw new Error(
        "Edit product review failed: " + getBackendErrorMessage(data)
      )
    }

    return data
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Edit product review error:", getBackendErrorMessage(error))

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error)
  }
}

export const deleteProductReviewService = async (
  id: string
): Promise<{ message: string }> => {
  try {
    const data: { message: string } = await api.delete(`/reviews/${id}`)

    return { message: data.message }
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Edit product review error:", getBackendErrorMessage(error))

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error)
  }
}

export const editUserReviewService = async (
  id: string,
  review: { comment: string; rating: number; like: boolean; _id: string }
): Promise<{ message: string; review: IReview }> => {
  try {
    const data: {
      status: boolean
      message: string
      review: IReview
    } = await api.put(`/reviews/${id}`, review)

    // if (!data.status) {
    //   // Handle Fetch product error, e.g., display an error message to the user
    //   throw new Error("Fetch product failed: " + getBackendErrorMessage(data))
    // }

    return data
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Edit user review error:", getBackendErrorMessage(error))

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error)
  }
}

export const deleteUserReviewService = async (
  id: string
): Promise<{ message: string }> => {
  try {
    const data: {
      message: string
    } = await api.delete(`/reviews/${id}`)

    // if (!data.status) {
    //   // Handle Update product error, e.g., display an error message to the user
    //   throw new Error("Update product failed: " + getBackendErrorMessage(data))
    // }

    return data
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Delete user review error:", getBackendErrorMessage(error))

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error)
  }
}

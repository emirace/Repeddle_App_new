import {
  ICreateProduct,
  IProduct,
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

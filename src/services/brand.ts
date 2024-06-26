import { IBrand, ICreateBrand } from "../types/product"
import { getBackendErrorMessage } from "../utils/error"
import api from "./api"

export const fetchBrandsService = async (
  params?: string
): Promise<IBrand[]> => {
  try {
    let url = "/brands"

    if (params && params.length) {
      url = url + `?${params}`
    }

    const resp: { brands: IBrand[]; status: boolean } = await api.get(url)

    if (!resp.status) {
      // Handle Fetch brands error, e.g., display an error message to the user
      throw new Error("Fetch brands failed: " + getBackendErrorMessage(resp))
    }

    return resp.brands
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Fetch brands error:", getBackendErrorMessage(error))

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error)
  }
}

export const fetchAdminBrandsService = async (
  params?: string
): Promise<IBrand[]> => {
  try {
    let url = "/brands/admin"

    if (params && params.length) {
      url = url + `?${params}`
    }

    const resp: { brands: IBrand[]; status: boolean } = await api.get(url)

    if (!resp.status) {
      // Handle Fetch brands error, e.g., display an error message to the user
      throw new Error("Fetch brands failed: " + getBackendErrorMessage(resp))
    }

    return resp.brands
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Fetch brands error:", getBackendErrorMessage(error))

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error)
  }
}

export const createBrandService = async (
  brand: ICreateBrand
): Promise<IBrand> => {
  try {
    const data: {
      status: boolean
      brand: IBrand
    } = await api.post("/brands", brand)

    if (!data.status) {
      // Handle Create brand error, e.g., display an error message to the user
      throw new Error("Create brand failed: " + getBackendErrorMessage(data))
    }

    return data.brand
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Create brand error:", getBackendErrorMessage(error))

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error)
  }
}

export const updateBrandService = async (
  id: string,
  brand: ICreateBrand
): Promise<IBrand> => {
  try {
    const data: {
      status: boolean
      brand: IBrand
    } = await api.put(`/brands/${id}`, brand)

    if (!data.status) {
      // Handle Update brand error, e.g., display an error message to the user
      throw new Error("Update brand failed: " + getBackendErrorMessage(data))
    }

    return data.brand
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Update brand error:", getBackendErrorMessage(error))

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error)
  }
}

export const deleteBrandService = async (
  id: string
): Promise<{ status: boolean; message: string }> => {
  try {
    const data: { message: string; status: boolean } = await api.delete(
      `/brands/${id}`
    )

    if (!data.status) {
      // Handle Delete brand error, e.g., display an error message to the user
      throw new Error("Delete brand failed: " + getBackendErrorMessage(data))
    }

    return { status: true, message: data.message }
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Delete brand error:", getBackendErrorMessage(error))

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error)
  }
}

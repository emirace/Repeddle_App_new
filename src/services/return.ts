import { CreateReturn, IDeliveryMeta, IReturn } from "../types/order"
import { getBackendErrorMessage } from "../utils/error"
import api from "./api"

export const fetchPurchaseReturnService = async (search?: string) => {
  try {
    let url = "/returns/purchase"

    if (search) url = `${url}?${search}`

    const resp: {
      returns: IReturn[]
      status: boolean
      totalPages: number
      currentPage: number
      total: number
    } = await api.get(url)

    if (!resp.status) {
      // Handle Fetch return error, e.g., display an error message to the user
      throw new Error("Fetch return failed: " + getBackendErrorMessage(resp))
    }

    return resp
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Fetch return error:", getBackendErrorMessage(error))

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error)
  }
}

export const fetchSoldReturnService = async (search?: string) => {
  try {
    let url = "/returns/sold"

    if (search) url = `${url}?${search}`

    const resp: {
      returns: IReturn[]
      status: boolean
      totalPages: number
      currentPage: number
      total: number
    } = await api.get(url)

    if (!resp.status) {
      // Handle Fetch return error, e.g., display an error message to the user
      throw new Error("Fetch return failed: " + getBackendErrorMessage(resp))
    }

    return resp
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Fetch return error:", getBackendErrorMessage(error))

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error)
  }
}

export const fetchAdminReturnService = async (search?: string) => {
  try {
    let url = "/returns/admin"

    if (search) url = url + `?${search}`

    const resp: {
      returns: IReturn[]
      totalPages: number
      currentPage: number
      total: number
      status: boolean
    } = await api.get(url)

    if (!resp.status) {
      // Handle Fetch return error, e.g., display an error message to the user
      throw new Error("Fetch return failed: " + getBackendErrorMessage(resp))
    }

    return resp
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Fetch return error:", getBackendErrorMessage(error))

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error)
  }
}

export const fetchReturnByIdService = async (id: string) => {
  try {
    const url = `/returns/${id}`

    const resp: {
      return: IReturn
      status: boolean
    } = await api.get(url)

    if (!resp.status) {
      // Handle Fetch return error, e.g., display an error message to the user
      throw new Error("Fetch return failed: " + getBackendErrorMessage(resp))
    }

    return resp.return
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Fetch return error:", getBackendErrorMessage(error))

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error)
  }
}

export const createReturnService = async (body: CreateReturn) => {
  try {
    const resp: { return: IReturn; status: boolean } = await api.post(
      `/returns`,
      body
    )

    if (!resp.status) {
      // Handle Fetch return error, e.g., display an error message to the user
      throw new Error("Fetch return failed: " + getBackendErrorMessage(resp))
    }

    return resp.return
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Fetch return error:", getBackendErrorMessage(error))

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error)
  }
}

export const updateReturnStatusAdminService = async (
  id: string,
  body: { status: string; adminReason: string }
) => {
  const url = `/returns/${id}/status`

  try {
    const data: { return: IReturn; status: boolean } = await api.put(url, body)

    if (!data.status) {
      // Handle Get update return error, e.g., display an error message to the user
      throw new Error(
        "Get update return failed: " + getBackendErrorMessage(data)
      )
    }

    return data.return
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Get update return error:", getBackendErrorMessage(error))

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error)
  }
}

export const updateReturnStatusService = async (
  id: string,
  body: { status: string; trackingNumber?: string }
) => {
  const url = `/returns/${id}/delivery-tracking`

  try {
    const data: { return: IReturn; status: boolean } = await api.put(url, body)

    if (!data.status) {
      // Handle Get update return error, e.g., display an error message to the user
      throw new Error(
        "Get update return failed: " + getBackendErrorMessage(data)
      )
    }

    return data.return
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Get update return error:", getBackendErrorMessage(error))

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error)
  }
}

export const updateReturnAddressService = async (
  id: string,
  body: { method: string; fee: number; meta?: IDeliveryMeta }
) => {
  const url = `/returns/${id}/address`

  try {
    const data: { return: IReturn; status: boolean } = await api.put(url, body)

    if (!data.status) {
      // Handle Get update return error, e.g., display an error message to the user
      throw new Error(
        "Get update return failed: " + getBackendErrorMessage(data)
      )
    }

    return data.return
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Get update return error:", getBackendErrorMessage(error))

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error)
  }
}

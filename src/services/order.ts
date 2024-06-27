import { ICreateOrder, IOrder, IOrderSummary } from "../types/order"
import { getBackendErrorMessage } from "../utils/error"
import api from "./api"

export const fetchOrdersService = async (): Promise<IOrder[]> => {
  try {
    const url = "/orders"

    const resp: { orders: IOrder[]; status: boolean } = await api.get(url)

    if (!resp.status) {
      // Handle Fetch orders error, e.g., display an error message to the user
      throw new Error("Fetch orders failed: " + getBackendErrorMessage(resp))
    }

    return resp.orders
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Fetch orders error:", getBackendErrorMessage(error))

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error)
  }
}

export const fetchOrderByIdService = async (id: string): Promise<IOrder> => {
  try {
    const url = `/orders/${id}`

    const resp: { order: IOrder; status: boolean } = await api.get(url)

    if (!resp.status) {
      // Handle Fetch orders error, e.g., display an error message to the user
      throw new Error("Fetch orders failed: " + getBackendErrorMessage(resp))
    }

    return resp.order
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Fetch orders error:", getBackendErrorMessage(error))

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error)
  }
}

export const createOrderService = async (
  order: ICreateOrder
): Promise<{ order: IOrder; message: string }> => {
  try {
    const data: {
      status: boolean
      order: IOrder
      message: string
    } = await api.post("/orders", order)

    if (!data.status) {
      // Handle Create order error, e.g., display an error message to the user
      throw new Error("Create order failed: " + getBackendErrorMessage(data))
    }

    return { order: data.order, message: data.message }
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Create order error:", getBackendErrorMessage(error))

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error)
  }
}

export const fetchSoldOrdersService = async (): Promise<IOrder[]> => {
  try {
    const data: {
      status: boolean
      orders: IOrder[]
      message: string
    } = await api.get(`/orders/sold`)

    if (!data.status) {
      // Handle Fetch order error, e.g., display an error message to the user
      throw new Error("Fetch order failed: " + getBackendErrorMessage(data))
    }

    return data.orders
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Fetch order error:", getBackendErrorMessage(error))

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error)
  }
}

export const updateOrderItemTrackingService = async (
  orderId: string,
  itemId: string,
  body: { status: string; trackingNumber?: string }
): Promise<IOrder> => {
  try {
    const data: {
      status: boolean
      order: IOrder
    } = await api.put(
      `/orders/${orderId}/items/${itemId}/delivery-tracking`,
      body
    )

    if (!data.status) {
      // Handle Update order error, e.g., display an error message to the user
      throw new Error("Update order failed: " + getBackendErrorMessage(data))
    }

    return data.order
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Update order error:", getBackendErrorMessage(error))

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error)
  }
}

export const getOrdersSummaryService = async (
  params?: string
): Promise<IOrderSummary> => {
  let url = "/orders/summary"

  if (params) {
    url = url + `?${params}`
  }

  try {
    const data: { data: IOrderSummary; status: boolean } = await api.get(url)

    if (!data.status) {
      // Handle Get Order Summary error, e.g., display an error message to the user
      throw new Error(
        "Get Order Summary failed: " + getBackendErrorMessage(data)
      )
    }

    return data.data
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Get Order Summary error:", getBackendErrorMessage(error))

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error)
  }
}

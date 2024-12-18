import { Payments, PaymentWithPagination } from "../types/payments"
import { getBackendErrorMessage } from "../utils/error"
import api from "./api"

export const fetchPaymentsService = async (params?: string) => {
  try {
    let url = "/payments"

    if (params && params.length) {
      url = url + `?${params}`
    }

    const resp: PaymentWithPagination & { status: boolean } = await api.get(url)

    if (!resp.status) {
      // Handle Fetch payments error, e.g., display an error message to the user
      throw new Error("Fetch payments failed: " + getBackendErrorMessage(resp))
    }

    return resp
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Fetch payments error:", getBackendErrorMessage(error))

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error)
  }
}

export const fetchPaymentByIdService = async (id: string) => {
  try {
    const resp: Payments = await api.get(`/payments/${id}`)

    // if (!resp.status) {
    //   // Handle Fetch payments error, e.g., display an error message to the user
    //   throw new Error("Fetch payments failed: " + getBackendErrorMessage(resp))
    // }

    return resp
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Fetch payments error:", getBackendErrorMessage(error))

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error)
  }
}

export const paySellerService = async (
  orderId: string,
  itemId: string,
  userId: string
) => {
  try {
    const resp: { message: string; status: boolean; payment: Payments } =
      await api.post(`/payments/pay-seller/${orderId}/${itemId}`, { userId })

    if (!resp.status) {
      // Handle Fetch payments error, e.g., display an error message to the user
      throw new Error("pay seller failed: " + getBackendErrorMessage(resp))
    }

    return resp
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("pay seller error:", getBackendErrorMessage(error))

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error)
  }
}

export const refundBuyerService = async (
  orderId: string,
  itemId: string,
  userId: string
) => {
  try {
    const resp: { message: string; status: boolean; payment: Payments } =
      await api.post(`/payments/refund-buyer/${orderId}/${itemId}`, { userId })

    if (!resp.status) {
      // Handle Fetch payments error, e.g., display an error message to the user
      throw new Error("refund buyer failed: " + getBackendErrorMessage(resp))
    }

    return resp
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("refund buyer error:", getBackendErrorMessage(error))

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error)
  }
}
export const approvePaymentWalletService = async (
  paymentId: string,
  userId: string
) => {
  try {
    const resp: { message: string; status: boolean; payment: Payments } =
      await api.post(`/products/approve/${paymentId}`, { userId })

    if (!resp.status) {
      // Handle Fetch payments error, e.g., display an error message to the user
      throw new Error("approve payment failed: " + getBackendErrorMessage(resp))
    }

    return resp
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("approve payment error:", getBackendErrorMessage(error))

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error)
  }
}
export const declinePaymentWalletService = async (
  paymentId: string,
  userId: string
) => {
  try {
    const resp: { message: string; status: boolean; payment: Payments } =
      await api.post(`/products/decline/${paymentId}`, { userId })

    if (!resp.status) {
      // Handle Fetch payments error, e.g., display an error message to the user
      throw new Error("decline payment failed: " + getBackendErrorMessage(resp))
    }

    return resp
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("decline payment error:", getBackendErrorMessage(error))

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error)
  }
}

import { ITransaction, TransactionPagination } from "./../types/transactions"
import { getBackendErrorMessage } from "../utils/error"
import api from "./api"

export const fetchTransactionsService = async (params?: string) => {
  try {
    let url = "/transactions"

    if (params && params.length) {
      url = url + `?${params}`
    }

    const resp: {
      transactions: ITransaction[]
      status: boolean
      pagination: TransactionPagination
    } = await api.get(url)

    if (!resp.status) {
      // Handle Fetch transactions error, e.g., display an error message to the user
      throw new Error(
        "Fetch transactions failed: " + getBackendErrorMessage(resp)
      )
    }

    return resp
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Fetch transactions error:", getBackendErrorMessage(error))

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error)
  }
}

export const fetchUserTransactionsService = async (params?: string) => {
  try {
    let url = "/transactions/user"

    if (params && params.length) {
      url = url + `?${params}`
    }

    const resp: {
      transactions: ITransaction[]
      status: boolean
      pagination: TransactionPagination
    } = await api.get(url)

    if (!resp.status) {
      // Handle Fetch transactions error, e.g., display an error message to the user
      throw new Error(
        "Fetch transactions failed: " + getBackendErrorMessage(resp)
      )
    }

    return resp
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Fetch transactions error:", getBackendErrorMessage(error))

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error)
  }
}

export const fetchTransactionByIdService = async (
  id: string
): Promise<ITransaction> => {
  try {
    const resp: { transaction: ITransaction; status: boolean } = await api.get(
      `/transactions/${id}`
    )

    if (!resp.status) {
      // Handle Fetch transactions error, e.g., display an error message to the user
      throw new Error(
        "Fetch transactions failed: " + getBackendErrorMessage(resp)
      )
    }

    return resp.transaction
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Fetch transactions error:", getBackendErrorMessage(error))

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error)
  }
}

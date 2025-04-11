import { IFund, IWallet } from "../types/transactions"
import { getBackendErrorMessage } from "../utils/error"
import api from "./api"

export const fetchWalletService = async (): Promise<IWallet> => {
  try {
    const resp: IWallet & { status: boolean } = await api.get(
      "/wallets/balance"
    )

    if (!resp.status) {
      // Handle Fetch wallets error, e.g., display an error message to the user
      throw new Error("Fetch wallets failed: " + getBackendErrorMessage(resp))
    }

    return resp
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Fetch wallets error:", getBackendErrorMessage(error))

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error)
  }
}

export const fundWalletFlutterService = async (
  data: IFund
): Promise<string> => {
  try {
    const resp: { message: string; status: boolean } = await api.post(
      "/wallets/fund",
      data
    )

    if (!resp.status) {
      // Handle Fetch wallets error, e.g., display an error message to the user
      throw new Error("Fetch wallets failed: " + getBackendErrorMessage(resp))
    }

    return resp.message
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Fetch wallets error:", getBackendErrorMessage(error))

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error)
  }
}

export const withdrawWalletFlutterService = async (
  amount: number
): Promise<string> => {
  try {
    const resp: { message: string; status: boolean } = await api.post(
      "/wallets/withdrawal",
      { amount }
    )

    if (!resp.status) {
      // Handle Fetch wallets error, e.g., display an error message to the user
      throw new Error(
        "Withdraw wallets failed: " + getBackendErrorMessage(resp)
      )
    }

    return resp.message
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Withdraw wallets error:", getBackendErrorMessage(error))

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error)
  }
}

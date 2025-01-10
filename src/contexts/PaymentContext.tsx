import { createContext, PropsWithChildren, useState } from "react"
import useAuth from "../hooks/useAuth"
import { Payments, PaymentWithPagination } from "../types/payments"
import {
  approvePaymentWalletService,
  declinePaymentWalletService,
  fetchPaymentByIdService,
  fetchPaymentsService,
  paySellerService,
  refundBuyerService,
} from "../services/payment"

type ContextType = {
  payments: PaymentWithPagination
  loading: boolean
  error: string
  fetchPayments: (params?: string) => Promise<boolean>
  fetchPaymentById: (id: string) => Promise<Payments | string>
  paySeller: (
    orderId: string,
    itemId: string,
    userId: string
  ) => Promise<
    | {
        message: string
        payment: Payments
      }
    | string
  >

  refundBuyer: (
    orderId: string,
    itemId: string,
    userId: string
  ) => Promise<
    | {
        message: string
        payment: Payments
      }
    | string
  >

  approvePaymentWallet: (
    paymentId: string,
    userId: string
  ) => Promise<
    | {
        message: string
        payment: Payments
      }
    | string
  >

  declinePaymentWallet: (
    paymentId: string,
    userId: string
  ) => Promise<
    | {
        message: string
        payment: Payments
      }
    | string
  >
}

// Create payment context
export const PaymentContext = createContext<ContextType | undefined>(undefined)

export const PaymentProvider = ({ children }: PropsWithChildren) => {
  const { setAuthErrorModalOpen } = useAuth()
  const [payments, setPayments] = useState<PaymentWithPagination>({
    pagination: { currentPage: 0, totalItems: 0, totalPages: 0 },
    payments: [],
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

  // Function to fetch payments
  const fetchPayments = async (params?: string) => {
    try {
      setError("")
      setLoading(true)
      const result = await fetchPaymentsService(params)
      setPayments(result)
      setLoading(false)
      return true
    } catch (error) {
      handleError(error as string)
      setLoading(false)
      return false
    }
  }

  // Function to fetch payment byId
  const fetchPaymentById = async (id: string) => {
    try {
      const result = await fetchPaymentByIdService(id)

      return result
    } catch (error) {
      return error as string
    }
  }

  const paySeller = async (orderId: string, itemId: string, userId: string) => {
    try {
      const result = await paySellerService(orderId, itemId, userId)

      return result
    } catch (error) {
      return error as string
    }
  }

  const refundBuyer = async (
    orderId: string,
    itemId: string,
    userId: string
  ) => {
    try {
      const result = await refundBuyerService(orderId, itemId, userId)

      return result
    } catch (error) {
      return error as string
    }
  }

  const approvePaymentWallet = async (paymentId: string, userId: string) => {
    try {
      const result = await approvePaymentWalletService(paymentId, userId)

      return result
    } catch (error) {
      return error as string
    }
  }

  const declinePaymentWallet = async (paymentId: string, userId: string) => {
    try {
      const result = await declinePaymentWalletService(paymentId, userId)

      return result
    } catch (error) {
      return error as string
    }
  }

  return (
    <PaymentContext.Provider
      value={{
        fetchPayments,
        paySeller,
        fetchPaymentById,
        refundBuyer,
        payments,
        loading,
        error,
        approvePaymentWallet,
        declinePaymentWallet,
      }}
    >
      {children}
    </PaymentContext.Provider>
  )
}

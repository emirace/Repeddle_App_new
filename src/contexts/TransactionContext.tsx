import { createContext, PropsWithChildren, useState } from "react"
import useAuth from "../hooks/useAuth"
import { ITransaction } from "../types/transactions"
import {
  fetchTransactionByIdService,
  fetchTransactionsService,
  fetchUserTransactionsService,
} from "../services/transaction"

type ContextType = {
  transactions: ITransaction[]
  loading: boolean
  error: string
  fetchTransactions: (params?: string) => Promise<boolean>
  fetchUserTransactions: (params?: string) => Promise<boolean>
  fetchTransactionById: (id: string) => Promise<ITransaction | string>
}

// Create transaction context
export const TransactionContext = createContext<ContextType | undefined>(
  undefined
)

export const TransactionProvider = ({ children }: PropsWithChildren) => {
  const { setAuthErrorModalOpen } = useAuth()
  const [transactions, setTransactions] = useState<ITransaction[]>([])
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

  // Function to fetch transactions
  const fetchTransactions = async (params?: string) => {
    try {
      setError("")
      setLoading(true)
      const result = await fetchTransactionsService(params)
      setTransactions(result)
      setLoading(false)
      return true
    } catch (error) {
      handleError(error as string)
      setLoading(false)
      return false
    }
  }

  // Function to fetch transactions
  const fetchUserTransactions = async (val?: string) => {
    try {
      setError("")
      setLoading(true)
      const result = await fetchUserTransactionsService(val)
      setTransactions(result)
      setLoading(false)
      return true
    } catch (error) {
      handleError(error as string)
      setLoading(false)
      return false
    }
  }

  // Function to fetch transaction byId
  const fetchTransactionById = async (id: string) => {
    try {
      const result = await fetchTransactionByIdService(id)

      return result
    } catch (error) {
      return error as string
    }
  }

  return (
    <TransactionContext.Provider
      value={{
        fetchTransactions,
        fetchUserTransactions,
        fetchTransactionById,
        transactions,
        loading,
        error,
      }}
    >
      {children}
    </TransactionContext.Provider>
  )
}

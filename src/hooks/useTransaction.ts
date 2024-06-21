import { useContext } from "react"
import { TransactionContext } from "../contexts/TransactionContext"

const useTransactions = () => {
  const context = useContext(TransactionContext)

  if (!context)
    throw new Error("useTransactions must be used within a category context")

  return context
}

export default useTransactions

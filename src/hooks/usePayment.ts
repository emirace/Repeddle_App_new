import { useContext } from "react"
import { PaymentContext } from "../contexts/PaymentContext"

const usePayments = () => {
  const context = useContext(PaymentContext)

  if (!context)
    throw new Error("usePayments must be used within a category context")

  return context
}

export default usePayments

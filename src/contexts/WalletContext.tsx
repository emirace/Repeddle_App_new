import { createContext, PropsWithChildren, useState } from "react"
import useAuth from "../hooks/useAuth"
import { IFund, IWallet } from "../types/transactions"
import { currency, region } from "../utils/common"
import {
  fetchWalletService,
  fundWalletFlutterService,
  withdrawWalletFlutterService,
} from "../services/wallet"

type ContextType = {
  wallet: IWallet
  loading: boolean
  error: string
  fetchWallet: () => Promise<boolean>
  fundWalletFlutter: (data: IFund) => Promise<{
    error: boolean
    result: string
  }>
  withdrawWalletFlutter: (amount: number) => Promise<{
    error: boolean
    result: string
  }>
}

// Create wallet context
export const WalletContext = createContext<ContextType | undefined>(undefined)

export const WalletProvider = ({ children }: PropsWithChildren) => {
  const { setAuthErrorModalOpen } = useAuth()
  const [wallet, setWallet] = useState<IWallet>({
    balance: 0,
    currency: currency(region()) == "₦" ? "NGN" : "ZAR",
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

  // Function to fetch wallets
  const fetchWallet = async () => {
    try {
      setError("")
      setLoading(true)
      const result = await fetchWalletService()
      setWallet(result)
      setLoading(false)
      return true
    } catch (error) {
      handleError(error as string)
      setLoading(false)
      return false
    }
  }

  const fundWalletFlutter = async (data: IFund) => {
    try {
      const result = await fundWalletFlutterService(data)

      await fetchWallet()

      return { error: false, result }
    } catch (error) {
      return { error: true, result: error as string }
    }
  }

  const withdrawWalletFlutter = async (amount: number) => {
    try {
      const result = await withdrawWalletFlutterService(amount)

      await fetchWallet()

      return { error: false, result }
    } catch (error) {
      return { error: true, result: error as string }
    }
  }

  return (
    <WalletContext.Provider
      value={{
        fetchWallet,
        fundWalletFlutter,
        withdrawWalletFlutter,
        wallet,
        loading,
        error,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

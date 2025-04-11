import { useContext } from "react"
import { WalletContext } from "../contexts/WalletContext"

const useWallet = () => {
  const context = useContext(WalletContext)

  if (!context)
    throw new Error("useWallet must be used within a category context")

  return context
}

export default useWallet

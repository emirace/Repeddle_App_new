import { createContext, PropsWithChildren, useState } from "react"
import useAuth from "../hooks/useAuth"
import { CreateReturn, IReturn } from "../types/order"
import {
  createReturnService,
  fetchReturnByIdService,
  fetchReturnService,
  updateReturnStatusAdminService,
} from "../services/return"

type ContextType = {
  returns: IReturn[]
  loading: boolean
  error: string
  fetchReturns: () => Promise<boolean>
  createReturns: (body: CreateReturn) => Promise<IReturn | null>
  fetchReturnById: (id: string) => Promise<IReturn | null>
  updateReturnStatusAdmin: (
    id: string,
    body: { status: string; adminReason: string }
  ) => Promise<IReturn | null>
}

// Create return context
export const ReturnContext = createContext<ContextType | undefined>(undefined)

export const ReturnProvider = ({ children }: PropsWithChildren) => {
  const { setAuthErrorModalOpen } = useAuth()
  const [returns, setReturns] = useState<IReturn[]>([])
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

  // Function to fetch returns
  const fetchReturns = async () => {
    try {
      setError("")
      setLoading(true)
      const result = await fetchReturnService()
      setReturns(result)
      setLoading(false)
      return true
    } catch (error) {
      handleError(error as string)
      setLoading(false)
      return false
    }
  }

  // Function to create returns
  const createReturns = async (body: CreateReturn) => {
    try {
      setError("")
      setLoading(true)
      const result = await createReturnService(body)
      setReturns((prev) => [result, ...prev])

      setLoading(false)
      return result
    } catch (error) {
      handleError(error as string)
      setLoading(false)
      return null
    }
  }

  // Function to fetch return byId
  const fetchReturnById = async (id: string) => {
    try {
      const result = await fetchReturnByIdService(id)

      return result
    } catch (error) {
      handleError(error)
      return null
    }
  }

  const updateReturnStatusAdmin = async (
    id: string,
    body: { status: string; adminReason: string }
  ) => {
    try {
      const result = await updateReturnStatusAdminService(id, body)

      return result
    } catch (error) {
      handleError(error)
      return null
    }
  }

  return (
    <ReturnContext.Provider
      value={{
        fetchReturns,
        createReturns,
        fetchReturnById,
        returns,
        loading,
        error,
        updateReturnStatusAdmin,
      }}
    >
      {children}
    </ReturnContext.Provider>
  )
}

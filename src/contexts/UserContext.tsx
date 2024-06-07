import { createContext, PropsWithChildren, useState } from "react"

import {
  IUsersWithPagination,
  IUser,
  TopSellers,
  UpdateUser,
  UserByUsername,
} from "../types/user"
import {
  getAllUserAdminService,
  getTopSellersService,
  getUserByIdService,
  getUserByUsernameService,
  updateUserByIdService,
} from "../services/user"

type ContextType = {
  error: string | null
  loading: boolean
  getAllUserAdmin: () => Promise<IUsersWithPagination | null>
  getTopSellers: () => Promise<TopSellers[] | string>
  getUserByUsername: (username: string) => Promise<UserByUsername | string>
  getUserById: (userId: string) => Promise<IUser | null>
  updateUserById: (
    userId: string,
    userData: UpdateUser
  ) => Promise<IUser | string>
}

// Create user context
export const UserContext = createContext<ContextType | undefined>(undefined)

export const UserProvider = ({ children }: PropsWithChildren) => {
  // const { setAuthErrorModalOpen } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleError = (error: any) => {
    setLoading(false)

    // Check if the error indicates an invalid or expired token
    if (error === "Token expired" || error === "Invalid token") {
      setError("")
      // Set the state to open the auth error modal
      // setAuthErrorModalOpen(true)
    } else {
      setError(error || "An error occurred.")
    }
  }

  const getAllUserAdmin = async () => {
    try {
      setError("")
      setLoading(true)
      const result = await getAllUserAdminService()

      setLoading(false)
      return result
    } catch (error) {
      handleError(error as string)
      setLoading(false)
      return null
    }
  }

  const getTopSellers = async () => {
    try {
      setError("")
      setLoading(true)
      const result = await getTopSellersService()
      setLoading(false)
      return result
    } catch (error) {
      handleError(error as string)
      setLoading(false)
      return error as string
    }
  }

  const getUserByUsername = async (username: string) => {
    try {
      setError("")
      setLoading(true)
      const result = await getUserByUsernameService(username)

      setLoading(false)
      return result
    } catch (error) {
      handleError(error as string)
      setLoading(false)
      return error as string
    }
  }

  const updateUserById = async (id: string, userData: UpdateUser) => {
    try {
      setError("")
      const updatedUser = await updateUserByIdService(id, userData)

      return updatedUser
    } catch (error) {
      handleError(error)
      return error as string
    }
  }

  const getUserById = async (id: string) => {
    try {
      setError("")
      setLoading(true)
      const user = await getUserByIdService(id)
      if (user) {
        return user
      }
      setLoading(false)
      return null
    } catch (error) {
      handleError(error)
      setLoading(false)
      return null
    }
  }

  return (
    <UserContext.Provider
      value={{
        loading,
        error,
        getAllUserAdmin,
        getTopSellers,
        getUserByUsername,
        getUserById,
        updateUserById,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

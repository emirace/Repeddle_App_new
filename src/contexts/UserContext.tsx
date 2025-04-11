import { createContext, PropsWithChildren, useEffect, useState } from "react"
import useAuth from "../hooks/useAuth"
import {
  IUsersWithPagination,
  IUser,
  UserByUsername,
  UpdateUser,
  Analytics,
  ITopSellersWithPagination,
} from "../types/user"
import {
  fetchAnalyticsService,
  getAllUserAdminService,
  getTopSellersService,
  getUserByIdService,
  getUserByUsernameService,
  reviewSellerService,
  updateUserByIdService,
} from "../services/user"
import { IReview } from "../types/product"
import socket from "../socket"

type ContextType = {
  error: string | null
  loading: boolean
  getAllUserAdmin: (search?: string) => Promise<IUsersWithPagination | null>
  getTopSellers: (
    search?: string
  ) => Promise<ITopSellersWithPagination | string>
  getUserByUsername: (username: string) => Promise<UserByUsername | string>
  getUserById: (userId: string) => Promise<IUser | string>
  updateUserById: (
    userId: string,
    userData: UpdateUser
  ) => Promise<IUser | string>
  reviewSeller: (
    id: string,
    review: { comment: string; rating: number; like: boolean }
  ) => Promise<{ review: IReview; message: string } | null>
  fetchAnalytics(): Promise<Analytics | string>
  isOnline: (id: string) => boolean
}

// Create user context
export const UserContext = createContext<ContextType | undefined>(undefined)

export const UserProvider = ({ children }: PropsWithChildren) => {
  const { setAuthErrorModalOpen } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [onlineUsers, setOnlineUsers] = useState<
    { _id: string; username: string }[]
  >([])

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

  const getAllUserAdmin = async (search?: string) => {
    try {
      setError("")
      setLoading(true)
      const result = await getAllUserAdminService(search)

      setLoading(false)
      return result
    } catch (error) {
      handleError(error as string)
      setLoading(false)
      return null
    }
  }

  const getTopSellers = async (search?: string) => {
    try {
      setError("")
      setLoading(true)
      const result = await getTopSellersService(search)
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
      return ""
    } catch (error) {
      handleError(error)
      setLoading(false)
      return error as string
    }
  }

  const reviewSeller = async (
    id: string,
    review: { comment: string; rating: number; like: boolean }
  ) => {
    try {
      setError("")
      // setLoading(true)
      const res = await reviewSellerService(id, review)
      if (res) {
        return res
      }
      // setLoading(false)
      return null
    } catch (error) {
      handleError(error)
      // setLoading(false)
      return null
    }
  }

  const fetchAnalytics = async () => {
    try {
      setError("")
      setLoading(true)
      const result = await fetchAnalyticsService()
      setLoading(false)
      return result
    } catch (error) {
      handleError(error as string)
      setLoading(false)
      return error as string
    }
  }

  const isOnline = (userId: string) => {
    return onlineUsers.some((user) => user._id === userId)
  }

  useEffect(() => {
    socket.on("onlineUsers", (onlineUsers) => {
      console.log("Online users:", onlineUsers)
      setOnlineUsers(onlineUsers)
      // Update the UI with the online users
    })
  }, [])

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
        reviewSeller,
        fetchAnalytics,
        isOnline,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

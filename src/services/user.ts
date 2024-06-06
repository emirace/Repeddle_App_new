import {
  IUser,
  IUsersWithPagination,
  TopSellers,
  UpdateUser,
  UserByUsername,
} from "../types/user"
import { getBackendErrorMessage } from "../utils/error"
import api from "./api"

// User UserList

export async function getAllUserAdminService(): Promise<IUsersWithPagination> {
  try {
    const data: IUsersWithPagination & { status: boolean } = await api.get(
      "/users/admin"
    )

    if (!data.status) {
      // Handle all users error, e.g., display an error message to the user
      throw new Error("Get all users failed: " + getBackendErrorMessage(data))
    }

    return data
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Get all users error:", getBackendErrorMessage(error))

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error)
  }
}

export async function getTopSellersService(): Promise<TopSellers[]> {
  try {
    const data: { topSellers: TopSellers[]; status: boolean } = await api.get(
      "/users/top-sellers"
    )

    if (!data.status) {
      // Handle all top sellers error, e.g., display an error message to the user
      throw new Error("Get top sellers failed: " + getBackendErrorMessage(data))
    }

    return data.topSellers
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Get top sellers error:", getBackendErrorMessage(error))

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error)
  }
}

export async function getUserByUsernameService(
  username: string
): Promise<UserByUsername> {
  try {
    const data: UserByUsername & { status: boolean } = await api.get(
      `/users/${username}`
    )

    console.log(data)

    if (!data.status) {
      // Handle get all user by username error, e.g., display an error message to the user
      throw new Error(
        "Get user by username failed: " + getBackendErrorMessage(data)
      )
    }

    return data
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Get user by username error:", getBackendErrorMessage(error))

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error)
  }
}

export async function getUserByIdService(id: string): Promise<IUser> {
  try {
    const data: { user: IUser; status: boolean; message: string } =
      await api.get(`/users/admin/${id}`)

    if (!data.status) {
      // Handle all users error, e.g., display an error message to the user
      throw new Error("Get all failed: " + getBackendErrorMessage(data))
    }

    return data.user
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Get user error:", getBackendErrorMessage(error))

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error)
  }
}

export async function updateUserByIdService(
  id: string,
  userData: UpdateUser
): Promise<IUser> {
  try {
    const response: { user: IUser; status: boolean; message: string } =
      await api.put(`/users/update-profile/${id}`, userData)

    console.log(response)
    if (!response.status) {
      // Handle all users error, e.g., display an error message to the user
      throw new Error("Update failed: " + getBackendErrorMessage(response))
    }

    return response.user
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Update user error:", getBackendErrorMessage(error))

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error)
  }
}

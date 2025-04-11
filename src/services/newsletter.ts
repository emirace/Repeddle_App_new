import { INewsletter } from "../types/message"
import { getBackendErrorMessage } from "../utils/error"
import api from "./api"

export const fetchNewsletterService = async (
  params?: string
): Promise<INewsletter[]> => {
  try {
    let url = "/newsletters"

    if (params && params.length) {
      url = url + `?${params}`
    }

    const resp: { newsletters: INewsletter[]; status: boolean } = await api.get(
      url
    )
    console.log(resp)

    if (!resp.status) {
      // Handle Fetch newsletters error, e.g., display an error message to the user
      throw new Error(
        "Fetch newsletters failed: " + getBackendErrorMessage(resp)
      )
    }

    return resp.newsletters
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Fetch newsletters error:", getBackendErrorMessage(error))

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error)
  }
}

export const createNewsLetterService = async (
  email: string
): Promise<INewsletter> => {
  try {
    const data: {
      status: boolean
      newsletter: INewsletter
    } = await api.post("/newsletters", { email })

    if (!data.status) {
      // Handle Create newsletter error, e.g., display an error message to the user
      throw new Error(
        "Create newsletter failed: " + getBackendErrorMessage(data)
      )
    }

    return data.newsletter
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Create newsletter error:", getBackendErrorMessage(error))

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error)
  }
}

export const deleteNewsLetterService = async (
  id: string
): Promise<{ status: boolean; message: string }> => {
  try {
    const data: { status: boolean; message: string } = await api.delete(
      `/newsletters/${id}`
    )

    if (!data.status) {
      // Handle Delete newsletter error, e.g., display an error message to the user
      throw new Error(
        "Delete newsletter failed: " + getBackendErrorMessage(data)
      )
    }

    return { status: true, message: data.message }
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Delete newsletter error:", getBackendErrorMessage(error))

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error)
  }
}

export const unsubscribeNewsLetterService = async (): Promise<{
  status: boolean
  message: string
}> => {
  try {
    const data: { status: boolean; message: string } = await api.delete(
      `/newsletters/unsubscribe`
    )

    if (!data.status) {
      // Handle unsubscribe newsletter error, e.g., display an error message to the user
      throw new Error(
        "unsubscribe newsletter failed: " + getBackendErrorMessage(data)
      )
    }

    return { status: true, message: data.message }
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error(
      "Unsubscribe newsletter error:",
      getBackendErrorMessage(error)
    )

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error)
  }
}

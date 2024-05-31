import { createContext, PropsWithChildren, useState } from "react"
import { INewsletter } from "../types/message"
import useAuth from "../hooks/useAuth"
import {
  createNewsLetterService,
  deleteNewsLetterService,
  fetchNewsletterService,
} from "../services/newsletter"

type ContextType = {
  newsletters: INewsletter[]
  loading: boolean
  error: string
  fetchNewsletter: (params?: string) => Promise<boolean>
  createNewsletter: (email: string) => Promise<boolean>
  deleteNewsletter: (
    id: string
  ) => Promise<{ message?: string; success: boolean }>
}

// Create newsletter context
export const NewsletterContext = createContext<ContextType | undefined>(
  undefined
)

export const NewsletterProvider = ({ children }: PropsWithChildren) => {
  const { setAuthErrorModalOpen } = useAuth()
  const [newsletters, setNewsletters] = useState<INewsletter[]>([])
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

  // Function to fetch newsletter
  const fetchNewsletter = async (params?: string) => {
    try {
      setError("")
      setLoading(true)
      const result = await fetchNewsletterService(params)
      setNewsletters(result)
      setLoading(false)
      return true
    } catch (error) {
      handleError(error as string)
      setLoading(false)
      return false
    }
  }

  const createNewsletter = async (email: string) => {
    try {
      setError("")
      setLoading(true)
      const result = await createNewsLetterService(email)
      setNewsletters((prevNewsletter) => [result, ...prevNewsletter])
      setLoading(false)
      return true
    } catch (error) {
      handleError(error as string)
      setLoading(false)
      return false
    }
  }

  const deleteNewsletter = async (id: string) => {
    try {
      setError("")
      setLoading(true)
      const data = await deleteNewsLetterService(id)
      setNewsletters((prevNewsletter) =>
        prevNewsletter.filter((Newsletter) => Newsletter._id !== id)
      )
      setLoading(false)
      return { message: data.message, success: true }
    } catch (error) {
      handleError(error as string)
      setLoading(false)
      return { message: error as string, success: false }
    }
  }

  return (
    <NewsletterContext.Provider
      value={{
        fetchNewsletter,
        loading,
        error,
        createNewsletter,
        deleteNewsletter,
        newsletters,
      }}
    >
      {children}
    </NewsletterContext.Provider>
  )
}

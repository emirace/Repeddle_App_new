import { PropsWithChildren, createContext, useState } from "react"
import { ICategory, ICreateCategory } from "../types/category"
import {
  createCategoryService,
  deleteCategoryService,
  fetchCategoriesService,
  fetchCategoryByIdService,
  updateCategoryService,
} from "../services/category"
import useAuth from "../hooks/useAuth"

type ContextType = {
  categories: ICategory[]
  loading: boolean
  error: string
  fetchCategories: () => Promise<boolean>
  fetchCategoryById: (id: string) => Promise<ICategory | null>
  createCategory: (category: ICreateCategory) => Promise<boolean>
  updateCategory: (id: string, category: ICreateCategory) => Promise<boolean>
  deleteCategory: (id: string) => Promise<boolean>
}

export const CategoryContext = createContext<ContextType | undefined>(undefined)

export const CategoryProvider = ({ children }: PropsWithChildren) => {
  const { setAuthErrorModalOpen } = useAuth()
  const [categories, setCategories] = useState<ICategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  //   const [authErrorModalOpen, setAuthErrorModalOpen] = useState(false)

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

  // Function to fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true)
      const result = await fetchCategoriesService()
      setCategories(result)
      setLoading(false)
      return true
    } catch (error) {
      handleError(error as string)
      setLoading(false)
      return false
    }
  }

  // Function to fetch category by id
  const fetchCategoryById = async (categoryId: string) => {
    try {
      setLoading(true)
      const result = await fetchCategoryByIdService(categoryId)
      setLoading(false)
      return result
    } catch (error) {
      handleError(error as string)
      setLoading(false)
      return null
    }
  }

  const createCategory = async (category: ICreateCategory) => {
    try {
      setLoading(true)
      const result = await createCategoryService(category)
      setCategories((prevCategories) => {
        const updatedCategories = [result, ...prevCategories]
        return updatedCategories
      })
      setLoading(false)
      return true
    } catch (error) {
      handleError(error as string)
      setLoading(false)
      return false
    }
  }

  const updateCategory = async (id: string, category: ICreateCategory) => {
    try {
      setLoading(true)
      const result = await updateCategoryService(id, category)
      setCategories((prevCategories) => {
        const updatedCategories = prevCategories.map((p) =>
          p._id === id ? result : p
        )

        return updatedCategories
      })
      setLoading(false)
      return true
    } catch (error) {
      handleError(error as string)
      setLoading(false)
      return false
    }
  }

  const deleteCategory = async (id: string) => {
    try {
      setLoading(true)
      await deleteCategoryService(id)
      setCategories((prevCategory) =>
        prevCategory.filter((Category) => Category._id !== id)
      )
      setLoading(false)
      return true
    } catch (error) {
      handleError(error as string)
      setLoading(false)
      return false
    }
  }

  return (
    <CategoryContext.Provider
      value={{
        loading,
        error,
        categories,
        fetchCategories,
        fetchCategoryById,
        createCategory,
        updateCategory,
        deleteCategory,
      }}
    >
      {children}
    </CategoryContext.Provider>
  )
}

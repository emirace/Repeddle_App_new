import { createContext, PropsWithChildren, useState } from "react"
import {
  ICreateProduct,
  IProduct,
  ProductWithPagination,
} from "../types/product"
import {
  createProductService,
  deleteProductService,
  fetchProductByIdService,
  fetchProductBySlugService,
  fetchProductsService,
  fetchUserProductsService,
  updateProductService,
} from "../services/product"

type ContextType = {
  products: ProductWithPagination
  loading: boolean
  error: string
  fetchProducts: (params?: string) => Promise<boolean>
  fetchUserProducts: (params?: string) => Promise<boolean>
  fetchProductBySlug: (slug: string) => Promise<IProduct | null>
  fetchProductById: (id: string) => Promise<IProduct | string>
  createProduct: (product: ICreateProduct) => Promise<boolean>
  updateProduct: (id: string, product: ICreateProduct) => Promise<boolean>
  deleteProduct: (id: string) => Promise<{ message?: string }>
}

// Create product context
export const ProductContext = createContext<ContextType | undefined>(undefined)

export const ProductProvider = ({ children }: PropsWithChildren) => {
  const [products, setProducts] = useState<ProductWithPagination>({
    currentPage: 0,
    products: [],
    totalCount: 0,
    totalPages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleError = (error: any) => {
    setLoading(false)

    // Check if the error indicates an invalid or expired token
    if (error === "Token expired" || error === "Invalid token") {
      setError("")
      // // Set the state to open the auth error modal
      // setAuthErrorModalOpen(true)
    } else {
      setError(error || "An error occurred.")
    }
  }

  // Function to fetch products
  const fetchProducts = async (params?: string) => {
    try {
      setError("")
      setLoading(true)
      const result = await fetchProductsService(params)
      setProducts(result)
      setLoading(false)
      return true
    } catch (error) {
      handleError(error as string)
      setLoading(false)
      return false
    }
  }

  // Function to fetch products
  const fetchUserProducts = async (params?: string) => {
    try {
      setError("")
      setLoading(true)
      const result = await fetchUserProductsService(params)
      setProducts(result)
      setLoading(false)
      return true
    } catch (error) {
      handleError(error as string)
      setLoading(false)
      return false
    }
  }

  // Function to fetch product by slug
  const fetchProductBySlug = async (slug: string) => {
    try {
      setError("")
      setLoading(true)
      const result = await fetchProductBySlugService(slug)
      setLoading(false)
      return result
    } catch (error) {
      handleError(error as string)
      setLoading(false)
      return null
    }
  }

  const fetchProductById = async (id: string) => {
    try {
      setError("")
      setLoading(true)
      const result = await fetchProductByIdService(id)
      setLoading(false)
      return result
    } catch (error) {
      handleError(error as string)
      setLoading(false)
      return error as string
    }
  }

  const createProduct = async (product: ICreateProduct) => {
    try {
      setError("")
      setLoading(true)
      const result = await createProductService(product)
      setProducts((prevProducts) => {
        const updatedProducts = [result, ...prevProducts.products]
        const newProd = {
          ...prevProducts,
          products: updatedProducts,
        }
        return newProd
      })
      setLoading(false)
      return true
    } catch (error) {
      handleError(error as string)
      setLoading(false)
      return false
    }
  }

  const updateProduct = async (id: string, product: ICreateProduct) => {
    try {
      setError("")
      setLoading(true)
      const result = await updateProductService(id, product)
      setProducts((prevProducts) => {
        const updatedProducts = prevProducts.products.map((p) =>
          p._id === id ? result : p
        )

        const newProd = { ...prevProducts, products: updatedProducts }
        return newProd
      })
      setLoading(false)
      return true
    } catch (error) {
      handleError(error as string)
      setLoading(false)
      return false
    }
  }

  const deleteProduct = async (id: string) => {
    try {
      setError("")
      setLoading(true)
      const data = await deleteProductService(id)
      setProducts((prevProducts) => {
        const updatedProducts = prevProducts.products.filter(
          (Product) => Product._id !== id
        )

        const newProd = {
          ...prevProducts,
          products: updatedProducts,
        }
        return newProd
      })
      setLoading(false)
      return { message: data.message }
    } catch (error) {
      // handleError(error as string)
      setLoading(false)
      return { message: error as string }
    }
  }

  return (
    <ProductContext.Provider
      value={{
        fetchProducts,
        fetchUserProducts,
        products,
        loading,
        error,
        createProduct,
        deleteProduct,
        fetchProductBySlug,
        fetchProductById,
        updateProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}

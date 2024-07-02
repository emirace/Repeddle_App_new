import { createContext, PropsWithChildren, useState } from "react"
import useAuth from "../hooks/useAuth"
import { ICreateOrder, IOrder, IOrderSummary } from "../types/order"
import {
  createOrderService,
  fetchOrderByIdService,
  fetchOrdersService,
  fetchSoldOrdersService,
  getOrdersSummaryService,
  updateOrderItemTrackingService,
} from "../services/order"

type ContextType = {
  orders: IOrder[]
  loading: boolean
  error: string
  fetchOrders: () => Promise<IOrder[] | null>
  fetchOrderById: (id: string) => Promise<IOrder | null>
  fetchSoldOrders: () => Promise<IOrder[] | null>
  createOrder: (
    order: ICreateOrder
  ) => Promise<null | { order: IOrder; message: string }>
  updateOrderItemTracking: (
    orderId: string,
    itemId: string,
    body: { status: string; trackingNumber?: string }
  ) => Promise<IOrder | null>
  getOrdersSummary: (val: {
    endDate?: string
    startDate?: string
  }) => Promise<IOrderSummary | null>
}

// Create order context
export const OrderContext = createContext<ContextType | undefined>(undefined)

export const OrderProvider = ({ children }: PropsWithChildren) => {
  const { setAuthErrorModalOpen } = useAuth()
  const [orders, setOrders] = useState<IOrder[]>([])
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

  // Function to fetch orders
  const fetchOrders = async () => {
    try {
      setError("")
      setLoading(true)
      const result = await fetchOrdersService()
      setOrders(result)
      setLoading(false)
      return result
    } catch (error) {
      handleError(error as string)
      setLoading(false)
      return null
    }
  }

  // Function to fetch orders
  const fetchSoldOrders = async () => {
    try {
      setError("")
      setLoading(true)
      const result = await fetchSoldOrdersService()
      setOrders(result)
      setLoading(false)
      return result
    } catch (error) {
      handleError(error as string)
      setLoading(false)
      return null
    }
  }

  // Function to fetch order by id
  const fetchOrderById = async (id: string) => {
    try {
      setError("")
      setLoading(true)
      const result = await fetchOrderByIdService(id)
      setLoading(false)
      return result
    } catch (error) {
      handleError(error as string)
      setLoading(false)
      return null
    }
  }

  const createOrder = async (order: ICreateOrder) => {
    try {
      setError("")
      setLoading(true)
      const result = await createOrderService(order)
      setOrders((prevOrders) => [...prevOrders, result.order])
      setLoading(false)
      return result
    } catch (error) {
      handleError(error as string)
      setLoading(false)
      return null
    }
  }

  const updateOrderItemTracking = async (
    orderId: string,
    itemId: string,
    body: { status: string; trackingNumber?: string }
  ) => {
    try {
      setError("")
      // setLoading(true)
      const result = await updateOrderItemTrackingService(orderId, itemId, body)
      setOrders((prevOrders) =>
        prevOrders.map((p) => (p._id === orderId ? result : p))
      )
      // setLoading(false)
      return result
    } catch (error) {
      handleError(error as string)
      // setLoading(false)
      return null
    }
  }

  const getOrdersSummary = async (val: {
    endDate?: string
    startDate?: string
  }) => {
    try {
      setError("")
      setLoading(true)

      const params: string[][] = []

      Object.entries(val).map((par) => {
        params.push(par)
      })

      const paramVal = new URLSearchParams(params).toString()

      const data = await getOrdersSummaryService(paramVal)

      setLoading(false)
      return data
    } catch (error) {
      handleError(error as string)
      setLoading(false)
      return null
    }
  }

  return (
    <OrderContext.Provider
      value={{
        fetchOrders,
        fetchSoldOrders,
        orders,
        loading,
        error,
        createOrder,
        fetchOrderById,
        getOrdersSummary,

        updateOrderItemTracking,
      }}
    >
      {children}
    </OrderContext.Provider>
  )
}

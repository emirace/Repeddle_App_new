import React, { createContext, useState, useEffect, ReactNode } from "react"
import { IProduct } from "../types/product"

type Props = {
  children: ReactNode
}

export type PaymentType = "Card" | "Wallet"

// Define the types for items in the cart
export type CartItem = IProduct & {
  quantity: number
  selectedSize?: string
  selectedColor?: string
  deliverySelect?: { [key: string]: string | number }
}

// Define the CartContextData
type CartContextData = {
  cart: CartItem[]
  subtotal: number
  total: number
  paymentMethod: PaymentType
  changePaymentMethod: (method: PaymentType) => void
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string) => void
  clearCart: () => void
}

// Create the CartContext
export const CartContext = createContext<CartContextData | undefined>(undefined)

// CartProvider component
export const CartProvider: React.FC<Props> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([])
  const [paymentMethod, setPaymentMethod] = useState<PaymentType>("Card")

  const saveCartToLocalStorage = (cartData: CartItem[]) => {
    localStorage.setItem("cart", JSON.stringify(cartData))
  }

  const changePaymentMethod = (method: PaymentType) => {
    setPaymentMethod(method)
    localStorage.setItem("paymentMethod", JSON.stringify(method))
  }

  //   function mergeCarts(localCart: CartItem[], remoteCart: CartItem[]): CartItem[] {
  //     const mergedCart = [...localCart];

  //     for (const remoteCartItem of remoteCart) {
  //       const existingItem = localCart.find((item) => item.id === remoteCartItem.id);
  //       if (!existingItem) {
  //         mergedCart.push(remoteCartItem);
  //       }
  //     }

  //     return mergedCart;
  //   }

  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }

    const savedMethod = localStorage.getItem("paymentMethod")
    if (savedMethod) {
      setPaymentMethod(JSON.parse(savedMethod))
    }
  }, [])

  // Calculate subtotal and total
  const subtotal = cart.reduce(
    (total, item) => total + item.sellingPrice * item.quantity,
    0
  )
  const total = subtotal

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      // Check if the item already exists in the cart
      const existingItem = prevCart.find(
        (cartItem) => cartItem._id === item._id
      )
      if (existingItem) {
        // If it exists, update the quantity
        const updatedCart = prevCart.map((cartItem) =>
          cartItem._id === item._id ? item : cartItem
        )
        saveCartToLocalStorage(updatedCart)
        return updatedCart
      } else {
        // If it doesn't exist, add it to the cart
        saveCartToLocalStorage([...prevCart, item])
        return [...prevCart, item]
      }
    })
  }

  const removeFromCart = (id: string) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item._id !== id)
      saveCartToLocalStorage(updatedCart)
      return updatedCart
    })
  }

  const clearCart = () => {
    setCart([])
    localStorage.removeItem("cart")
    localStorage.removeItem("paymentMethod")
    setPaymentMethod("Card")
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        subtotal,
        total,
        addToCart,
        removeFromCart,
        clearCart,
        paymentMethod,
        changePaymentMethod,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

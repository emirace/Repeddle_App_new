import React, { createContext, useState, useEffect, ReactNode } from "react";
import { IProduct } from "../types/product";
import * as SecureStore from "expo-secure-store";

type Props = {
  children: ReactNode;
};
// Define the types for items in the cart
export type CartItem = IProduct & {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  deliverySelect: { [key: string]: string };
};

// Define the CartContextData
type CartContextData = {
  cart: CartItem[];
  subtotal: number;
  total: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
};

// Create the CartContext
export const CartContext = createContext<CartContextData | undefined>(
  undefined
);

// CartProvider component
export const CartProvider: React.FC<Props> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const saveCartToLocalStorage = async (cartData: CartItem[]) => {
    await SecureStore.setItemAsync("cart", JSON.stringify(cartData));
  };

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
    const getSavedCart = async () => {
      const savedCart = await SecureStore.getItemAsync("cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    };
    getSavedCart();
  }, []);

  // Calculate subtotal and total
  const subtotal = cart.reduce(
    (total, item) => total + item.sellingPrice * item.quantity,
    0
  );
  const total = subtotal;

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      // Check if the item already exists in the cart
      const existingItem = prevCart.find(
        (cartItem) => cartItem._id === item._id
      );
      if (existingItem) {
        // If it exists, update the quantity
        const updatedCart = prevCart.map((cartItem) =>
          cartItem._id === item._id ? item : cartItem
        );
        saveCartToLocalStorage(updatedCart);
        return updatedCart;
      } else {
        // If it doesn't exist, add it to the cart
        saveCartToLocalStorage([...prevCart, item]);
        return [...prevCart, item];
      }
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item._id !== id);
      saveCartToLocalStorage(updatedCart);
      return updatedCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider
      value={{ cart, subtotal, total, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

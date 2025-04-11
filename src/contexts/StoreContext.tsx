import * as SecureStore from "expo-secure-store"
import { PropsWithChildren, createContext } from "react"
import { IProduct, RecentlyViewed } from "../types/product"

type ContextType = {
  storeString: (key: string, value: string) => Promise<void>
  storeObject: (key: string, value: object) => Promise<void>
  getString: (key: string) => Promise<string | null>
  getObject: (key: string) => Promise<object | any[] | null>
  removeValue: (key: string) => Promise<void>
  storeRecently: (data: IProduct) => Promise<void>
  getRecently: () => Promise<RecentlyViewed[]>
}

// Create store context
export const StoreContext = createContext<ContextType | undefined>(undefined)

export const StoreProvider = ({ children }: PropsWithChildren) => {
  const storeString = async (key: string, value: string) => {
    try {
      await SecureStore.setItemAsync(key, value)
    } catch (e) {
      console.log(e)
    }
  }

  const storeObject = async (key: string, value: object) => {
    try {
      const jsonValue = JSON.stringify(value)
      await SecureStore.setItemAsync(key, jsonValue)
    } catch (e) {
      console.log(e)
    }
  }

  const getString = async (key: string) => {
    try {
      const value = await SecureStore.getItemAsync(key)
      if (value !== null) {
        // value previously stored
        return value
      } else {
        return null
      }
    } catch (e) {
      // error reading value
      console.log(e)
      return null
    }
  }

  const getObject = async (key: string) => {
    try {
      const jsonValue = await SecureStore.getItemAsync(key)
      if (!jsonValue) return null

      return jsonValue != null ? JSON.parse(jsonValue) : null
    } catch (e) {
      // error reading value
      console.log(e)
      return null
    }
  }

  const removeValue = async (key: string) => {
    try {
      await SecureStore.deleteItemAsync(key)
    } catch (e) {
      // remove error
      console.log(e)
    }

    console.log("Done.")
  }

  const storeRecently = async (data: IProduct) => {
    const factor = 0.9
    const views = await getRecently()

    const existing = views?.find((x) => x.productId === data._id)

    const newView = {
      score: factor,
      numViews: 1,
      productId: data._id,
      product: data,
    }

    const newViews = existing
      ? views.map((item) =>
          item.productId === existing.productId
            ? {
                score: existing.score + factor,
                numViews: existing.numViews + 1,
                productId: existing.productId,
                product: existing.product,
              }
            : item
        )
      : [...views, newView]
    storeObject("recentlyView", newViews)
    // TODO: update product
    // TODO: this line
    // if (newViews) {
    //   const newViews1 = newViews.map((v) =>
    //     data._id !== v.productId
    //       ? {
    //           score: v.score * factor,
    //           productId: v.productId,
    //           product: v.product,
    //           newViews: v.newViews,
    //         }
    //       : v
    //   )
    //   storeObject("recentlyView", newViews1)
    // }
  }

  const getRecently = async () => {
    const data: RecentlyViewed[] = (await getObject("recentlyView")) ?? []

    return data
  }

  return (
    <StoreContext.Provider
      value={{
        getObject,
        getString,
        removeValue,
        storeObject,
        storeString,
        getRecently,
        storeRecently,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

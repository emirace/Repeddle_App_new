import merge from "deepmerge"
import {
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
  adaptNavigationTheme,
} from "react-native-paper"
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native"
import MessageProvider from "./contexts/MessageContext"
import { AuthProvider } from "./contexts/AuthContext"
import { StatusBar } from "expo-status-bar"
import useTheme from "./hooks/useTheme"
import { darkTheme, lightTheme } from "./constant/theme"
import MainStackNav from "./navigations/stack"
import { CartProvider } from "./contexts/CartContext"
import { ProductProvider } from "./contexts/ProductContext"
import { UserProvider } from "./contexts/UserContext"
import { BrandProvider } from "./contexts/BrandContext"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { NewsletterProvider } from "./contexts/NewsletterContext"
import { OrderProvider } from "./contexts/OrderContext"

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
})

const CombinedDefaultTheme = merge(MD3LightTheme, LightTheme)
const CombinedDarkTheme = merge(MD3DarkTheme, DarkTheme)

const Main = () => {
  const { themeMode } = useTheme()
  const paperTheme =
    themeMode === "dark"
      ? { ...MD3DarkTheme, colors: darkTheme.colors }
      : { ...MD3LightTheme, colors: lightTheme.colors }

  return (
    <PaperProvider theme={paperTheme}>
      <StatusBar
        animated={true}
        style={themeMode === "dark" ? "light" : "dark"}
      />
      <NavigationContainer
        theme={themeMode === "dark" ? CombinedDarkTheme : CombinedDefaultTheme}
      >
        <BottomSheetModalProvider>
          <ProductProvider>
            <UserProvider>
              <BrandProvider>
                <AuthProvider>
                  <CartProvider>
                    <NewsletterProvider>
                      <OrderProvider>
                        <MessageProvider>
                          <MainStackNav />
                        </MessageProvider>
                      </OrderProvider>
                    </NewsletterProvider>
                  </CartProvider>
                </AuthProvider>
              </BrandProvider>
            </UserProvider>
          </ProductProvider>
        </BottomSheetModalProvider>
      </NavigationContainer>
    </PaperProvider>
  )
}

export default Main

import merge from "deepmerge";
import {
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
  adaptNavigationTheme,
  configureFonts,
} from "react-native-paper";
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import MessageProvider from "./contexts/MessageContext";
import { AuthProvider } from "./contexts/AuthContext";
import { StatusBar } from "expo-status-bar";
import useTheme from "./hooks/useTheme";
import { darkTheme, lightTheme } from "./constant/theme";
import MainStackNav from "./navigations/stack";
import { CartProvider } from "./contexts/CartContext";
import { ProductProvider } from "./contexts/ProductContext";
import { UserProvider } from "./contexts/UserContext";
import { BrandProvider } from "./contexts/BrandContext";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { NewsletterProvider } from "./contexts/NewsletterContext";
import { OrderProvider } from "./contexts/OrderContext";
import { CategoryProvider } from "./contexts/CategoryContext";
import { StoreProvider } from "./contexts/StoreContext";
import { TransactionProvider } from "./contexts/TransactionContext";
import { ToastNotificationProvider } from "./contexts/ToastNotificationContext";
import ToastNotification from "./components/ui/ToastNotification";
import { ReturnProvider } from "./contexts/ReturnContext";
import { ThemeProp } from "react-native-paper/lib/typescript/types";
import { WalletProvider } from "./contexts/WalletContext";

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

const CombinedDefaultTheme = merge(MD3LightTheme, LightTheme);
const CombinedDarkTheme = merge(MD3DarkTheme, DarkTheme);

const fonts = configureFonts({ config: { fontFamily: "chronicle-text" } });

const Main = () => {
  const { themeMode } = useTheme();
  const paperTheme: ThemeProp =
    themeMode === "dark"
      ? { ...MD3DarkTheme, colors: darkTheme.colors, fonts }
      : { ...MD3LightTheme, colors: lightTheme.colors, fonts };

  return (
    <PaperProvider theme={paperTheme}>
      <StatusBar
        animated={true}
        style={themeMode === "dark" ? "light" : "dark"}
        backgroundColor={lightTheme.colors.primary}
      />
      <NavigationContainer
        theme={themeMode === "dark" ? CombinedDarkTheme : CombinedDefaultTheme}
      >
        <AuthProvider>
          <ToastNotificationProvider>
            <BrandProvider>
              <CategoryProvider>
                <BottomSheetModalProvider>
                  <StoreProvider>
                    <ProductProvider>
                      <UserProvider>
                        <StoreProvider>
                          <CartProvider>
                            <NewsletterProvider>
                              <OrderProvider>
                                <TransactionProvider>
                                  <MessageProvider>
                                    <ReturnProvider>
                                      <WalletProvider>
                                        <ToastNotification />
                                        <MainStackNav />
                                      </WalletProvider>
                                    </ReturnProvider>
                                  </MessageProvider>
                                </TransactionProvider>
                              </OrderProvider>
                            </NewsletterProvider>
                          </CartProvider>
                        </StoreProvider>
                      </UserProvider>
                    </ProductProvider>
                  </StoreProvider>
                </BottomSheetModalProvider>
              </CategoryProvider>
            </BrandProvider>
          </ToastNotificationProvider>
        </AuthProvider>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default Main;

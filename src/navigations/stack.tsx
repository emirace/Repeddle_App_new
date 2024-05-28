import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { RootStackParamList } from "../types/navigation/stack"
import MainBottomNav from "./bottom"
import Appearance from "../screens/Profile/Appearance"
import Sell from "../screens/Sell"
import Search from "../screens/Search"
import Product from "../screens/Product"
import Chat from "../screens/chat/Chat"

const Stack = createNativeStackNavigator<RootStackParamList>()

function MainStackNav() {
  return (
    <Stack.Navigator initialRouteName={"Main"}>
      <Stack.Screen
        name="Main"
        component={MainBottomNav}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Search"
        component={Search}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Product"
        component={Product}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Appearance"
        component={Appearance}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Sell"
        component={Sell}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Chat"
        component={Chat}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  )
}

export default MainStackNav

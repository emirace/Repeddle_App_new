import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { MainBottomStackList } from "./bottom"

export type RootStackParamList = {
  Main: MainBottomStackList
  Appearance: undefined
  Sell: undefined
}

export type MainScreenNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "Main"
>

export type SellNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "Sell"
>

export type AppearanceNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "Appearance"
>

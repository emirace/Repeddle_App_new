import { BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps } from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { RootStackParamList } from "./stack"

export type MainBottomStackList = {
  Home: HomeStackList
  Category: undefined
  Sell: undefined
  Chat: undefined
  Profile: undefined
}

export type HomeStackList = {
  Home: undefined
  search: { query?: string }
}

export type HomeScreenMainBottomNavigationProp = CompositeScreenProps<
  NativeStackScreenProps<HomeStackList, "Home">,
  CompositeScreenProps<
    NativeStackScreenProps<MainBottomStackList, "Home">,
    BottomTabScreenProps<RootStackParamList>
  >
>

export type SearchScreenMainBottomNavigationProp = CompositeScreenProps<
  NativeStackScreenProps<HomeStackList, "search">,
  CompositeScreenProps<
    NativeStackScreenProps<MainBottomStackList, "Home">,
    BottomTabScreenProps<RootStackParamList>
  >
>

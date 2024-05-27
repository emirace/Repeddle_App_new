import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { MainBottomStackList } from "./bottom"

export type RootStackParamList = {
  Main: undefined;
  Appearance: undefined;
  Sell: undefined;
  Chat: { conversationId: string };
};

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
>;

export type ChatNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "Chat"
>;

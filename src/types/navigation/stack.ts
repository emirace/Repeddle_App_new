import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SearchOptions } from "../search";

export type RootStackParamList = {
  Main: undefined;
  Appearance: undefined;
  Search: SearchOptions;
  Product: { slug: string };
  Chat: { conversationId: string };
  Sell: undefined;
  Fund: undefined;
  Withdraw: undefined;
};

export type MainScreenNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "Main"
>;

export type SearchScreenNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "Search"
>;

export type SellNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "Sell"
>;

export type AppearanceNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "Appearance"
>;

export type ChatNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "Chat"
>;

export type FundNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "Fund"
>;

export type WithdrawNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "Withdraw"
>;

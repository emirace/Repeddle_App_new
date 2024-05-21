import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Main: undefined;
  Appearance: undefined;
  Sell: undefined;
};

export type MainScreenNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "Main"
>;

export type SellNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "Sell"
>;

export type AppearanceNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "Appearance"
>;

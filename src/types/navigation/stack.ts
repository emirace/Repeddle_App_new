import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SearchOptions } from "../search";

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Appearance: undefined;
  Search: SearchOptions;
  Product: { slug: string };
  Chat: { conversationId: string };
  Sell: undefined;
  Profile: undefined;
  ProductList: undefined;
  OrderList: undefined;
  EditProduct: { id: string };
  OrderDetails: { id: string };
  MyAccount: { username: string };
  BuyersProtection: undefined;
  SizeChart: undefined;
  Cart: undefined;
  Checkout: undefined;
  PaymentMethod: undefined;
  CreateProduct: undefined;
  SellerReview: { id: string };
  Fund: undefined;
  Withdraw: undefined;
};

export type MainScreenNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "Main"
>;

export type AuthNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "Auth"
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

export type ProfileNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "Profile"
>;

export type ProductNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "Product"
>;

export type ProductListNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "ProductList"
>;
export type OrderListNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "OrderList"
>;

export type EditProductNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "EditProduct"
>;

export type OrderDetailsNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "OrderDetails"
>;

export type MyAccountNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "MyAccount"
>;

export type BuyersProtectionNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "BuyersProtection"
>;

export type SizeChartNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "SizeChart"
>;
export type CartNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "Cart"
>;

export type CheckoutNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "Checkout"
>;

export type PaymentMethodNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "PaymentMethod"
>;

export type CreateProductNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "CreateProduct"
>;

export type SellerReviewNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "SellerReview"
>;

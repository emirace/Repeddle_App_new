import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FilterOptions, SearchOptions } from "../search";
import { OrderItem } from "../order";
import { ITransaction } from "../transactions";

export type RootStackParamList = {
  Auth: undefined;
  Login: undefined;
  SignUp: undefined;
  Step: { email: string };
  ForgetPassword: undefined;
  Main: undefined;
  Appearance: undefined;
  Search: { filter?: FilterOptions; query?: string };
  Product: { slug: string };
  Chat: { conversationId: string };
  Sell: undefined;
  ProfileSettings: undefined;
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
  SellerReview: { id: string };
  Wishlist: undefined;
  ReturnDetail: { id: string };
  ReturnForm: {
    orderItems: OrderItem[];
    orderId: string;
    waybillNumber?: string;
  };
  Return: undefined;
  Transaction: undefined;
  TransactionDetail: { transaction: ITransaction };
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

export type LoginNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "Login"
>;
export type SignUpNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "SignUp"
>;

export type StepNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "Step"
>;

export type ForgetPasswordNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "ForgetPassword"
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

export type ProfileSettingsNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "ProfileSettings"
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

export type SellerReviewNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "SellerReview"
>;
export type WishlistNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "Wishlist"
>;

export type ReturnDetailNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "ReturnDetail"
>;

export type ReturnFormNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "ReturnForm"
>;

export type ReturnNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "Return"
>;

export type TransactionNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "Transaction"
>;

export type TransactionDetailNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "TransactionDetail"
>;

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation/stack";
import MainBottomNav from "./bottom";
import Sell from "../screens/Sell";
import Search from "../screens/Search";
import Product from "../screens/Product";
import Chat from "../screens/chat/Chat";
import ProfileSettings from "../screens/Dashboard/ProfileSettings";
import ProductList from "../screens/Dashboard/ProductList";
import OrderList from "../screens/Dashboard/OrderList";
import EditProduct from "../screens/Dashboard/EditProduct";
import OrderDetails from "../screens/Dashboard/OrderDetails";
import BuyersProtection from "../screens/BuyersProtection";
import SizeChart from "../screens/SizeChart";
import Cart from "../screens/Cart";
import Checkout from "../screens/Checkout";
import PaymentMethod from "../screens/PaymentMethod";
import SellerReview from "../screens/SellerReview";
import Wishlist from "../screens/Dashboard/Wishlist";
import ReturnDetail from "../screens/Dashboard/ReturnDetail";
import ReturnForm from "../screens/ReturnForm";
import Return from "../screens/Dashboard/Return";
import Transaction from "../screens/Dashboard/Transaction";
import TransactionDetail from "../screens/Dashboard/TransactionDetail";
import Wallet from "../screens/wallet/Fund";
import Fund from "../screens/wallet/Fund";
import Withdraw from "../screens/wallet/Withdraw";
import Auth from "../screens/Auth";
import MyAccount from "../screens/profile/MyAccount";
import Appearance from "../screens/profile/Appearance";
import Login from "../screens/Auth/Login";
import ForgetPassword from "../screens/Auth/ForgetPassword";

const Stack = createNativeStackNavigator<RootStackParamList>();

function MainStackNav() {
  return (
    <Stack.Navigator initialRouteName={"Auth"}>
      <Stack.Screen
        name="Main"
        component={MainBottomNav}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Auth"
        component={Auth}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ForgetPassword"
        component={ForgetPassword}
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
      <Stack.Screen
        name="Fund"
        component={Fund}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Withdraw"
        component={Withdraw}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProfileSettings"
        component={ProfileSettings}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProductList"
        component={ProductList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OrderList"
        component={OrderList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditProduct"
        component={EditProduct}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="OrderDetails"
        component={OrderDetails}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="MyAccount"
        component={MyAccount}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BuyersProtection"
        component={BuyersProtection}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SizeChart"
        component={SizeChart}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Cart"
        component={Cart}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Checkout"
        component={Checkout}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PaymentMethod"
        component={PaymentMethod}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SellerReview"
        component={SellerReview}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Wishlist"
        component={Wishlist}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ReturnDetail"
        component={ReturnDetail}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ReturnForm"
        component={ReturnForm}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Return"
        component={Return}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Transaction"
        component={Transaction}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="TransactionDetail"
        component={TransactionDetail}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default MainStackNav;

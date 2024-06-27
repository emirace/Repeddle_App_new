import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { useTheme } from "react-native-paper";
import useAuth from "../../hooks/useAuth";
import { IOrder } from "../../types/order";
import { makePayFastPaymentService } from "../../services/others";

type Props = {
  totalPrice: number;
  placeOrderHandler: (value: {
    paymentMethod: string;
    transId: string;
  }) => Promise<IOrder | undefined>;
};

const Payfast = ({ placeOrderHandler, totalPrice }: Props) => {
  const { colors } = useTheme();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);

  const myData = {
    // Merchant details
    merchant_id: 21331397,
    merchant_key: "f6dtd8f8khb4m",
    return_url: "https://www.repeddle.co.za",
    cancel_url: "https://www.repeddle.co.za",
    notify_url: "https://www.repeddle.co.za/api/transactions/payfastnotify",
    // Buyer details
    name_first: user!.firstName,
    name_last: user!.lastName,
    email_address: user!.email,
    // Transaction details
    m_payment_id: "1234",
    amount: `${totalPrice}`,
    item_name: "",
    //custom
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const order = await placeOrderHandler({ paymentMethod: "", transId: "" });
      if (order) {
        console.log(order);
        myData["item_name"] = `${order._id}`;

        await makePayFastPaymentService(myData);
      } else console.log("cant create order");
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return loading ? (
    <ActivityIndicator size={"large"} color={colors.primary} />
  ) : (
    <TouchableOpacity
      style={[
        styles.button,
        { marginVertical: 20, backgroundColor: colors.primary },
      ]}
      onPress={handleSubmit}
    >
      <Text style={{ color: "white", fontWeight: "bold" }}>
        Proceed to Payment
      </Text>
    </TouchableOpacity>
  );
};

export default Payfast;

const styles = StyleSheet.create({
  button: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
});

import React, { useState } from "react";
import { usePaystack } from "react-native-paystack-webview";
import { generateTransactionRef } from "../../utils/common";
import useToastNotification from "../../hooks/useToastNotification";
import useAuth from "../../hooks/useAuth";
import { Button } from "react-native-paper";
import { StyleSheet } from "react-native";

interface Props {
  amount: number;
  onAprove: ({
    paymentMethod,
    id,
  }: {
    paymentMethod: string;
    id: string;
  }) => Promise<void>;
}
const PayWithPaystack: React.FC<Props> = ({ amount, onAprove }) => {
  const { popup } = usePaystack();
  const { user } = useAuth();
  const { addNotification } = useToastNotification();
  const [isLoading, setIsLoading] = useState(false);

  const payNow = () => {
    setIsLoading(true);
    popup.checkout({
      email: user?.email || "",
      amount,
      reference: generateTransactionRef(10),
      onSuccess: async (res) => {
        await onAprove({ paymentMethod: "Paystack", id: res.reference });
        setIsLoading(false);
      },
      onCancel: () => {
        addNotification({ message: "User cancelled", error: true });
        setIsLoading(false);
      },
      onLoad: (res) => {
        console.log("WebView Loaded:", res);
        setIsLoading(false);
      },
      onError: (err) => {
        addNotification({ message: "Payment error", error: true });
        console.log("WebView Error:", err);
        setIsLoading(false);
      },
    });
  };

  return (
    <Button
      onPress={payNow}
      children="Proceed"
      loading={isLoading}
      mode="contained"
      style={[
        styles.button,
        {
          width: "100%",
        },
      ]}
      labelStyle={{
        color: "white",
        fontFamily: "chronicle-text-bold",
      }}
    />
  );
};

export default PayWithPaystack;

const styles = StyleSheet.create({
  button: {
    height: 40,
    borderRadius: 5,
  },
});

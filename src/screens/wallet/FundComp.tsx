import React, { useState } from "react";
import { TextInput, Button, ActivityIndicator } from "react-native-paper";
import { API_KEY } from "../../utils/constants";
import useAuth from "../../hooks/useAuth";
import { ScrollView, StyleSheet, View } from "react-native";
import PayWithFlutterwave from "flutterwave-react-native";
import useToastNotification from "../../hooks/useToastNotification";
import useWallet from "../../hooks/useWallet";
import { generateTransactionRef } from "../../utils/common";
import PayWithPaystack from "../../components/paymentMethod/Paystack";

type Props = {
  onSuccess?: () => Promise<void> | void;
  isLoading?: boolean;
};

const FundComp = ({ onSuccess, isLoading: isLoadingProp }: Props) => {
  const { user } = useAuth();
  const { fundWalletFlutter } = useWallet();

  const [amount, setAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const { addNotification } = useToastNotification();

  const onApprove = async ({
    paymentMethod,
    id,
  }: {
    paymentMethod: string;
    id: string;
  }) => {
    if (amount === "" || isNaN(parseFloat(amount))) {
      addNotification({
        message: "Invalid Amount, Please enter a valid amount.",
        error: true,
      });
      return;
    }

    const res = await fundWalletFlutter({
      amount: parseInt(amount),
      transactionId: id,
      paymentProvider: paymentMethod,
    });
    addNotification({
      message: res.result,
      error: res.error,
    });
    if (!res.error) await onSuccess?.();
  };

  const handleOnRedirect = async (result: any) => {
    console.log(result);
    try {
      console.log(result);
      if (result.status !== "successful" && result.status !== "completed") {
        console.log("result", result.status !== "completed");

        addNotification({
          message: result.status,
          error: false,
        });
        return;
      }
      await onApprove({
        paymentMethod: "Flutterwave",
        id: result.reference || result.transaction_id || result.tx_ref,
      });
    } catch (err) {
      console.log("fund ", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAbort = () => {
    setIsLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.context}>
      <View style={{ flex: 1 }}>
        <TextInput
          label="Enter Amount"
          value={`${amount}`}
          onChangeText={(amount) => setAmount(amount)}
          keyboardType="numeric"
          style={styles.input}
        />
      </View>
      <PayWithPaystack amount={parseFloat(amount)} onAprove={onApprove} />
      <View style={{ height: 10 }} />

      <PayWithFlutterwave
        onRedirect={handleOnRedirect}
        onAbort={handleAbort}
        options={{
          tx_ref: generateTransactionRef(10),
          authorization: API_KEY,
          customer: {
            email: user?.email || "",
            name: user?.username,
          },
          amount: parseFloat(amount),
          currency: "NGN",
          // payment_options: "card",
          customizations: {
            title: "Repeddle",
            description: "Funding wallet",
            logo: "https://res.cloudinary.com/emirace/image/upload/v1674796101/fundwallet_rgdi9s.jpg",
          },
          meta: {
            purpose: "Funding wallet",
            userId: user?._id,
            image:
              "https://res.cloudinary.com/emirace/image/upload/v1674796101/fundwallet_rgdi9s.jpg",
            description: "Adding money to my wallet",
          },
        }}
        customButton={(props) =>
          isLoading || isLoadingProp ? (
            <ActivityIndicator size={"large"} />
          ) : (
            <Button
              mode="contained"
              onPress={() => {
                setIsLoading(true);
                props.onPress();
              }}
              style={styles.fundButton}
            >
              Fund Wallet
            </Button>
          )
        }
      />
    </ScrollView>
  );
};

export default FundComp;

const styles = StyleSheet.create({
  context: { padding: 20, paddingVertical: 25, flex: 1 },
  input: {
    marginBottom: 20,
    width: "100%",
  },
  fundButton: {},
});

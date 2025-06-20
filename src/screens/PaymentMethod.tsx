import {
  Dimensions,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  Appbar,
  IconButton,
  Modal,
  RadioButton,
  Text,
  useTheme,
} from "react-native-paper";
import useCart from "../hooks/useCart";
import { PaymentMethodNavigationProp } from "../types/navigation/stack";
import { currency, region } from "../utils/common";
import { PaymentType } from "../contexts/CartContext";
import useToastNotification from "../hooks/useToastNotification";
import useWallet from "../hooks/useWallet";
import FundComp from "./wallet/FundComp";

type Props = PaymentMethodNavigationProp;

const PaymentMethod = ({ navigation }: Props) => {
  const { colors } = useTheme();
  const { total, paymentMethod, changePaymentMethod } = useCart();

  const { addNotification } = useToastNotification();
  const { wallet, fetchWallet } = useWallet();

  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const handleSubmit = () => {
    navigation.push("Checkout");
  };

  const handleFundSuccess = async () => {
    setIsLoading(true);
    await fetchWallet();
    setIsLoading(false);
    hideModal();
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  const handleClick = (val: string) => {
    const newVal = val as PaymentType;
    if (newVal === "Wallet" && (!wallet?.balance || wallet.balance < total)) {
      addNotification({ message: "Insufficient balance", error: true });
      return;
    }
    changePaymentMethod(newVal);
  };

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header
        mode="small"
        style={{
          justifyContent: "space-between",
          backgroundColor: colors.primary,
        }}
      >
        <Appbar.BackAction
          iconColor="white"
          onPress={() => navigation.goBack()}
        />
        <Appbar.Content
          titleStyle={{ color: "white" }}
          title="Payment Method"
        />
        <Appbar.Action iconColor="white" icon="magnify" />
      </Appbar.Header>

      <View style={{ flex: 1, justifyContent: "space-between", padding: 20 }}>
        <RadioButton.Group onValueChange={handleClick} value={paymentMethod}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <RadioButton.Item
              position="leading"
              label="Credit/Debit card"
              value="Card"
              style={{ paddingLeft: 0 }}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <RadioButton.Item
              position="leading"
              label={`Wallet (${currency(region())}${(
                wallet.balance || 0
              ).toFixed(2)})`}
              value="Wallet"
              style={{ paddingLeft: 0 }}
            />
          </View>
        </RadioButton.Group>
        <View style={{ flex: 1, marginLeft: 10 }}>
          {(wallet?.balance ?? 0) <= total && (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ color: "red", fontSize: 13 }}>
                Insufficient balance
              </Text>
              <Pressable onPress={showModal}>
                <Text style={{ color: colors.secondary, marginHorizontal: 20 }}>
                  Fund Wallet Now
                </Text>
              </Pressable>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            { marginVertical: 10, backgroundColor: colors.primary },
          ]}
          onPress={handleSubmit}
        >
          <Text style={{ color: "white", fontFamily: "chronicle-text-bold" }}>
            Continue
          </Text>
        </TouchableOpacity>
      </View>
      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={styles.containerStyle}
      >
        <IconButton
          icon="close"
          size={20}
          onPress={hideModal}
          style={{ position: "absolute", top: 10, right: 10 }}
        />
        <Text
          style={{
            fontFamily: "absential-sans-bold",
            fontSize: 20,
            textAlign: "center",
          }}
        >
          Fund Wallet
        </Text>
        <FundComp onSuccess={handleFundSuccess} isLoading={isLoading} />
      </Modal>
    </View>
  );
};

export default PaymentMethod;

type RadioProps = {
  label: string;
  paymentMethodName: string;
  onPress: () => void;
};

const Radio = ({ label, paymentMethodName, onPress }: RadioProps) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={() => {
        onPress();
      }}
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 10,
        paddingVertical: 5,
      }}
    >
      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: colors.primary,
          backgroundColor:
            paymentMethodName === label ? colors.primary : undefined,
        }}
      />
      <Text style={{ marginLeft: 20 }}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  title: {
    fontFamily: "absential-sans-bold",
    fontSize: 20,
    textTransform: "capitalize",
  },
  button: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  containerStyle: {
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 20,
    paddingTop: 30,
    minHeight: 260,
    maxWidth: Dimensions.get("window").width - 40,
    width: "100%",
    marginHorizontal: "auto",
  },
});

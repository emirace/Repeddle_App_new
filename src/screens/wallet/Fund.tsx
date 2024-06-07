import { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Text, TextInput, Button, Appbar } from "react-native-paper";
import { FundNavigationProp } from "../../types/navigation/stack";

const Fund: React.FC<FundNavigationProp> = ({ navigation }) => {
  const [amount, setAmount] = useState<string>("");

  const handleFundWallet = () => {
    if (amount === "" || isNaN(parseFloat(amount))) {
      Alert.alert("Invalid Amount", "Please enter a valid amount.");
      return;
    }
    // Handle the wallet funding logic here
    Alert.alert("Success", `Your wallet has been funded with ₦${amount}.`);
  };

  return (
    <View style={styles.container}>
      <Appbar.Header mode="large">
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Fund Wallet" />
        {/* <Appbar.Action icon="plus" onPress={() => {}} /> */}
        <Appbar.Action icon="history" onPress={() => {}} />
      </Appbar.Header>
      <View style={styles.context}>
        <View style={{ flex: 1 }}>
          <TextInput
            label="Enter Amount"
            value={`${amount}`}
            onChangeText={(amount) => setAmount(amount)}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>
        <Button
          mode="contained"
          onPress={handleFundWallet}
          style={styles.fundButton}
        >
          Fund Wallet
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  context: { padding: 20, flex: 1 },
  input: {
    marginBottom: 20,
  },
  fundButton: {},
});

export default Fund;

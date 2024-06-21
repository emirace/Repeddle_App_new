import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button, IconButton, useTheme } from "react-native-paper";

const Balance: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors } = useTheme();
  const [show, setShow] = useState(true);
  return (
    <View
      style={[styles.container, { backgroundColor: colors.elevation.level2 }]}
    >
      <View style={styles.balanceContainer}>
        <View style={styles.balanceTextContainer}>
          <IconButton icon="wallet" iconColor={colors.primary} size={20} />
          <Text style={styles.balanceLabel}>Current Repeddle Balance</Text>
          <IconButton
            icon={show ? "eye-outline" : "eye-off-outline"}
            size={20}
            onPress={() => setShow(!show)}
          />
        </View>
        <Text style={styles.balanceAmount}>
          {show ? "₦350000.50" : "*****"}
        </Text>
      </View>
      <Button
        mode="text"
        onPress={() => console.log("Transaction History Pressed")}
        style={styles.historyButton}
      >
        Transaction History
      </Button>
      <View style={styles.buttonCont}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate("Fund")}
          style={styles.addButton}
          textColor="white"
        >
          Fund Wallet
        </Button>
        <Button
          mode="contained"
          onPress={() => navigation.navigate("Withdraw")}
          style={[styles.addButton, { backgroundColor: colors.secondary }]}
          textColor="white"
        >
          Request Payout
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 10,
  },
  balanceContainer: {
    alignItems: "center",
  },
  balanceTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  balanceLabel: {
    fontSize: 18,
    marginLeft: 5,
  },
  balanceAmount: {
    fontSize: 30,
    fontWeight: "bold",
    height: 30,
    textAlign: "center",
  },
  historyButton: {
    marginVertical: 10,
  },
  buttonCont: {
    flexDirection: "row",
    gap: 10,
  },
  addButton: {
    flex: 1,
  },
});

export default Balance;

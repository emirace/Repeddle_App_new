import { StyleSheet, View } from "react-native";
import React from "react";
import { Icon, useTheme, Text, Button } from "react-native-paper";

const Success = ({ navigation }: any) => {
  const { colors } = useTheme();
  return (
    <View
      style={{
        alignItems: "center",
        marginTop: 40,
        paddingHorizontal: 20,
        flex: 1,
      }}
    >
      <Icon source={"check-circle"} size={50} color={colors.primary} />
      <Text style={{ fontSize: 30, fontWeight: "600" }}>
        Password reset successfully
      </Text>
      <Text style={styles.successText}>
        Password reset successfully. Login to continue
      </Text>
      <Button
        mode="contained"
        onPress={() => navigation.replace("Login")}
        style={styles.signInButton}
        uppercase
        contentStyle={{ height: 50 }}
        labelStyle={{ fontWeight: "800" }}
      >
        Login
      </Button>
    </View>
  );
};

export default Success;

const styles = StyleSheet.create({
  successText: {
    fontSize: 16,
    marginTop: 20,
    textAlign: "center",
  },

  signInButton: {
    marginTop: 16,
    borderRadius: 5,
  },
});

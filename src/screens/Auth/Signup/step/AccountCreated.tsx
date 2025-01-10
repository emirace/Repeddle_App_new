// Import necessary modules
import React from "react"
import { View, StyleSheet } from "react-native"
import { Button, Icon, Text } from "react-native-paper"

interface AccountCreatedProps {
  gotoLogin: () => void
}

const AccountCreated: React.FC<AccountCreatedProps> = ({ gotoLogin }) => {
  // Function to navigate to the login page
  const navigateToLogin = () => {
    gotoLogin()
  }

  return (
    <View style={styles.container}>
      <Icon source="account" size={50} />
      <Text style={styles.heading}>Account Created Successfully!</Text>
      <Text style={styles.instruction}>
        Please proceed to the login page to access your account.
      </Text>
      <Button
        mode="contained"
        onPress={navigateToLogin}
        style={styles.loginButton}
        uppercase
        contentStyle={{ height: 50 }}
        labelStyle={{ fontWeight: "800" }}
      >
        Go to Login
      </Button>
    </View>
  )
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 20,
  },
  instruction: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 30,
  },
  loginButton: {
    marginTop: 16,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff", // Adjust the color as needed
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default AccountCreated

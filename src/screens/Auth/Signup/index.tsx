import React, { useState } from "react"
import { View, StyleSheet, Image, ScrollView } from "react-native"
import {
  TextInput,
  Button,
  Text,
  useTheme,
  IconButton,
} from "react-native-paper"
import useAuth from "../../../hooks/useAuth"
import { SignUpNavigationProp } from "../../../types/navigation/stack"

interface Props {
  gotoLogin: () => void
  gotoToken: () => void
  email: string
  setEmail: (value: string) => void
}

const SignUp: React.FC<SignUpNavigationProp> = ({
  navigation: { navigate },
}) => {
  const { sendVerifyOtp, error: signInError } = useAuth()
  const { colors, dark } = useTheme()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")

  const handleSignIn = async () => {
    // Basic email validation
    if (!email.trim()) {
      setError("Please enter your email.")
    } else if (!isValidEmail(email)) {
      setError("Please enter a valid email address.")
    } else {
      setLoading(true)
      const result = await sendVerifyOtp({ email })
      if (result) {
        navigate("Step", { email: email.trim().toLowerCase() })
      } else {
        setError(signInError || "")
      }
      setLoading(false)
    }
  }

  const isValidEmail = (email: string): boolean => {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        source={
          dark
            ? require("../../../../assets/images/white_anime_logo.gif")
            : require("../../../../assets/images/black_anime_logo.gif")
        }
        style={styles.logo}
        alt="logo"
      />
      <View style={styles.content}>
        <Text style={styles.header}>Sign Up</Text>
        <Text style={styles.description}>Enter your email to sign up.</Text>
        <TextInput
          label="Email"
          value={email}
          onChangeText={(text) => {
            setEmail(text)
            setError("")
          }}
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
          // onFocus={handleOnFocus}
          // onBlur={handleOnBlur}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Button
          mode="contained"
          onPress={handleSignIn}
          style={styles.signInButton}
          uppercase
          contentStyle={{ height: 50 }}
          labelStyle={{ fontWeight: "800" }}
          loading={loading}
          disabled={loading}
        >
          Sign Up
        </Button>

        <Text style={styles.registerText}>
          Already have an account{" "}
          <Text
            style={{ color: colors.primary, fontWeight: "600" }}
            onPress={() => navigate("Login")}
          >
            Log in
          </Text>
        </Text>

        <View style={styles.socialIconsContainer}>
          <IconButton
            icon="facebook"
            size={28}
            iconColor={colors.primary}
            style={styles.socialIcon}
          />
          <IconButton
            icon="google-plus"
            size={28}
            iconColor={colors.primary}
            style={styles.socialIcon}
          />
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    // justifyContent: "center",
    // alignItems: "center",
    paddingTop: 50,
  },
  logo: {
    width: 100,
    height: 100,
    objectFit: "contain",
    marginBottom: 40,
    // position: "absolute",
    // top: 70,
    alignSelf: "center",
  },
  content: { width: "100%" },
  header: {
    fontSize: 28,
    fontFamily: "absential-sans-bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    opacity: 0.5,
    marginBottom: 30,
  },
  input: {
    marginBottom: 16,
  },
  signInButton: {
    marginTop: 16,
    borderRadius: 5,
  },
  errorText: {
    color: "red",
    marginBottom: 16,
  },
  registerText: { textAlign: "center", marginTop: 20 },
  socialIconsContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  socialIcon: {
    marginHorizontal: 10,
  },

  successText: {
    fontSize: 16,
    marginTop: 20,
    textAlign: "center",
  },
})

export default SignUp

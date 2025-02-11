import React, { useState, useCallback, useEffect } from "react"
import { View, StyleSheet, TouchableOpacity } from "react-native"
import {
  TextInput,
  Button,
  Text,
  useTheme,
  Modal,
  IconButton,
  Icon,
} from "react-native-paper"
import * as SecureStore from "expo-secure-store"
import useAuth from "../../hooks/useAuth"

const LoginModal: React.FC<{ navigation: any }> = ({ navigation }) => {
  const {
    login,
    error: loginError,
    authErrorModalOpen,
    setAuthErrorModalOpen,
    user,
  } = useAuth()
  const { colors } = useTheme()
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showEmail, setShowEmail] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  useEffect(() => {
    const getDetails = async () => {
      const storeUsername = await SecureStore.getItemAsync("username")
      const storeEmail = await SecureStore.getItemAsync("email")
      if (storeUsername) {
        setUsername(storeUsername)
      }
      if (storeEmail) {
        setEmail(storeEmail)
      }
      if (!storeEmail || !storeUsername) {
        setShowEmail(true)
      }
    }
    getDetails()
  }, [])

  useEffect(() => {
    if (!user) {
      setAuthErrorModalOpen(true)
    } else {
      setAuthErrorModalOpen(false)
    }
  }, [user])

  const handleNotUser = () => {
    setShowEmail(true)
    setEmail("")
    setUsername("")
  }

  const handleLogin = async () => {
    // Basic email and password validation
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.")
    } else if (!isValidEmail(email)) {
      setError("Please enter a valid email address.")
    } else {
      setLoading(true)
      const result = await login({ email, password })
      if (result) {
        setAuthErrorModalOpen(false)
      } else {
        setError(loginError || "")
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
    <Modal
      visible={authErrorModalOpen}
      // onDismiss={hideModal}
      contentContainerStyle={[
        {
          backgroundColor: colors.background,
          justifyContent: "center",
          alignItems: "center",
          // padding: 20,
          margin: 20,
          borderRadius: 10,
        },
      ]}
    >
      <View style={styles.container}>
        <View
          style={{
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <Icon source={"alert-circle-outline"} size={40} />
        </View>
        <Text style={styles.header}>Sign In</Text>
        <Text style={styles.description}>
          Your session has timed out.{" "}
          {!showEmail ? (
            <Text>
              If you want to continue as{" "}
              <Text
                style={{
                  color: colors.primary,
                  fontFamily: "absential-sans-bold",
                }}
              >
                {username}
              </Text>
              , please re-write your password.
            </Text>
          ) : (
            "Sign into your account"
          )}
        </Text>
        {showEmail && (
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
          />
        )}
        <TextInput
          label="Password"
          value={password}
          onChangeText={(text) => {
            setPassword(text)
            setError("")
          }}
          right={
            <TextInput.Icon
              icon={showPassword ? "eye-off" : "eye"}
              onPress={handleTogglePasswordVisibility}
            />
          }
          style={styles.input}
          secureTextEntry={!showPassword}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Button
          mode="contained"
          onPress={handleLogin}
          uppercase
          style={styles.loginButton}
          contentStyle={{ height: 50 }}
          labelStyle={{ fontWeight: "800" }}
          loading={loading}
          disabled={loading}
        >
          Sign in
        </Button>
        {!showEmail && (
          <TouchableOpacity onPress={handleNotUser}>
            <Text style={styles.forgotPasswordText}>Not {username}?</Text>
          </TouchableOpacity>
        )}

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
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    padding: 20,
  },
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
  loginButton: {
    marginTop: 16,
    borderRadius: 5,
  },
  errorText: {
    color: "red",
  },
  forgotPasswordText: {
    marginTop: 16,
    textAlign: "right",
    textDecorationLine: "underline",
    fontSize: 18,
  },
  socialIconsContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  socialIcon: {
    marginHorizontal: 10,
  },
})

export default LoginModal

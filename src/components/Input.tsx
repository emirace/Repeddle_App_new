import { Ionicons } from "@expo/vector-icons"
import React, { useState } from "react"
import { StyleSheet, TextInput, TextInputProps, View } from "react-native"
import { Text, useTheme } from "react-native-paper"
import { normaliseH } from "../utils/normalize"

type Props = TextInputProps & {
  icon?: keyof typeof Ionicons.glyphMap
  error?: string
  password?: boolean
  onFocus?: () => void
}

const Input = ({ error, onFocus, password, icon, ...props }: Props) => {
  const { colors } = useTheme()
  const [isFocus, setIsFocus] = useState(false)
  const [hidePassword, setHidePassword] = useState(password)

  return (
    <View style={[{ marginBottom: normaliseH(20) }]}>
      <View
        style={[
          styles.inputCont,
          {
            borderWidth: 1,
            borderRadius: 5,
            borderColor: error
              ? colors.error
              : isFocus
              ? colors.primary
              : colors.elevation.level2,
            backgroundColor: colors.elevation.level2,
          },
        ]}
      >
        <Ionicons
          style={styles.inputIcon}
          name={icon}
          size={20}
          color={colors.onBackground}
        />
        <TextInput
          secureTextEntry={hidePassword}
          style={[styles.TextInput]}
          autoCorrect={false}
          placeholderTextColor={colors.onBackground}
          onFocus={() => {
            onFocus && onFocus()
            setIsFocus(true)
          }}
          onBlur={() => setIsFocus(false)}
          {...props}
        />
        {password && (
          <Ionicons
            onPress={() => setHidePassword(!hidePassword)}
            style={styles.inputIcon}
            name={hidePassword ? "eye-outline" : "eye-off-outline"}
            size={20}
            color={colors.onBackground}
          />
        )}
      </View>
      {error && (
        <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
      )}
    </View>
  )
}

export default Input

const styles = StyleSheet.create({
  inputCont: {
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    width: "100%",
  },
  inputIcon: { padding: 10 },
  TextInput: { flex: 1, height: "100%", width: "100%" },
  error: { marginTop: 5, fontSize: 12 },
})

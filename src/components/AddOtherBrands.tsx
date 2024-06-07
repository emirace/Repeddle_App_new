import {
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import React, { useState } from "react"
import { Text, useTheme } from "react-native-paper"
import { Ionicons } from "@expo/vector-icons"
import useBrands from "../hooks/useBrand"
import useAuth from "../hooks/useAuth"

type Props = {
  setShowOtherBrand: (val: boolean) => void
  handleOnChange: (val: string, key: "brand") => void
}

const AddOtherBrands = ({ setShowOtherBrand, handleOnChange }: Props) => {
  const { colors } = useTheme()
  const { user } = useAuth()
  const { createBrand, error, loading } = useBrands()

  const [brand, setBrand] = useState("")
  const [err, setErr] = useState("")

  const addOtherBrand = async () => {
    const res = await createBrand({
      name: brand,
      published: user?.role === "Admin" ? true : false,
    })

    if (res) {
      handleOnChange(brand, "brand")

      setShowOtherBrand(false)
      return
    }
    setErr(error)
  }

  return (
    <View style={styles.modal}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <TouchableOpacity
          onPress={() => setShowOtherBrand(false)}
          style={{ position: "absolute", right: 20, top: 0 }}
        >
          <Ionicons name="close" color={colors.onBackground} size={20} />
        </TouchableOpacity>
        <View style={styles.item}>
          <Text style={styles.label}>Enter brand name</Text>
          <TextInput
            style={[
              styles.textInput,
              { color: colors.onBackground, borderColor: colors.onBackground },
            ]}
            onChangeText={(text) => setBrand(text)}
            onFocus={() => setErr("")}
          />
        </View>
        {err && <Text style={styles.error}>{err}</Text>}
        {loading ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <TouchableOpacity
            style={[styles.uploadButton, { backgroundColor: colors.primary }]}
            onPress={addOtherBrand}
          >
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default AddOtherBrands

const styles = StyleSheet.create({
  modal: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#00000090",
  },
  container: {
    padding: 30,
  },
  item: {
    flexDirection: "column",
  },
  label: {
    marginBottom: 5,
    fontSize: 14,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 5,
    width: 250,
    height: 40,
    padding: 10,
    marginBottom: 5,
  },
  error: {
    color: "red",
  },
  uploadButton: {
    marginTop: 5,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  buttonText: {
    color: "white",
  },
})

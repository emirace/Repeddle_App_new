import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native"
import React, { useState } from "react"
import { Button, Text, useTheme } from "react-native-paper"
import { Ionicons } from "@expo/vector-icons"
import useBrands from "../hooks/useBrand"
import useAuth from "../hooks/useAuth"
import useToastNotification from "../hooks/useToastNotification"

type Props = {
  setShowOtherBrand: (val: boolean) => void
  handleOnChange: (val: string, key: "brand") => void
}

const AddOtherBrands = ({ setShowOtherBrand, handleOnChange }: Props) => {
  const { colors } = useTheme()
  const { user } = useAuth()
  const { createBrand, error, loading } = useBrands()
  const { addNotification } = useToastNotification()

  const [brand, setBrand] = useState("")
  const [err, setErr] = useState("")

  const addOtherBrand = async () => {
    const res = await createBrand({
      name: brand,
      published: user?.role === "Admin" ? true : false,
    })

    if (res) {
      if (user?.role === "Admin") {
        addNotification({ message: "Brand has been added" })
      } else {
        addNotification({
          message: "Brand has been added and awaiting approval",
        })
      }

      handleOnChange(brand, "brand")
      setShowOtherBrand(false)
      setBrand("")
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
              {
                color: colors.onBackground,
                borderColor: colors.onBackground,
                width: "100%",
              },
            ]}
            onChangeText={(text) => setBrand(text)}
            onFocus={() => setErr("")}
          />
        </View>
        {err && <Text style={styles.error}>{err}</Text>}
        <Button
          loading={loading}
          style={[styles.uploadButton, { backgroundColor: colors.primary }]}
          mode="contained"
          children="Add"
          onPress={addOtherBrand}
        />
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

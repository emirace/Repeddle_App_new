import { FontAwesome5, Ionicons } from "@expo/vector-icons"
import React, { useState } from "react"
import { StyleSheet, Switch, TextInput, View } from "react-native"
import { Button, IconButton, Text, useTheme } from "react-native-paper"
import { IRebundle } from "../types/user"
import { currentAddress, goto, region } from "../utils/common"
import { getBackendErrorMessage } from "../utils/error"
import Tooltip from "./Tooltip"
import useAuth from "../hooks/useAuth"

type Props = {
  bundle: boolean
  setBundle: (val: boolean) => void
  setRebundleStatus: (val: boolean) => void
  rebundleStatus: boolean
}

const Rebundle = ({
  bundle,
  setBundle,
  rebundleStatus,
  setRebundleStatus,
}: Props) => {
  const { colors } = useTheme()
  const { updateUser } = useAuth()

  const [rebundleCount, setRebundleCount] = useState("")
  const [rebundleError, setRebundleError] = useState("")
  const [rebundleMessage, setRebundleMessage] = useState("")
  const [loadingRebundle, setLoadingRebundle] = useState(false)

  const toggleSwitch = (mode: boolean) => {
    if (mode) {
      setRebundleStatus(mode)
    } else {
      setRebundleStatus(mode)
      handleRebundle({ status: false, count: 0 })
      setBundle(false)
    }
  }

  const handleRebundle = async (value?: IRebundle) => {
    if (value) {
      // TODO: handle bundle
      setBundle(value.status)
      return
    }
    if (!rebundleCount) {
      setRebundleError("Enter the quantity of item(s) for Rebundle")
      return
    }
    setRebundleMessage("")
    try {
      setLoadingRebundle(true)
      // TODO: handle bundle
      await updateUser({ rebundle: value })
      setRebundleMessage("Redundle activated")
      setBundle(true)
      setLoadingRebundle(false)
    } catch (err) {
      setLoadingRebundle(false)
      console.log(getBackendErrorMessage(err))
    }
  }

  return (
    <View style={{ marginBottom: 25, marginTop: -15 }}>
      <View style={[styles.row, { justifyContent: "space-between" }]}>
        <View style={styles.row}>
          <FontAwesome5 name="truck" size={18} color={colors.onBackground} />
          <Text style={[styles.text]}>Rebundle</Text>
          <Tooltip
            content={`Re:bundle allows buyers to shop multiple items from your store and only pay for delivery once! The buyer will be charged delivery on their first purchase, and, if they make any additional purchases within the next 2 hours, free delivery will then automatically apply. Shops who enable bundling sell more and faster.  `}
          >
            <IconButton
              icon="help-circle-outline"
              size={18}
              iconColor={colors.onBackground}
              style={{ marginLeft: 10 }}
            />
          </Tooltip>
        </View>
        <Switch
          trackColor={{ false: "#767577", true: "#dedede" }}
          thumbColor={rebundleStatus ? colors.primary : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={rebundleStatus}
        />
      </View>
      {rebundleStatus &&
        (bundle ? (
          <Ionicons name="checkbox" size={24} color={colors.primary} />
        ) : (
          <View>
            <Text>
              Please input numbers of how many item(s) you are willing to pack
              in delivery bag(s) for a buyer when Rebundle is active
            </Text>

            <Text
              style={[styles.link, { color: colors.secondary }]}
              onPress={() => goto(`${currentAddress(region())}/rebundle`)}
            >
              More on Re:bundle
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1,
                borderRadius: 5,
                borderColor: colors.primary,
                backgroundColor: colors.elevation.level2,
              }}
            >
              <TextInput
                style={{
                  backgroundColor: colors.elevation.level2,
                  flex: 1,
                  height: 40,
                  paddingLeft: 10,
                  borderTopLeftRadius: 5,
                  borderBottomLeftRadius: 5,
                  color: colors.onBackground,
                }}
                placeholder="Add number of items"
                keyboardType="numeric"
                onChangeText={(text) => setRebundleCount(text)}
                onFocus={() => {
                  setRebundleError("")
                }}
              />

              <Button
                mode="contained"
                onPress={() => handleRebundle()}
                loading={loadingRebundle}
                style={[styles.button]}
              >
                Activate
              </Button>
            </View>
            {rebundleError ? (
              <Text style={{ color: "red" }}>{rebundleError}</Text>
            ) : null}
            {rebundleMessage ? (
              <Text style={{ color: "green" }}>{rebundleMessage}</Text>
            ) : null}
          </View>
        ))}
    </View>
  )
}

export default Rebundle

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    paddingHorizontal: 10,
  },
  button: {
    // padding: 5,
    paddingHorizontal: 10,
    height: 40,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  link: {
    fontSize: 14,
    textDecorationLine: "underline",
    marginVertical: 5,
  },
})

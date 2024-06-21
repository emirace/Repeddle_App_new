import { StyleSheet, View } from "react-native"
import React from "react"
import { Appbar, useTheme } from "react-native-paper"
import TopNavigation from "../../navigations/top"
import SoldReturn from "../../section/return/SoldReturn"
import PurchaseReturn from "../../section/return/PurchaseReturn"
import { ReturnNavigationProp } from "../../types/navigation/stack"

type Props = ReturnNavigationProp

const tabs = [
  {
    name: "Purchase",
    component: PurchaseReturn,
  },
  {
    name: "Sold",
    component: SoldReturn,
  },
]

const Return = ({ navigation }: Props) => {
  const { colors } = useTheme()
  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header
        mode="small"
        style={{
          justifyContent: "space-between",
          backgroundColor: colors.primary,
        }}
      >
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="My Returns" />
        <Appbar.Action
          icon="cart-outline"
          onPress={() => navigation.navigate("Cart")}
        />
      </Appbar.Header>
      <TopNavigation tabs={tabs} />
    </View>
  )
}

export default Return

const styles = StyleSheet.create({})

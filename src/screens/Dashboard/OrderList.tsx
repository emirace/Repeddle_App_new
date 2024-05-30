import { StyleSheet, Text, View } from "react-native"
import React from "react"
import { OrderListNavigationProp } from "../../types/navigation/stack"
import { Appbar, useTheme } from "react-native-paper"
import Purchase from "../../section/order/Purchase"
import Sold from "../../section/order/Sold"
import Returns from "../../section/order/Returns"
import TopNavigation from "../../navigations/top"

type Props = OrderListNavigationProp

const tabs = [
  {
    name: "Purchase",
    component: Purchase,
  },
  {
    name: "Sold",
    component: Sold,
  },
  {
    name: "Returns",
    component: Returns,
  },
]

const OrderList = ({ navigation }: Props) => {
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
        <Appbar.BackAction
          onPress={() => navigation.goBack()}
          color={colors.onBackground}
        />
        <Appbar.Content title="My Orders" />
        <Appbar.Action
          icon="cart-outline"
          color={colors.onBackground}
          onPress={() => navigation.navigate("Cart")}
        />
      </Appbar.Header>
      <TopNavigation tabs={tabs} />
    </View>
  )
}

export default OrderList

const styles = StyleSheet.create({})

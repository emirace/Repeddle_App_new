import { StyleSheet, Text, View } from "react-native"
import React from "react"
import { OrderListNavigationProp } from "../../types/navigation/stack"
import { Appbar, useTheme } from "react-native-paper"
import Purchase from "../../section/order/Purchase"
import Sold from "../../section/order/Sold"
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
          iconColor="white"
          onPress={() => navigation.goBack()}
        />
        <Appbar.Content title="My Orders" titleStyle={{ color: "white" }} />
        <Appbar.Action
          icon="cart-outline"
          onPress={() => navigation.push("Cart")}
          iconColor="white"
        />
      </Appbar.Header>
      <TopNavigation tabs={tabs} />
    </View>
  )
}

export default OrderList

const styles = StyleSheet.create({})

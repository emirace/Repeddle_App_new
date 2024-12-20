import { StyleSheet, Text, View } from "react-native"
import React from "react"
import { OrderListNavigationProp } from "../../types/navigation/stack"
import { Appbar, useTheme } from "react-native-paper"
import Purchase from "../../section/order/Purchase"
import Sold from "../../section/order/Sold"
import TopNavigation from "../../navigations/top"
import CartIcon from "../../components/ui/cartIcon"

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
        <Appbar.Content
          style={{ flex: 0 }}
          title={
            <View>
              <CartIcon
                iconColor="white"
                onPress={() => navigation.push("Cart")}
              />
            </View>
          }
        />
      </Appbar.Header>
      <TopNavigation tabs={tabs} />
    </View>
  )
}

export default OrderList

const styles = StyleSheet.create({})

import React from "react"
import { EarningsNavigationProp } from "../../types/navigation/stack"
import { View } from "react-native"
import { Appbar, useTheme } from "react-native-paper"
import CartIcon from "../../components/ui/cartIcon"
import EarningNavigation from "../../section/earnings/EarningTopNavigation"

type Props = EarningsNavigationProp

const Earnings = ({ navigation }: Props) => {
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
        <Appbar.Content titleStyle={{ color: "white" }} title="Earnings" />
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
      <EarningNavigation />
    </View>
  )
}

export default Earnings

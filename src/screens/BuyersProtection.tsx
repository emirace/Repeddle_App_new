import { StyleSheet, View } from "react-native"
import React from "react"
import { Appbar, Text, useTheme } from "react-native-paper"
import { normaliseH } from "../utils/normalize"
import { goto } from "../utils/common"
import { BuyersProtectionNavigationProp } from "../types/navigation/stack"

type Props = BuyersProtectionNavigationProp

const BuyersProtection = ({ navigation }: Props) => {
  const { colors } = useTheme()
  return (
    <View style={styles.container}>
      <Appbar.Header
        mode="small"
        style={{
          justifyContent: "space-between",
          backgroundColor: colors.primary,
        }}
      >
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="My Orders" />
        <Appbar.Action
          icon="cart-outline"
          onPress={() => navigation.navigate("Cart")}
        />
      </Appbar.Header>
      <View style={styles.body}>
        <Text style={[styles.heading]}>BUYER'S PROTECTION</Text>
        <Text style={[styles.bodyText]}>
          With our Repeddle buyer’s protection, if you make a purchase
          COMPLETELY within Repeddle App or Website using ADD TO CART and
          checkout, and the product is remarkably not as described or doesn’t
          arrive as a result of seller not sending your product or seller’s
          negligent (and not yours), we will refund you in full including
          delivery fee, otherwise all sale is final. Please have a look at our
          refund policy
          <Text
            style={{ color: colors.primary }}
            onPress={() => goto("https://repeddle.com/returns")}
          >
            {" "}
            here.
          </Text>{" "}
          Any payment made outside our App or Website will not be covered by the
          buyer’s protection. When you purchase a product on our App or Website
          we transfer the money to the seller’s account ONLY when the buyer
          confirms receipt of the product. Repeddle buyer’s protection by
          default covers all Repeddle user/community members that complete their
          purchase through repeddle App or Website using the add to cart button
          and checkout.
        </Text>
        <Text style={[styles.heading]}>SELLER'S PROTECTION</Text>
        <Text style={[styles.bodyText]}>
          Seller’s don’t have to worry about not getting paid. After a
          successful sell of a product inside Repeddle’s App or website, the
          money is automatically deposited to Repeddle and we will transfer the
          money to seller’s Repeddle Wallet after buyer confirmed the receipt of
          the seller’s product. You can either decide to use the money for other
          purchase to resell on Repeddle or transfer it directly to your
          provided bank account. The Repeddle protection by default cover
          sellers of all levels that successfully completes their entire sale
          transaction inside Repeddle App or Website. To find out more about
          payment turn around period, see our refund policy{" "}
          <Text
            style={{ color: colors.primary }}
            onPress={() => goto("https://repeddle.com/returns")}
          >
            here.
          </Text>
        </Text>
      </View>
    </View>
  )
}

export default BuyersProtection

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  title: { fontWeight: "bold", fontSize: 20, textTransform: "capitalize" },
  body: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 20,
  },
  heading: { fontSize: 20, fontWeight: "bold", marginVertical: 10 },
  bodyText: {
    textAlign: "justify",
    lineHeight: 20,
  },
})

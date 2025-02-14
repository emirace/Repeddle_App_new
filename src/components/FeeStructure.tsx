import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native"
import React from "react"
import { IconButton, Text, useTheme } from "react-native-paper"
import { currentAddress, goto, region } from "../utils/common"

type Props = {
  setShowFeeStructure: (val: boolean) => void
}

const FeeStructure = ({ setShowFeeStructure }: Props) => {
  const { colors } = useTheme()

  return (
    <View style={{ flex: 1 }}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={() => setShowFeeStructure(false)}>
          <IconButton icon="chevron-back" />
        </TouchableOpacity>
        <View style={{ height: 40, width: 40 }} />
        <View style={{ height: 40, width: 40 }} />
      </View>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <Text style={{ textAlign: "center", fontSize: 18 }}>
          HOW REPEDDLE COMMISSION WORKS
        </Text>
        <Text style={styles.redTitle}>OUR COMMISSION EXPLAINED</Text>
        <Text style={styles.paragraph}>
          Here’s how our fee structure works to help you understand what you
          could earn and decides how you should mark your price.
        </Text>
        <Text style={styles.paragraph}>
          To give you unmatched user experience and support the growth of your
          business as part of our thrift secondhand community, you will not be
          charged <Text style={styles.boldText}>Repeddle commission.</Text> The
          only charge that will be due to you is the{" "}
          <Text style={styles.boldText}>payment platform processing fee.</Text>
          These fees are entirely up to the payment platform. Repeddle does not
          have any say or take in these charges whatsoever. The payment
          processing fee, up to 5% of the total transaction amount, depending on
          the payment platform, will be applied to a successfully completed
          checkout.
        </Text>
        <Text style={styles.paragraph}>
          After the grace period (30th November 2022) of selling (thrifting)
          your secondhand products completely free of{" "}
          <Text style={styles.boldText}>Repeddle Commission,</Text> when you
          have successfully sold your product on Repeddle, we will deduct a
          commission fee of only <Text style={styles.boldText}>7.9%</Text>{" "}
          (includes payment processing fee) on the total transaction (including
          shipment).
        </Text>
        <Text style={styles.redTitle}>HERE’S THE ENTIRE FEES BREAKDOWN</Text>
        <Text>Repeddle Commission: 2.9%</Text>
        <Text>Payment processing fee: 5%</Text>
        <Text>Total commission: 7.9%</Text>
        <Text style={styles.paragraph}>
          Total commission is applied against the total amount of a successful
          checkout of EACH product(s) including shipment that the buyer paid
          for. Once the transaction is complete and you send your product to the
          buyer and the buyer confirms they received your delivery, we will pay
          your balance into your Repeddle wallet. You can decide to use your
          earnings within the Repeddle app and website or transfer them into
          your provided bank account.
        </Text>
        <Text>THE ENTIRE FEE CHARGED IS DIVIDED INTO TWO PARTS:</Text>
        <Text>
          1. 2.9% Repeddle commission; Aid us to continue supporting the growth
          of your business and giving you great and seamless user experience
          with access to all the functionality and resources available in
          Repeddle app and website.
        </Text>
        <Text>
          2. 5% Payment Processing fee; The payment processing fee is paid to
          payment providers available on our platform which enables them to
          offer you a safe and secure payment experience.
        </Text>
        <Text style={styles.boldText}>
          There are no Setup, Signup, Adding product, Monthly or Hidden fees.
        </Text>
        <Text style={styles.redTitle}>
          ESTIMATED CALCULATION EXAMPLE MADE FOR YOU!
        </Text>
        <Text>
          This gives you an idea of what your earning looks like based on the
          listed price of your product, your delivery choice, and our
          commission.
        </Text>
        <Text style={styles.boldText}>
          Say a successful purchase is made in{" "}
          <Text style={styles.redText}>Nigeria</Text>
        </Text>
        <Text>- Your Product listed price is NGN 300</Text>
        <Text>- Shipping cost to the buyer is NGN 59</Text>
        <Text>- Total cost we charge the buyer is NGN 359</Text>
        <Text>
          - 7.9% Commission fee applied to the total amount paid by the buyer is
          NGN 28.37
        </Text>
        <Text>
          - The total earning we will send to your Repeddle wallet or your bank
          account is = NGN 330.63
        </Text>
        <Text style={styles.boldText}>
          Say a successful purchase is made in{" "}
          <Text style={styles.redText}>South Africa</Text>
        </Text>
        <Text>- Your Product listed price is R 300</Text>
        <Text>- Shipping cost to the buyer is R 59</Text>
        <Text>- Total cost we charge the buyer is R 359</Text>
        <Text>
          - 7.9% Commission fee applied to the total amount paid by the buyer is
          R 28.37
        </Text>
        <Text>
          - The total earning we will send to your Repeddle wallet or your bank
          account is = R 330.63
        </Text>
        <Text style={styles.redTitle}>HELPING YOU MARK YOUR PRICE</Text>
        <Text>
          While we want you to have fun doing what you love doing best, we also
          prioritize that your business generates a profit for you. Hence, we
          came up with a strategy to help you make a good price marking of your
          product.
        </Text>
        <Text>
          - Before you mark a price on your product, consider factoring in all
          the expenses incurred in the process.
        </Text>
        <Text>
          - Your expenditure may also include the commission charged on any
          thrift or secondhand online platform you sell your product; In this
          case, "Repeddle app and website".
        </Text>
        <Text>
          - Then add all the expenditures, including the cost of the purchase of
          your product or the current market value.
        </Text>
        <Text>
          - Then you will have the total price to list your products on Repeddle
          app and website.
        </Text>
        <Text>
          - Finally, when your product is sold "thrifted," you're expected to
          make the full total estimated amount you intend to sell your product,
          back in your <Text style={styles.redText}>Repeddle Wallet</Text> or
          bank account.
        </Text>
        <Text>
          <Text style={styles.redText}>NOTE:</Text> We do not currently offer
          cross-border sales. Example: If you’re located in Nigeria and your
          product is listed in Nigeria, you will only sell to buyers within
          Nigeria. Viś-à-viś to sellers and buyers in South Africa.
        </Text>
        <Text style={styles.redTitle}>
          WONDERING WHY YOU NEED TO PAY COMMISSION? HERE’S WHY
        </Text>
        <Text>
          <Text style={styles.boldText}>App or Website Infrastructure:</Text>{" "}
          Our infrastructure is built with tools to support your business
          growth. To maintain this infrastructure, there’s a lot that goes on
          behind the scenes. We use the 2.9% Repeddle commission fee to offset
          the monthly maintenance fee that is required to keep these
          infrastructure running smoothly.
        </Text>
        <Text>
          <Text style={styles.boldText}>Marketing:</Text> For a business to
          thrive, it requires aggressive consistent marketing. Our aim is for
          your business to succeed, whether you do it as a side hustle or
          full-time. We prioritize your growth and are currently subsidizing Ad
          campaigns we run so your store and real products get to the right hand
          and find a new home.
        </Text>
        <Text>
          <Text style={styles.boldText}>Support system:</Text> Our customer
          support system is active and accessible at all times to you, so you
          get all the information, insights, and education you need to scale
          your business while having a great experience using Repeddle’s app and
          website.
        </Text>
        <Text>
          <Text style={styles.boldText}>Delivery:</Text> Repeddle provides you
          with hassle-free, easy, and a click-away delivery options integrated
          into our app and website to choose from. You have the choice to choose
          which delivery option(s) is convenient for you that you offer to
          buyers. With the delivery options you have initiated, buyers will
          choose what’s also convenient for them, both in time and cost. These
          give you more selling opportunities.
        </Text>
        <Text>
          <Text style={styles.boldText}>Payments:</Text> Unlike other platforms,
          Repeddle offers you different payment options that are convenient,
          secure, and reliable for you to choose from. These payment processing
          platforms charge up to 5% of the total amount for every transaction
          that goes through your seller's account/dashboard. 5% of the 7.9% we
          charge covers this fee.
        </Text>
        <Text>
          In summary, the more you sell, the better your opportunity and chances
          to earn more with our reward programs and free membership VIP
          prioritization. For you to make it to our{" "}
          <Text style={styles.redText}>PRIORITY LIST</Text> and get verified
          with <Text style={styles.redText}>VIP SHIELD</Text>, your sale and
          earnings need to be higher in number than other users + your total
          profile reviews + star ratings. Read more about our reward programs
          and how we calculate our verification shield approval{" "}
          <Text
            style={[styles.link, { color: colors.secondary }]}
            onPress={() => goto(`${currentAddress(region())}/vipshield`)}
          >
            here
          </Text>
          .
        </Text>
        <View
          style={{
            justifyContent: "center",
            paddingBottom: 40,
            flexDirection: "row",
          }}
        >
          <Text
            style={styles.redTitle1}
            onPress={() => goto(`${currentAddress(region())}/newproduct`)}
            numberOfLines={1}
          >
            LIST A PRODUCT TO START SELLING TODAY!
          </Text>
        </View>
      </ScrollView>
    </View>
  )
}

export default FeeStructure

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  paragraph: {
    textAlign: "justify",
  },
  link: {
    textDecorationLine: "underline",
  },
  redTitle: {
    fontSize: 18,
    width: "100%",
    color: "red",
    marginTop: 15,
    lineHeight: 25,
  },

  redTitle1: {
    fontSize: 15,
    fontFamily: "absential-sans-bold",
    color: "red",
    marginTop: 15,
    textDecorationLine: "underline",
  },
  boldText: {
    fontFamily: "chronicle-text-bold",
  },
  redText: {
    color: "red",
  },
})

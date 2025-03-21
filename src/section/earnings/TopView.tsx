import { View } from "react-native"
import { Text, useTheme } from "react-native-paper"
import { styles } from "./styles"
import Tooltip from "../../components/Tooltip"
import { Ionicons } from "@expo/vector-icons"
import { currency, region } from "../../utils/common"
import Chart from "../../components/Chart"

type Props = {
  totalSales: number
  orderData: {
    name: string
    order: number
    earning: number
    totalSale: number
  }[]
}

const TopView = ({ totalSales, orderData }: Props) => {
  const { colors } = useTheme()
  return (
    <>
      <View
        style={{
          paddingVertical: 5,
          borderRadius: 5,
          paddingHorizontal: 10,
          marginTop: 20,
        }}
      >
        <View
          style={[
            styles.earnCont,
            { backgroundColor: colors.elevation.level2 },
          ]}
        >
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.label, { color: colors.onBackground }]}>
              Your Total earnings
            </Text>
            <Tooltip
              content="Your total earnings is the total (price) amount of your sold product inclusive
                expenses and net."
            >
              <Ionicons
                name="help-circle-outline"
                size={20}
                color={colors.onBackground}
              />
            </Tooltip>
          </View>
          <Text style={[styles.earning, { color: colors.onBackground }]}>
            {currency(region())}
            {totalSales.toFixed(2)}
          </Text>
        </View>
        <View style={[styles.earnCont, { backgroundColor: colors.secondary }]}>
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.label, { color: colors.onBackground }]}>
              Expenses (7.9%)
            </Text>
            <Tooltip
              content="Expenses is Repeddle commission charged against your total earnings that’s less
              when a sale is successfully completed and paid for."
            >
              <Ionicons
                name="help-circle-outline"
                size={20}
                color={colors.onBackground}
              />
            </Tooltip>
          </View>
          <Text style={[styles.earning, { color: "white" }]}>
            -{currency(region())}
            {((totalSales * 7.9) / 100).toFixed(2)}
          </Text>
        </View>
        <View style={[styles.earnCont, { backgroundColor: colors.primary }]}>
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.label, { color: colors.onBackground }]}>
              Your Net Earnings
            </Text>

            <Tooltip
              content="Net earnings is your actual withdrawable balance you receive into your Repeddle
              wallet. I.E. Total Earnings (- minus) Expenses (=) Net earnings."
            >
              <Ionicons
                name="help-circle-outline"
                size={20}
                color={colors.onBackground}
              />
            </Tooltip>
          </View>
          <Text style={[styles.earning, { color: "white" }]}>
            {currency(region())}
            {((totalSales * 92.1) / 100).toFixed(2)}
          </Text>
        </View>
      </View>
      <Chart data={orderData} />
      <Text style={[styles.salesHeader, { color: colors.onBackground }]}>
        Sales Order History
      </Text>
      <View
        style={[
          styles.tableHeader,
          { backgroundColor: colors.elevation.level2 },
        ]}
      >
        <Text
          style={[styles.tableHead, { flex: 2, color: colors.onBackground }]}
        >
          Items
        </Text>
        <Text style={[styles.tableHead, { color: colors.onBackground }]}>
          Price
        </Text>
        <Text style={[styles.tableHead, { color: colors.onBackground }]}>
          Action
        </Text>
      </View>
    </>
  )
}

export default TopView

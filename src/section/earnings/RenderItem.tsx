import { useNavigation } from "@react-navigation/native"
import { Text, useTheme } from "react-native-paper"
import { EarningsNavigationProp } from "../../types/navigation/stack"
import { styles } from "./styles"
import { Image, TouchableOpacity, View } from "react-native"
import { IOrder } from "../../types/order"
import { currency, region } from "../../utils/common"

type Props = {
  item: IOrder
}

const RenderItem = ({ item }: Props) => {
  const { colors } = useTheme()
  const navigation = useNavigation<EarningsNavigationProp["navigation"]>()

  return (
    <View
      style={[styles.itemCont, { borderBottomColor: colors.elevation.level2 }]}
    >
      <View style={{ flex: 2, flexDirection: "row", alignItems: "center" }}>
        <Image
          source={{
            uri: item.items[0].product.images[0],
          }}
          style={styles.image}
        />
        <Text
          style={{ marginLeft: 10, width: 100, color: colors.onBackground }}
          numberOfLines={1}
        >
          {item.items[0].product.name}
        </Text>
      </View>
      <Text style={{ flex: 1, color: colors.onBackground }}>
        {currency(region())}
        {item.totalAmount.toFixed(2)}
      </Text>
      <View style={{ flex: 1, alignItems: "flex-start" }}>
        <TouchableOpacity
          style={[
            { flex: 1, backgroundColor: colors.elevation.level3 },
            styles.view,
          ]}
          onPress={() => navigation.navigate("OrderDetails", { id: item._id })}
        >
          <Text style={{ color: colors.primary }}>View</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default RenderItem

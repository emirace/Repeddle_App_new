import {
  FlatList,
  Image,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import React, { useEffect, useState } from "react"
import { Text, useTheme } from "react-native-paper"
import useOrder from "../../hooks/useOrder"
import { useNavigation } from "@react-navigation/native"
import { OrderListNavigationProp } from "../../types/navigation/stack"
import { currency, region } from "../../utils/common"
import { IOrder } from "../../types/order"
import moment from "moment"
import Loader from "../../components/ui/Loader"
import { baseURL } from "../../services/api"
import useToastNotification from "../../hooks/useToastNotification"

type Props = {}

const Sold = (props: Props) => {
  const { colors } = useTheme()
  const { loading, fetchSoldOrders, error } = useOrder()
  const { addNotification } = useToastNotification()

  const [orders, setOrders] = useState<IOrder[]>([])

  const navigation = useNavigation<OrderListNavigationProp["navigation"]>()

  useEffect(() => {
    const getData = async () => {
      const res = await fetchSoldOrders()
      if (res) {
        setOrders([...res])
      } else {
        addNotification({ message: error, error: true })
      }
    }

    getData()
  }, [])

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <Loader />
      ) : !orders.length ? (
        <View style={{ alignItems: "center", paddingVertical: 20 }}>
          <Text style={{ fontSize: 15, fontWeight: "500" }}>
            You have not sold any item 💰{" "}
            <Text
              onPress={() => navigation.push("Sell")}
              style={{ color: colors.secondary, fontWeight: "bold" }}
            >
              Sell
            </Text>
          </Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={({ item }) => (
            <RenderItem item={item} navigation={navigation} />
          )}
          keyExtractor={(_, index) => index.toString()}
          ListHeaderComponent={() => <TopView />}
        />
      )}
    </View>
  )
}

export default Sold

const RenderItem = ({
  item,
  navigation,
}: {
  item: IOrder
  navigation: OrderListNavigationProp["navigation"]
}) => {
  const { colors } = useTheme()

  return (
    <View
      key={item._id}
      style={[
        styles.orderContainer,
        { backgroundColor: colors.elevation.level1 },
      ]}
    >
      <Image
        style={styles.orderImage}
        source={{ uri: baseURL + item.items[0].product.images[0] }}
        alt={item.items[0].product.name}
      />
      <View style={styles.orderDetailsCont}>
        <View>
          <Text style={styles.orderName} numberOfLines={1}>
            {item.items[0].product.name}
          </Text>
          <Text style={[styles.orderId, { color: colors.outline }]}>
            order {item._id}
          </Text>
        </View>
        <View>
          <Text style={{ fontSize: 13 }}>
            {item.items[0].deliveryTracking.currentStatus.status}
          </Text>
          <Text>
            {moment(
              item.items[0].deliveryTracking.history[
                item.items[0].deliveryTracking.history.length - 1
              ].timestamp
            ).format("MMM DD YY, h:mm a")}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => navigation.push("OrderDetails", { id: item._id })}
      >
        <Text style={[styles.orderDetail, { color: colors.primary }]}>
          See Details
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const TopView = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<IOrder[]>([])
  const [isSearchVisible, setIsSearchVisible] = useState(false)

  const { colors } = useTheme()

  const navigation = useNavigation<OrderListNavigationProp["navigation"]>()

  return (
    <View>
      <TouchableOpacity
        onPress={() => setIsSearchVisible(true)}
        style={styles.searchButton}
      >
        <Text style={{ color: "grey" }}>Search</Text>
      </TouchableOpacity>
      <Modal visible={isSearchVisible} animationType="fade" transparent={true}>
        <View style={styles.overlay}>
          <View style={styles.searchContainer}>
            <TextInput
              placeholder="Search"
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)}
              style={styles.searchInput}
              placeholderTextColor="rgba(225,225,225,1)"
            />
            <TouchableOpacity
              onPress={() => {
                setIsSearchVisible(false)
                setSearchQuery("")
                setSearchResults([])
              }}
            >
              <Text style={{ color: colors.secondary }}>Close</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.resultsContainer}>
            <FlatList
              data={searchResults}
              renderItem={({ index, item }) => (
                <RenderProductItem
                  index={index}
                  item={item}
                  navigation={navigation}
                />
              )}
              keyExtractor={(item) => item._id.toString()}
            />
          </View>
        </View>
      </Modal>
    </View>
  )
}

const RenderProductItem = ({
  item,
  index,
  navigation,
}: {
  item: IOrder
  index: number
  navigation: OrderListNavigationProp["navigation"]
}) => {
  const { colors } = useTheme()
  const backgroundColor = index % 2 === 0 ? colors.elevation.level2 : "white"
  return (
    <TouchableOpacity
      style={[styles.productItem, { backgroundColor }]}
      onPress={() => navigation.push("OrderDetails", { id: item._id })}
    >
      <Text>{item.items[0].product.name}</Text>
      <Text>
        {currency(region())}
        {item.totalAmount}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  searchButton: {
    height: 40,
    // width: '100%',
    margin: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "grey",
    padding: 5,
    // alignItems: 'center',
    justifyContent: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  searchContainer: {
    // backgroundColor: COLOR.orange,
    // borderRadius: 10,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 10,
    borderColor: "white",
    color: "white",
  },
  resultsContainer: { flex: 1, padding: 10 },
  productItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 5,
    // borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
  orderContainer: {
    marginTop: 20,
    gap: 10,
    flexDirection: "row",
    padding: 10,
    paddingBottom: 15,
  },
  orderImage: {
    height: "100%",
    aspectRatio: 1,
    objectFit: "cover",
    maxWidth: 100,
    borderRadius: 2,
  },
  orderDetailsCont: {
    gap: 12,
    flex: 1,
  },
  orderName: {
    textTransform: "capitalize",
    fontWeight: "semibold",
    fontSize: 17,
  },
  orderId: {
    fontSize: 14,
  },
  orderDetail: {
    padding: 4,
    textTransform: "uppercase",
    fontWeight: "semibold",
  },
})

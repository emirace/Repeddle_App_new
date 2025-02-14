import {
  FlatList,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import React from "react"
import { IconButton, Text, useTheme } from "react-native-paper"
import { IReturn } from "../../types/order"
import moment from "moment"
import {
  ReturnFormNavigationProp,
  ReturnNavigationProp,
} from "../../types/navigation/stack"
import { Ionicons } from "@expo/vector-icons"
import Loader from "../../components/ui/Loader"
import { baseURL } from "../../services/api"

type Props = {
  loading: boolean
  returns: IReturn[]
  error?: string
  navigation: ReturnFormNavigationProp["navigation"]
}

const ReturnComp = ({ loading, returns, error, navigation }: Props) => {
  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <Loader />
      ) : error ? (
        <Text>{error}</Text>
      ) : !returns.length ? (
        <View style={{ alignItems: "center", paddingVertical: 20 }}>
          <Text style={{ fontSize: 15, fontWeight: "500" }}>
            You have no returns🙂
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={returns}
            renderItem={({ item }) => (
              <RenderItem item={item} navigation={navigation} />
            )}
            keyExtractor={(item) => item._id}
            style={styles.listContainer}
            ListHeaderComponent={topView}
          />
        </>
      )}
    </View>
  )
}

const RenderItem = ({
  item,
  navigation,
}: {
  item: IReturn
  navigation: ReturnFormNavigationProp["navigation"]
}) => {
  console.log(item.productId)

  return (
    <TouchableOpacity
      onPress={() => navigation.push("ReturnDetail", { id: item._id })}
      style={styles.itemContainer}
    >
      {item.productId.images.length ? (
        <Image
          style={styles.itemImage}
          source={{ uri: baseURL + item.productId.images[0] }}
        />
      ) : (
        <View style={{ width: 50, height: 50, marginRight: 20 }} />
      )}
      <View style={styles.itemDetailsContainer}>
        <Text style={styles.itemName} numberOfLines={1}>
          {item.productId.name}
        </Text>
        <Text style={styles.itemDate}>
          {moment(item.createdAt).format("MMM DD YY, h:mm a")}
        </Text>
      </View>

      <IconButton icon={"chevron-right"} />
    </TouchableOpacity>
  )
}

const topView = () => {
  const { colors } = useTheme()
  return (
    <View style={{ marginBottom: 10 }}>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search"
          // value={searchQuery}
          // onChangeText={(text) => setSearchQuery(text)}
          style={[
            styles.searchInput,
            {
              color: colors.onBackground,
              // backgroundColor: colors.primaryContainer,
              borderWidth: 1,
              borderColor: "grey",
            },
          ]}
          placeholderTextColor={colors.onBackground}
        />
        <Ionicons name="search" size={20} style={styles.searchIcon} />
      </View>
    </View>
  )
}

export default ReturnComp

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  searchIcon: {
    position: "absolute",
    left: 12,
    top: "30%",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0,
  },
  searchInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
    borderRadius: 20,
    paddingLeft: 38,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    // paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemImage: {
    width: 50,
    height: 50,
    marginRight: 20,
    borderRadius: 25,
  },
  itemDetailsContainer: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontFamily: "absential-sans-bold",
    color: "#333",
  },
  itemDate: {
    fontSize: 12,
    color: "#888",
  },
  viewDetailsButton: {
    backgroundColor: "#f39c12",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  viewDetailsButtonText: {
    color: "#fff",
    fontFamily: "chronicle-text-bold",
  },
})

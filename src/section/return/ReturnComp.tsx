import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import React from "react"
import { Text, useTheme } from "react-native-paper"
import { IReturn } from "../../types/order"
import moment from "moment"
import { useNavigation } from "@react-navigation/native"
import { ReturnNavigationProp } from "../../types/navigation/stack"
import { Ionicons } from "@expo/vector-icons"

type Props = {
  loading: boolean
  returns: IReturn[]
  error?: string
}

const ReturnComp = ({ loading, returns, error }: Props) => {
  const { colors } = useTheme()

  return (
    <View>
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
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
            renderItem={({ item }) => <RenderItem item={item} />}
            keyExtractor={(item) => item._id}
            style={styles.listContainer}
            ListHeaderComponent={topView}
          />
        </>
      )}
    </View>
  )
}

const RenderItem = ({ item }: { item: IReturn }) => {
  const { navigation } = useNavigation<ReturnNavigationProp>()

  return (
    <View style={styles.itemContainer}>
      {item.image ? (
        <Image
          style={styles.itemImage}
          source={{ uri: item.productId.images[0] }}
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

      <TouchableOpacity
        style={styles.viewDetailsButton}
        onPress={() => navigation.push("ReturnDetail", { id: item._id })}
      >
        <Text style={styles.viewDetailsButtonText}>View Details</Text>
      </TouchableOpacity>
    </View>
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
              backgroundColor: colors.primaryContainer,
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
    fontWeight: "bold",
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
    fontWeight: "bold",
  },
})

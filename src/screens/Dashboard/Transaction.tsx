import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import React, { useEffect, useState } from "react"
import { Appbar, Divider, Text, useTheme } from "react-native-paper"
import useTransactions from "../../hooks/useTransaction"
import MyButton from "../../components/MyButton"
import { useNavigation } from "@react-navigation/native"
import { TransactionNavigationProp } from "../../types/navigation/stack"
import { ITransaction } from "../../types/transactions"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import moment from "moment"
import { createSearchParam, currency, region } from "../../utils/common"

type Props = TransactionNavigationProp

const Transaction = ({ navigation }: Props) => {
  const { colors } = useTheme()
  const { error, transactions, loading, fetchUserTransactions } =
    useTransactions()

  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const string = createSearchParam([
      ["page", page.toString()],
      ["transactionId", searchQuery],
    ])

    fetchUserTransactions(string)
  }, [page, searchQuery])

  const handleMore = () => {
    // add if pagination
    // if (hasMore){
    //   setPage(page+1)
    // }
  }

  return (
    <View>
      <Appbar.Header
        mode="small"
        style={{
          justifyContent: "space-between",
          backgroundColor: colors.primary,
        }}
      >
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Transactions" />
        <Appbar.Action
          icon="cart-outline"
          onPress={() => navigation.push("Cart")}
        />
      </Appbar.Header>
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : error ? (
        <Text>{error}</Text>
      ) : !transactions.length ? (
        <View style={{ alignItems: "center", paddingVertical: 20 }}>
          <Text style={{ fontSize: 15, fontWeight: "500" }}>
            No transaction yet
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={transactions}
            renderItem={({ item }) => <RenderItem item={item} />}
            keyExtractor={(item) => item.toString()}
            style={styles.listContainer}
            contentContainerStyle={{ paddingBottom: 160 }}
            ListHeaderComponent={topView}
            ItemSeparatorComponent={() => <Divider />}
            onEndReached={handleMore}
          />
        </>
      )}
    </View>
  )
}

const RenderItem = ({ item }: { item: ITransaction }) => {
  const { navigation } = useNavigation<TransactionNavigationProp>()
  const { colors } = useTheme()

  return (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() =>
        navigation.push("TransactionDetail", { transaction: item })
      }
    >
      {item.type === "Deposit" ? (
        <MaterialCommunityIcons
          name="arrow-up-bold-circle"
          size={30}
          color={colors.secondary}
        />
      ) : (
        <MaterialCommunityIcons
          name="arrow-down-bold-circle"
          size={30}
          color={colors.primary}
        />
      )}

      <View style={styles.details}>
        <Text ellipsizeMode="tail" style={styles.detailHeader}>
          {item.description}
        </Text>
        <Text>{moment(item.createdAt).format("hh:mm a - ddd MMM YYYY")}</Text>
      </View>
      <View style={{ gap: 4 }}>
        <Text style={styles.detailHeader}>
          {currency(region())} {item.amount}
        </Text>
        <Text>Status</Text>
      </View>
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

export default Transaction

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  itemContainer: {
    flexDirection: "row",
    paddingVertical: 16,
    alignItems: "center",
    gap: 10,
    position: "relative",
  },
  details: {
    flex: 1,
    gap: 4,
  },
  detailHeader: {
    fontSize: 16,
    fontWeight: "bold",
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
})

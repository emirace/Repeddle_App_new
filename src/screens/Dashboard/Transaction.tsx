import {
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import React, { useEffect, useState } from "react"
import { Appbar, Divider, Text, useTheme } from "react-native-paper"
import useTransactions from "../../hooks/useTransaction"
import { useNavigation } from "@react-navigation/native"
import { TransactionNavigationProp } from "../../types/navigation/stack"
import { ITransaction } from "../../types/transactions"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import moment from "moment"
import { createSearchParam, currency, region } from "../../utils/common"
import Loader from "../../components/ui/Loader"
import CartIcon from "../../components/ui/cartIcon"

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
        <Appbar.Content titleStyle={{ color: "white" }} title="Transactions" />
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
      {loading ? (
        <Loader />
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
            renderItem={({ item }) => (
              <RenderItem navigation={navigation} item={item} />
            )}
            keyExtractor={(item) => item._id}
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

const RenderItem = ({
  item,
  navigation,
}: {
  item: ITransaction
  navigation: TransactionNavigationProp["navigation"]
}) => {
  const { colors } = useTheme()

  return (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() =>
        navigation.push("TransactionDetail", { transaction: item })
      }
    >
      {item.type === "debit" ? (
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
        <Text style={{ fontSize: 13 }}>
          {moment(item.createdAt).format("hh:mm a - ddd MMM YYYY")}
        </Text>
      </View>
      <View style={{ gap: 4 }}>
        <Text
          style={[
            styles.detailHeader,
            {
              textAlign: "right",
              color: item.type === "debit" ? "red" : "green",
            },
          ]}
        >
          {currency(region())} {item.amount}
        </Text>
        <Text>{item.status}</Text>
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
              backgroundColor: colors.elevation.level2,
            },
          ]}
          placeholderTextColor={colors.onBackground}
        />
        <Ionicons
          name="search"
          color={colors.onBackground}
          size={20}
          style={styles.searchIcon}
        />
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
    fontFamily: "absential-sans-medium",
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

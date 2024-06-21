import { Image, ScrollView, StyleSheet, View } from "react-native"
import React from "react"
import { Appbar, Divider, Text, useTheme } from "react-native-paper"
import { currency, region } from "../../utils/common"
import moment from "moment"
import { TransactionDetailNavigationProp } from "../../types/navigation/stack"
import useAuth from "../../hooks/useAuth"

type Props = TransactionDetailNavigationProp

const TransactionDetail = ({ navigation, route }: Props) => {
  const { colors } = useTheme()

  const { transaction } = route.params

  const { user } = useAuth()

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
        <Appbar.Content title="Transaction Detail" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={{ gap: 14 }}>
          <View>
            <Text style={styles.header}>Transaction Information</Text>
            <Divider />
          </View>
          <View style={styles.itemContainer}>
            <Text style={{ fontWeight: "bold" }}>Transaction Id</Text>
            <Text>{transaction._id}</Text>
          </View>
          <View style={styles.itemContainer}>
            <Text style={{ fontWeight: "bold" }}>Reference</Text>
            <Text>{transaction.type}</Text>
          </View>
          <View style={styles.itemContainer}>
            <Text style={{ fontWeight: "bold" }}>Amount</Text>
            <Text>
              {currency(region())} {transaction.amount}{" "}
              <Text style={{ color: colors.secondary }}>
                (fee: {currency(region())}10 )
              </Text>
            </Text>
          </View>
          <View style={styles.itemContainer}>
            <Text style={{ fontWeight: "bold" }}>Type</Text>
            <Text>{transaction.type}</Text>
          </View>
          <View style={styles.itemContainer}>
            <Text style={{ fontWeight: "bold" }}>Purpose</Text>
            <Text>{transaction.description}</Text>
          </View>
          <View style={styles.itemContainer}>
            <Text style={{ fontWeight: "bold" }}>Date</Text>
            <Text>
              {moment(transaction.createdAt).format("hh:mm a - ddd MMM YYYY")}
            </Text>
          </View>
        </View>
        <View>
          <Text style={styles.header}>Customer Information</Text>
          <Divider />
          <View style={{ gap: 5 }}>
            <Image
              style={styles.userImage}
              source={{ uri: user?.image }}
              resizeMode="cover"
            />
            <Text>
              {user?.firstName} {user?.lastName}
            </Text>
            <Text>@{user?.username}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default TransactionDetail

const styles = StyleSheet.create({
  container: { padding: 20, gap: 30 },
  header: {
    paddingBottom: 10,
    fontSize: 20,
    fontFamily: "absential-sans-bold",
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  userImage: {
    height: 100,
    aspectRatio: 1,
    borderRadius: 999,
  },
})

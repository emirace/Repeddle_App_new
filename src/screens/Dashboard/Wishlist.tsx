import { Pressable, StyleSheet, View } from "react-native"
import React from "react"
import { Appbar, Text, useTheme } from "react-native-paper"
import { FlatList } from "react-native-gesture-handler"
import useAuth from "../../hooks/useAuth"
import ProductItem from "../../components/ProductItem"
import { IProduct } from "../../types/product"
import { WishlistNavigationProp } from "../../types/navigation/stack"

type Props = WishlistNavigationProp
const numColumns = 2

const Wishlist = ({ navigation }: Props) => {
  const { colors } = useTheme()

  const { user } = useAuth()

  const formatData = (data: IProduct[]) => {
    const totalRows = Math.floor(data.length / numColumns)
    let totalLastRow = data.length - totalRows * numColumns
    if (totalLastRow !== 0 && totalLastRow !== numColumns) {
      const empty = { ...data[0], empty: true }
      data.push(empty)
    }
    return data
  }

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
        <Appbar.Content title="Wishlist" />
        <Appbar.Action
          icon="cart-outline"
          onPress={() => navigation.push("Cart")}
        />
      </Appbar.Header>

      {user?.wishlist && user.wishlist.length > 0 ? (
        <View style={styles.cartList}>
          <FlatList
            data={formatData(user.wishlist)}
            renderItem={({ item }) => (
              <RenderItem item={item} navigation={navigation} />
            )}
            keyExtractor={(item) => item._id}
            numColumns={numColumns}
            showsVerticalScrollIndicator={false}
          />
        </View>
      ) : (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            marginTop: 20,
          }}
        >
          <Text style={{ textAlign: "center" }}>No item in Wishlist 😍 </Text>

          <Pressable onPress={() => navigation.push("Main")}>
            <Text style={{ color: colors.secondary, fontWeight: "bold" }}>
              Go Shopping
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  )
}

const RenderItem = ({
  item,
  navigation,
}: {
  item: IProduct & { empty?: boolean }
  navigation: WishlistNavigationProp["navigation"]
}) => {
  let { itemStyles, invisible } = styles

  if (item.empty) return <View style={[itemStyles, invisible]}></View>

  return (
    <View style={itemStyles}>
      <ProductItem
        navigate={(slug: string) => navigation.push("Product", { slug })}
        product={item}
      />
    </View>
  )
}

export default Wishlist

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cartList: { padding: 10 },
  itemStyles: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    margin: 10,
    height: 300,
    borderRadius: 15,
  },
  invisible: { backgroundColor: "transparent" },
})

import { Pressable, StyleSheet, View } from "react-native"
import React, { useEffect, useState } from "react"
import { Appbar, Portal, Text, useTheme } from "react-native-paper"
import { FlatList } from "react-native-gesture-handler"
import useAuth from "../../hooks/useAuth"
import { WishlistNavigationProp } from "../../types/navigation/stack"
import { Wishlist as WishlistType } from "../../types/user"
import Loader from "../../components/ui/Loader"
import useToastNotification from "../../hooks/useToastNotification"
import WishlistItem from "../../components/WishlistItem"
import CartIcon from "../../components/ui/cartIcon"

type Props = WishlistNavigationProp

// TODO: Fix, notification, searchbar,tooltip, should not show sell page
const Wishlist = ({ navigation }: Props) => {
  const { colors } = useTheme()
  const { addNotification } = useToastNotification()
  const { error, getWishlist } = useAuth()

  const [wishlist, setWishlist] = useState<WishlistType[]>([])
  const [loading, setLoading] = useState(false)

  const removeWish = (id: string) => {
    setWishlist((prev) => prev.filter((val) => val._id !== id))
  }

  useEffect(() => {
    const getList = async () => {
      setLoading(true)
      const res = await getWishlist()
      if (res) setWishlist(res)
      else
        addNotification({ message: error || "An error occurred", error: true })
      setLoading(false)
    }

    getList()
  }, [])

  return (
    <Portal.Host>
      <View style={styles.container}>
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
          <Appbar.Content titleStyle={{ color: "white" }} title="Wishlist" />
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
        {loading && <Loader />}
        {!loading &&
          (wishlist.length > 0 ? (
            <View style={styles.cartList}>
              <FlatList
                data={wishlist}
                renderItem={({ item }) => (
                  <WishlistItem
                    removeWish={removeWish}
                    item={item}
                    navigation={navigation}
                  />
                )}
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
              <Text style={{ textAlign: "center" }}>
                No item in Wishlist 😍{" "}
              </Text>

              <Pressable onPress={() => navigation.push("Main")}>
                <Text
                  style={{
                    color: colors.secondary,
                    fontFamily: "chronicle-text-bold",
                  }}
                >
                  Go Shopping
                </Text>
              </Pressable>
            </View>
          ))}
      </View>
    </Portal.Host>
  )
}

export default Wishlist

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cartList: { padding: 10 },
})

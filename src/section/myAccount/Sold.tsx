import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native"
import React from "react"
import { Text, useTheme } from "react-native-paper"
import { IProduct } from "../../types/product"
import { MyAccountNavigationProp } from "../../types/navigation/stack"
import ProductItem from "../../components/ProductItem"
import { Tabs } from "react-native-collapsible-tab-view"

type Props = {
  products: IProduct[]
  navigation: MyAccountNavigationProp["navigation"]
}

const numColumns = 2

const Sold = ({ navigation, products }: Props) => {
  const { colors } = useTheme()

  const formatData = (data: IProduct[]) => {
    const isEven = data.length % numColumns === 0

    if (!isEven) {
      const empty = { ...data[0], empty: true }
      data.push(empty)
    }

    return data
  }

  return (
    <>
      {!products.length ? (
        <Tabs.ScrollView>
          <View style={styles.continueCont}>
            <View style={styles.frsttext}>
              <Text
                style={{ color: colors.onBackground }}
                onPress={() => navigation.navigate("Main")}
              >
                No product found.{" "}
              </Text>
              <TouchableOpacity>
                <Text style={styles.secondtext}>Go Shopping</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Tabs.ScrollView>
      ) : (
        <Tabs.FlatList
          data={formatData(products)}
          renderItem={({ item }) => (
            <RenderItem item={item} navigation={navigation} />
          )}
          keyExtractor={(item, index) => index.toString()}
          numColumns={numColumns}
          showsVerticalScrollIndicator={false}
        />
      )}
    </>
  )
}

const RenderItem = ({
  item,
  navigation,
}: {
  item: IProduct & { empty?: boolean }
  navigation: MyAccountNavigationProp["navigation"]
}) => {
  let { itemStyles, invisible } = styles
  if (item.empty) {
    return <View style={[itemStyles, invisible]} />
  }
  return (
    <Pressable style={itemStyles}>
      <ProductItem
        product={item}
        navigate={(slug: string) => navigation.navigate("Product", { slug })}
      />
    </Pressable>
  )
}

export default Sold

const styles = StyleSheet.create({
  itemStyles: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    margin: 10,
    borderRadius: 15,
  },
  itemText: {
    color: "white",
    fontSize: 30,
  },
  invisible: { backgroundColor: "transparent" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  continueCont: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    marginTop: 50,
  },
  frsttext: { justifyContent: "center", flexDirection: "row" },
  secondtext: { fontWeight: "500", fontSize: 15, color: "#8a1719" },
})

import { StyleSheet, TouchableOpacity, View } from "react-native"
import React from "react"
import { Text, useTheme } from "react-native-paper"
import { MyAccountNavigationProp } from "../../types/navigation/stack"
import { Tabs } from "react-native-collapsible-tab-view"
import { IProduct } from "../../types/product"
import ProductItem from "../../components/ProductItem"

type Props = {
  products: IProduct[]
  navigation: MyAccountNavigationProp["navigation"]
}

const numColumns = 2

const All = ({ navigation, products }: Props) => {
  const { colors } = useTheme()

  const formatData = (data: IProduct[]) => {
    const totalRows = Math.floor(data.length / numColumns)
    let totalLastRow = data.length - totalRows * numColumns
    if (totalLastRow !== 0 && totalLastRow !== numColumns) {
      const empty = { ...data[0], empty: true }
      data.push(empty)
    }
    return data
  }

  return !products.length ? (
    <Tabs.ScrollView>
      <View style={styles.continueCont}>
        <View style={styles.frsttext}>
          <Text
            style={{ color: colors.onBackground }}
            onPress={() => navigation.push("Main")}
          >
            No product found.{" "}
          </Text>

          <TouchableOpacity onPress={() => navigation.push("Sell")}>
            <Text style={styles.secondtext}>Add product</Text>
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
      style={styles.container}
      ListHeaderComponent={() => <RenderHeader navigation={navigation} />}
    />
  )
}

type HeaderProps = {
  navigation: MyAccountNavigationProp["navigation"]
}
const RenderHeader = ({ navigation }: HeaderProps) => {
  return (
    <TouchableOpacity
      style={styles.buttonContainer}
      onPress={() => navigation.push("Sell")}
    >
      <Text style={styles.buttonText}>Add Product</Text>
    </TouchableOpacity>
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

export default All

const styles = StyleSheet.create({
  container: {
    // height: 300,
  },
  buttonContainer: {
    backgroundColor: "#8a1719",
    borderRadius: 10,
    padding: 10,
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontFamily: "chronicle-text-bold",
    fontSize: 18,
  },
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
    marginTop: 50,
  },
  frsttext: { justifyContent: "center", flexDirection: "row" },
  secondtext: { fontWeight: "500", fontSize: 15, color: "#8a1719" },
})

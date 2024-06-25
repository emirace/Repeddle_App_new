import { FlatList, Image, TouchableOpacity, View } from "react-native"
import React from "react"
import homeStyles from "./homeStyles"
import { Text, useTheme } from "react-native-paper"
import { MainScreenNavigationProp } from "../../types/navigation/stack"

type Props = {
  navigation: MainScreenNavigationProp["navigation"]
}

const HomeBrands = ({ navigation }: Props) => {
  return (
    <>
      <View style={[homeStyles.catTitle, { marginTop: 10 }]}>
        <View>
          <Text style={homeStyles.category}>Brands</Text>
          <View style={homeStyles.dash} />
        </View>
        <TouchableOpacity onPress={() => navigation.push("Brand")}>
          <Text style={homeStyles.seeAll}>see all</Text>
        </TouchableOpacity>
      </View>

      <Text
        style={{
          paddingHorizontal: 10,
          textAlign: "justify",
          fontFamily: "chronicle-text",
          lineHeight: 18,
        }}
      >
        Discover brands that tick the boxes, from names you love, price that
        does not break the bank and environmental conscious brands that you can
        pass on to generations. That is sustainability.
      </Text>
      <View style={homeStyles.categoryScroll}>
        <FlatList
          data={brands}
          renderItem={({ item }) => (
            <RenderItemcat navigation={navigation} item={item} />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={260}
          snapToAlignment={"center"}
          decelerationRate={"fast"}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </>
  )
}

const RenderItemcat = ({
  item,
  navigation,
}: {
  item: (typeof brands)[number]
  navigation: MainScreenNavigationProp["navigation"]
}) => {
  const { colors } = useTheme()
  return (
    <TouchableOpacity
      onPress={() => navigation.push("Search", { query: item.text })}
      style={[homeStyles.catStyles]}
    >
      <Image
        source={{ uri: item.key }}
        style={{ width: "100%", flex: 1, borderRadius: 5 }}
      />
      <Text
        style={{
          fontSize: 15,
          textTransform: "uppercase",
          fontWeight: "500",
          color: colors.secondary,
          fontFamily: "chronicle-text",
        }}
      >
        {item.text}
      </Text>
    </TouchableOpacity>
  )
}

const brands = [
  { key: "https://repeddle.com/images/Picture1.webp", text: "Patagonia" },
  {
    key: "https://repeddle.com/images/lucas-hoang-O0e6Ka5vYSs-unsplash.webp",
    text: "gucci",
  },
  {
    key: "https://repeddle.com/images/tony-tran-VKVDdLGoilc-unsplash.webp",
    text: "Balanciaga",
  },
  {
    key: "https://repeddle.com/images/jakayla-toney-v0gHLhdQPCY-unsplash.webp",
    text: "addidas",
  },
  { key: "https://repeddle.com/images/A.mcqueen.webp", text: "A. Mcqueen" },
]

export default HomeBrands

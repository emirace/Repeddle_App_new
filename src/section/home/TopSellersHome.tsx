import {
  View,
  FlatList,
  ActivityIndicator,
  Image,
  ImageBackground,
} from "react-native"
import React from "react"
import homeStyles from "./homeStyles"
import { TopSellers } from "../../types/user"
import { TouchableOpacity } from "react-native-gesture-handler"
import { Text, useTheme } from "react-native-paper"

type Props = {
  isLoading?: boolean
  error?: string
  seller: TopSellers[]
}

const TopSellersHome = ({ isLoading, seller, error }: Props) => {
  const { colors } = useTheme()

  return (
    <>
      <View style={[homeStyles.catTitle, { marginTop: 10 }]}>
        <View>
          <Text style={homeStyles.category}>Top Sellers</Text>
          <View style={homeStyles.dash} />
        </View>
      </View>
      {isLoading ? (
        <ActivityIndicator size={"large"} color={colors.primary} />
      ) : error ? (
        <Text>{error}</Text>
      ) : !seller.length ? (
        <Text style={{ textAlign: "center" }}>No Seller Found</Text>
      ) : (
        // <Text>{seller.error}</Text>
        <View style={homeStyles.categoryScroll}>
          <FlatList
            data={seller}
            renderItem={({ item }) => <RenderTopSeller item={item} />}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={260}
            snapToAlignment={"center"}
            decelerationRate={"fast"}
            keyExtractor={(_, index) => index.toString()}
          />
        </View>
      )}
    </>
  )
}

const RenderTopSeller = ({ item }: { item: TopSellers }) => (
  <TouchableOpacity
  // TODO:
  //   onPress={() => navigation.navigate('MyAccount', { id: item.userId._id })}
  >
    <ImageBackground
      imageStyle={homeStyles.sellerCont}
      source={{ uri: item?.image }}
      resizeMode="cover"
      style={homeStyles.sellerCont}
    >
      {item.badge && (
        <Image
          resizeMode="contain"
          source={{
            uri: "https://res.cloudinary.com/emirace/image/upload/v1661148671/Icons-28_hfzerc.png",
          }}
          style={homeStyles.vipBadge}
        />
      )}
      <Text style={homeStyles.sellerName}>{item.username}</Text>
    </ImageBackground>
  </TouchableOpacity>
)

export default TopSellersHome

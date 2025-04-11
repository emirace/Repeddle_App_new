import {
  View,
  FlatList,
  ActivityIndicator,
  Image,
  ImageBackground,
} from "react-native";
import React from "react";
import homeStyles from "./homeStyles";
import { TopSellers } from "../../types/user";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Text, useTheme } from "react-native-paper";
import { MainScreenNavigationProp } from "../../types/navigation/stack";
import { baseURL } from "../../services/api";

type Props = {
  isLoading?: boolean;
  error?: string;
  seller: TopSellers[];
  navigation: MainScreenNavigationProp["navigation"];
};

const TopSellersHome = ({ isLoading, seller, error, navigation }: Props) => {
  const { colors } = useTheme();

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
      ) : !seller?.length ? (
        <Text style={{ textAlign: "center" }}>No Seller Found</Text>
      ) : (
        // <Text>{seller.error}</Text>
        <View style={homeStyles.categoryScroll}>
          <FlatList
            data={seller}
            renderItem={({ item }) => (
              <RenderTopSeller navigation={navigation} item={item} />
            )}
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
  );
};

const RenderTopSeller = ({
  item,
  navigation,
}: {
  item: TopSellers;
  navigation: MainScreenNavigationProp["navigation"];
}) => (
  <TouchableOpacity
    onPress={() =>
      navigation.navigate("MyAccount", { username: item.username })
    }
  >
    <ImageBackground
      imageStyle={homeStyles.sellerCont}
      source={{ uri: baseURL + item?.image }}
      resizeMode="cover"
      style={homeStyles.sellerCont}
    >
      {item?.badge && (
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
);

export default TopSellersHome;

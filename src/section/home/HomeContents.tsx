import React from "react";
import BrandImages from "./BrandImages";
import Collection from "./Collection";
import HomeBrands from "./HomeBrands";
import TopSellersHome from "./TopSellersHome";
import Carousel from "./Carousel";
import { MainScreenNavigationProp } from "../../types/navigation/stack";
import { TopSellers } from "../../types/user";
import { TouchableOpacity, View } from "react-native";
import homeStyles from "./homeStyles";
import { Text } from "react-native-paper";
import { IProduct } from "../../types/product";

type Props = {
  navigation: MainScreenNavigationProp["navigation"];
  isLoading?: boolean;
  seller: TopSellers[];
  error?: string;
  products: IProduct[];
};

const HomeContents = ({
  navigation,
  isLoading,
  seller,
  error,
  products,
}: Props) => {
  return (
    <>
      <Carousel navigation={navigation} />
      <BrandImages />
      <Collection navigation={navigation} />
      <HomeBrands navigation={navigation} />
      <TopSellersHome
        isLoading={isLoading}
        seller={seller}
        error={error}
        navigation={navigation}
      />

      <View style={homeStyles.catTitle}>
        <View>
          <Text style={[homeStyles.category]}>New Deals</Text>
          <View style={homeStyles.dash} />
        </View>
        <TouchableOpacity>
          <Text style={homeStyles.seeAll}>see all</Text>
        </TouchableOpacity>
      </View>
      {!isLoading && !products.length ? (
        <Text style={{ padding: 10 }}>No Products Found</Text>
      ) : null}
    </>
  );
};

export default HomeContents;

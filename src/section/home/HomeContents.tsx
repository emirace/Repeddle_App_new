import React from "react"
import BrandImages from "./BrandImages"
import Collection from "./Collection"
import HomeBrands from "./HomeBrands"
import TopSellersHome from "./TopSellersHome"
import Carousel from "./Carousel"
import { MainScreenNavigationProp } from "../../types/navigation/stack"
import { TopSellers } from "../../types/user"

type Props = {
  navigation: MainScreenNavigationProp["navigation"]
  isLoading?: boolean
  seller: TopSellers[]
  error?: string
}

const HomeContents = ({ navigation, isLoading, seller, error }: Props) => {
  return (
    <>
      <Carousel navigation={navigation} />
      <BrandImages />
      <Collection navigation={navigation} />
      <HomeBrands />
      <TopSellersHome isLoading={isLoading} seller={seller} error={error} />
    </>
  )
}

export default HomeContents

import { FlatList, Image, View } from "react-native"
import React from "react"
import useTheme from "../../hooks/useTheme"
import { useTheme as usePaperTheme } from "react-native-paper"
import homeStyles from "./homeStyles"

const renderBrand = ({ item }: { item: string }) => (
  <Image
    source={{ uri: item }}
    style={homeStyles.brandImage}
    resizeMode="contain"
  />
)

const BrandImages = () => {
  const { themeMode } = useTheme()
  const { colors } = usePaperTheme()

  return (
    <View style={[homeStyles.brandScroll, { backgroundColor: colors.surface }]}>
      <FlatList
        data={themeMode === "dark" ? brandLogo : brandLogodark}
        renderItem={renderBrand}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 2 }}
        snapToInterval={260}
        snapToAlignment={"center"}
        decelerationRate={"fast"}
        keyExtractor={(_, index) => index.toString()}
      />
    </View>
  )
}

export default BrandImages

const brandLogo = [
  "https://repeddle.com/images/gucci.png",
  "https://repeddle.com/images/dg.png",
  "https://repeddle.com/images/prada.png",
  "https://repeddle.com/images/luis.png",
  "https://repeddle.com/images/Versace.png",
  "https://repeddle.com/images/Chanel.png",
]

const brandLogodark = [
  "https://res.cloudinary.com/emirace/image/upload/v1679901951/20230327_081744_jqvzre.png",
  "https://res.cloudinary.com/emirace/image/upload/v1679901949/20230327_081456_nzfyrp.png",
  "https://res.cloudinary.com/emirace/image/upload/v1679901949/20230327_081409_knjbkb.png",
  "https://res.cloudinary.com/emirace/image/upload/v1679901949/20230327_081549_wn79jb.png",
  "https://res.cloudinary.com/emirace/image/upload/v1679901949/20230327_081856_fgat1o.png",
  "https://res.cloudinary.com/emirace/image/upload/v1679901949/20230327_081657_o1fnue.png",
]

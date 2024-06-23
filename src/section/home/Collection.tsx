import { FlatList, Image, TouchableOpacity, View } from "react-native"
import React from "react"
import { Text, useTheme } from "react-native-paper"
import homeStyles from "./homeStyles"
import { MainScreenNavigationProp } from "../../types/navigation/stack"

type Props = {
  navigation: MainScreenNavigationProp["navigation"]
}

const Collection = ({ navigation }: Props) => {
  const { colors } = useTheme()
  return (
    <>
      <View style={[homeStyles.catTitle]}>
        <View>
          <Text style={homeStyles.category}>New Collections</Text>
          <View
            style={[homeStyles.dash, { backgroundColor: colors.tertiary }]}
          />
        </View>
        <TouchableOpacity
        // onPress={() => navigation.push("CategoryStack")}
        >
          <Text style={homeStyles.seeAll}>see all</Text>
        </TouchableOpacity>
      </View>
      <Text style={homeStyles.info}>
        Discover new shops launching on our App and Website daily. Shop Hot
        deals, New Arrivals & New style drops from your favorite shops and
        influencers.
      </Text>
      <View style={homeStyles.categoryScroll}>
        <FlatList
          data={images}
          renderItem={({ item }) => (
            <RenderItemcat navigation={navigation} item={item} />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={260}
          snapToAlignment={"center"}
          decelerationRate={"fast"}
          keyExtractor={(_, index) => index.toString()}
        />
      </View>

      <View style={homeStyles.classic}>
        <Image
          source={{
            uri: "https://repeddle.com/images/vonecia-carswell-D3HSYAUjVrM-unsplash.webp",
          }}
          style={homeStyles.classicImage}
        />
        <View style={homeStyles.classicTextCont}>
          <Text style={homeStyles.classicText}>Classic Men Wears</Text>
          <TouchableOpacity
            style={homeStyles.classicButton}
            onPress={() => navigation.push("Search", { query: "men" })}
          >
            <Text
              style={[
                homeStyles.classicButtonText,
                { borderBottomColor: colors.primary },
              ]}
            >
              SHOP NOW
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={homeStyles.classic}>
        <Image
          source={{
            uri: "https://repeddle.com/images/For-kids.webp",
          }}
          style={homeStyles.classicImage}
        />
        <View style={homeStyles.classicTextCont}>
          <Text style={homeStyles.classicText}>Smart Kid's Wears</Text>
          <TouchableOpacity
            style={homeStyles.classicButton}
            onPress={() => navigation.push("Search", { query: "kid" })}
          >
            <Text
              style={[
                homeStyles.classicButtonText,
                { borderBottomColor: colors.primary },
              ]}
            >
              SHOP NOW
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={homeStyles.classic}>
        <Image
          source={{
            uri: "https://repeddle.com/images/tamara-bellis-uN1m9Ca0aqo-unsplash.webp",
          }}
          style={homeStyles.classicImage}
        />
        <View style={homeStyles.classicTextCont}>
          <Text style={homeStyles.classicText}>High Taste Women Wears</Text>
          <TouchableOpacity
            style={homeStyles.classicButton}
            onPress={() => navigation.push("Search", { query: "women" })}
          >
            <Text
              style={[
                homeStyles.classicButtonText,
                { borderBottomColor: colors.primary },
              ]}
            >
              SHOP NOW
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  )
}

export default Collection

const images = [
  {
    key: "https://repeddle.com/images/engin-akyurt-xbFtknoQG_Y-unsplash.webp",
    text: "style up",
  },
  {
    key: "https://repeddle.com/images/ruan-richard-rodrigues--MCGquf_4mU-unsplash.webp",
    text: "accessorize",
  },
  {
    key: "https://repeddle.com/images/julian-hochgesang-sA5wcAu4CBA-unsplash.webp",
    text: "sneaker-head",
  },
  {
    key: "https://repeddle.com/images/stephen-audu-BkB5T-ZdK88-unsplash.webp",
    text: "bag affair",
  },
  {
    key: "https://repeddle.com/images/carmen-fu-4xb2LK36Mps-unsplash.webp",
    text: "gen-Z kids",
  },
  {
    key: "https://repeddle.com/images/ahmed-carter-GP3-QpmTgPk-unsplash.webp",
    text: "let's go party",
  },
]

const RenderItemcat = ({
  item,
  navigation,
}: {
  item: (typeof images)[number]
  navigation: MainScreenNavigationProp["navigation"]
}) => {
  const { colors } = useTheme()

  return (
    <TouchableOpacity
      onPress={() => navigation.push("Search", { query: item.text })}
      style={homeStyles.catStyles}
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
          color: colors.tertiary,
          fontFamily: "chronicle-text",
          lineHeight: 18,
          marginTop: 2,
        }}
      >
        {item.text}
      </Text>
    </TouchableOpacity>
  )
}

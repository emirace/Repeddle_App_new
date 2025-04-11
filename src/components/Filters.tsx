import {
  Image,
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
import { lightTheme } from "../constant/theme"
import { Ionicons } from "@expo/vector-icons"
import MultiSlider from "@ptomasroos/react-native-multi-slider"
import { currency } from "../utils/common"
import { FilterOptions } from "../types/search"
import {
  availabilitylist,
  color1,
  conditionlist,
  deals,
  patternlist,
  shippinglist,
  sizelist,
  typelist,
} from "../utils/constants"
import { Text, useTheme } from "react-native-paper"
import { ICategory } from "../types/category"
import useBrands from "../hooks/useBrand"

type Props = {
  filters: FilterOptions
  handleFilter: (key: keyof FilterOptions, val: string | number) => void
  setFilters: Dispatch<SetStateAction<FilterOptions>>
  categories: ICategory[]
}

// TODO: rebundle
const Filters = ({ categories, filters, handleFilter, setFilters }: Props) => {
  const { colors } = useTheme()
  const { brands, fetchBrands } = useBrands()

  const [queryBrand, setQueryBrand] = useState<string>("")

  const [priceRange, setPriceRange] = useState([
    +(filters.minPrice ?? 0),
    +(filters.maxPrice ?? 500000),
  ])

  useEffect(() => {
    const params = [["search", queryBrand]]

    const string = new URLSearchParams(params).toString()
    fetchBrands(string)
  }, [queryBrand])

  const [collapse, setCollapse] = useState({
    category: true,
    brand: true,
    price: true,
    deal: true,
    review: true,
    color: true,
    size: true,
    shipping: true,
    condition: true,
    availability: true,
    type: true,
    pattern: true,
  })

  const toggleCollapse = (key: keyof typeof collapse, val: boolean) => {
    setCollapse({ ...collapse, [key]: val })
  }

  const handleAfterPriceChange = (values: number[]) => {
    const [newMinValue, newMaxValue] = values
    if (+(filters?.minPrice ?? 0) !== newMinValue) {
      handleFilter("minPrice", newMinValue)
    }
    if (+(filters?.maxPrice ?? 0) !== newMaxValue) {
      handleFilter("maxPrice", newMaxValue)
    }
    setPriceRange(values)
  }

  const region = "NGN"

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.menu}>
          <TouchableOpacity
            style={styles.titleCont}
            onPress={() => toggleCollapse("category", !collapse.category)}
          >
            <Text style={styles.title}>Categories</Text>
            <Ionicons
              name={
                collapse.category
                  ? "chevron-up-outline"
                  : "chevron-forward-outline"
              }
              size={15}
              color={colors.onBackground}
            />
          </TouchableOpacity>
          <View
            style={[styles.list, collapse.category ? {} : styles.inactivate]}
          >
            <TouchableOpacity onPress={() => handleFilter("category", "all")}>
              <View style={styles.listItem}>
                <Ionicons
                  style={{ marginRight: 5 }}
                  name="stop-circle-sharp"
                  size={10}
                  color={lightTheme.colors.secondary}
                />
                <Text
                  style={[
                    styles.itemText,
                    !filters.category || "all" === filters.category
                      ? styles.selected
                      : {},
                  ]}
                >
                  All
                </Text>
              </View>
            </TouchableOpacity>
            {categories.length > 0 &&
              categories.map((c) => (
                <TouchableOpacity
                  key={c._id}
                  onPress={() => handleFilter("category", c.name)}
                >
                  <View style={styles.listItem}>
                    <Ionicons
                      style={{ marginRight: 5 }}
                      name="stop-circle-sharp"
                      size={10}
                      color={lightTheme.colors.secondary}
                    />
                    <Text
                      style={[
                        styles.itemText,
                        c.name === filters.category ? styles.selected : {},
                      ]}
                    >
                      {c.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
          </View>
        </View>
        <View style={styles.menu}>
          <TouchableOpacity
            style={styles.titleCont}
            onPress={() => toggleCollapse("brand", !collapse.brand)}
          >
            <Text style={styles.title}>Brands</Text>
            <Ionicons
              name={
                collapse.brand
                  ? "chevron-up-outline"
                  : "chevron-forward-outline"
              }
              size={15}
              color={colors.onBackground}
            />
          </TouchableOpacity>
          <View style={[styles.list, collapse.brand ? {} : styles.inactivate]}>
            <TextInput
              placeholder="Search brands"
              placeholderTextColor="grey"
              value={queryBrand ?? filters.brand?.toString()}
              onChangeText={(text) => {
                setFilters((prev) => {
                  delete prev.brand
                  return prev
                })
                setQueryBrand(text)
              }}
              style={[styles.textInput, { color: colors.onBackground }]}
              cursorColor={colors.onBackground}
            />
            <TouchableOpacity onPress={() => handleFilter("brand", "all")}>
              <View style={styles.listItem}>
                <Ionicons
                  style={{ marginRight: 5 }}
                  name="stop-circle-sharp"
                  size={10}
                  color={lightTheme.colors.secondary}
                />
                <Text
                  style={[
                    styles.itemText,
                    !filters.brand || "all" === filters.brand
                      ? styles.selected
                      : {},
                  ]}
                >
                  All
                </Text>
              </View>
            </TouchableOpacity>
            {queryBrand &&
              brands.length > 0 &&
              brands.map((p, index) => (
                <View key={p._id}>
                  <TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        handleFilter("brand", p.name)
                        setQueryBrand(p.name)
                        Keyboard.dismiss()
                      }}
                      style={styles.listItem}
                    >
                      <Ionicons
                        style={{ marginRight: 5 }}
                        name="stop-circle-sharp"
                        size={10}
                        color={lightTheme.colors.secondary}
                      />
                      <Text
                        style={[
                          styles.itemText,
                          p.name === filters.brand ? styles.selected : {},
                        ]}
                      >
                        {p.name}
                      </Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                </View>
              ))}
            {queryBrand && (
              <TouchableOpacity>
                <TouchableOpacity onPress={() => {}} style={styles.listItem}>
                  <Ionicons
                    style={{ marginRight: 5 }}
                    name="stop-circle-sharp"
                    size={10}
                    color={lightTheme.colors.secondary}
                  />
                  <Text style={[styles.itemText]}>Others</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={styles.menu}>
          <TouchableOpacity
            style={styles.titleCont}
            onPress={() => toggleCollapse("price", !collapse.price)}
          >
            <Text style={styles.title}>Prices</Text>
            <Ionicons
              name={
                collapse.price
                  ? "chevron-up-outline"
                  : "chevron-forward-outline"
              }
              size={15}
              color={colors.onBackground}
            />
          </TouchableOpacity>
          <View style={[styles.list, collapse.price ? {} : styles.inactivate]}>
            <View style={{ marginHorizontal: 10 }}>
              <Text>
                Minimum Price:{currency(region)} {priceRange[0]}
              </Text>
              <Text>
                Maximum Price:{currency(region)} {priceRange[1]}
              </Text>
              <MultiSlider
                values={priceRange}
                min={0}
                max={100000}
                step={100}
                // sliderLength={200}
                onValuesChangeFinish={handleAfterPriceChange}
                // onValuesChange={handleOnChange}
                selectedStyle={{ backgroundColor: lightTheme.colors.secondary }}
                markerStyle={{ backgroundColor: lightTheme.colors.primary }}
              />
            </View>
          </View>
        </View>

        <View style={styles.menu}>
          <TouchableOpacity
            style={styles.titleCont}
            onPress={() => toggleCollapse("deal", !collapse.deal)}
          >
            <Text style={styles.title}>Deals</Text>
            <Ionicons
              name={
                collapse.deal ? "chevron-up-outline" : "chevron-forward-outline"
              }
              size={15}
              color={colors.onBackground}
            />
          </TouchableOpacity>

          <View style={[styles.list, collapse.deal ? {} : styles.inactivate]}>
            <TouchableOpacity onPress={() => handleFilter("deal", "all")}>
              <View style={styles.listItem}>
                <Ionicons
                  style={{ marginRight: 5 }}
                  name="stop-circle-sharp"
                  size={10}
                  color={lightTheme.colors.secondary}
                />
                <Text
                  style={[
                    styles.itemText,
                    !filters.deal || "all" === filters.deal
                      ? styles.selected
                      : {},
                  ]}
                >
                  All
                </Text>
              </View>
            </TouchableOpacity>
            {deals.map((p) => (
              <View key={p.id}>
                <TouchableOpacity onPress={() => handleFilter("deal", p.value)}>
                  <View style={styles.listItem}>
                    <Ionicons
                      style={{ marginRight: 5 }}
                      name="stop-circle-sharp"
                      size={10}
                      color={lightTheme.colors.secondary}
                    />
                    <Text
                      style={[
                        styles.itemText,
                        p.value === filters.deal ? styles.selected : {},
                      ]}
                    >
                      {p.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.menu}>
          <TouchableOpacity
            style={styles.titleCont}
            onPress={() => toggleCollapse("review", !collapse.review)}
          >
            <Text style={styles.title}>Rating</Text>
            <Ionicons
              name={
                collapse.review
                  ? "chevron-up-outline"
                  : "chevron-forward-outline"
              }
              size={15}
              color={colors.onBackground}
            />
          </TouchableOpacity>

          <View
            style={[styles.rating, collapse.review ? {} : styles.inactivate]}
          >
            <TouchableOpacity onPress={() => handleFilter("rating", 1)}>
              <Ionicons
                style={{ marginRight: 20 }}
                name={+(filters?.rating ?? 0) >= 1 ? "star" : "star-outline"}
                size={26}
                color={lightTheme.colors.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleFilter("rating", 2)}>
              <Ionicons
                style={{ marginRight: 20 }}
                name={+(filters?.rating ?? 0) >= 2 ? "star" : "star-outline"}
                size={26}
                color={lightTheme.colors.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleFilter("rating", 3)}>
              <Ionicons
                style={{ marginRight: 20 }}
                name={+(filters?.rating ?? 0) >= 3 ? "star" : "star-outline"}
                size={26}
                color={lightTheme.colors.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleFilter("rating", 4)}>
              <Ionicons
                style={{ marginRight: 20 }}
                name={+(filters?.rating ?? 0) >= 4 ? "star" : "star-outline"}
                size={26}
                color={lightTheme.colors.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleFilter("rating", 5)}>
              <Ionicons
                style={{ marginRight: 20 }}
                name={+(filters?.rating ?? 0) >= 5 ? "star" : "star-outline"}
                size={26}
                color={lightTheme.colors.primary}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.menu}>
          <TouchableOpacity
            style={styles.titleCont}
            onPress={() => toggleCollapse("color", !collapse.color)}
          >
            <Text style={styles.title}>Color</Text>
            <Ionicons
              name={
                collapse.color
                  ? "chevron-up-outline"
                  : "chevron-forward-outline"
              }
              size={15}
              color={colors.onBackground}
            />
          </TouchableOpacity>
          <View style={[styles.list, collapse.color ? {} : styles.inactivate]}>
            <TouchableOpacity onPress={() => handleFilter("color", "all")}>
              <View style={styles.listItem}>
                <Text
                  style={[
                    styles.itemText,
                    !filters.color || "all" === filters.color
                      ? styles.selected
                      : {},
                  ]}
                >
                  All
                </Text>
              </View>
            </TouchableOpacity>
            <View style={styles.color}>
              {color1.map((c, i) => (
                <TouchableOpacity
                  style={[
                    c.name === filters.color
                      ? {
                          borderWidth: 2,
                          borderColor: lightTheme.colors.primary,
                        }
                      : {},
                  ]}
                  key={c.id}
                  onPress={() => handleFilter("color", c.name)}
                >
                  <View style={styles.listItem}>
                    {c.name === "multiculour" ? (
                      <Image
                        source={{
                          uri: "https://res.cloudinary.com/emirace/image/upload/v1668595263/multi-color_s2zd1o.jpg",
                        }}
                        alt="multiculour"
                        style={{
                          width: 30,
                          height: 20,
                          borderRadius: 5,
                        }}
                      />
                    ) : (
                      <View
                        style={{
                          backgroundColor: c.name,
                          width: 30,
                          height: 20,
                          borderRadius: 5,
                        }}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
        <View style={styles.menu}>
          <TouchableOpacity
            style={styles.titleCont}
            onPress={() => toggleCollapse("size", !collapse.size)}
          >
            <Text style={styles.title}>Size</Text>
            <Ionicons
              name={
                collapse.size ? "chevron-up-outline" : "chevron-forward-outline"
              }
              size={15}
              color={colors.onBackground}
            />
          </TouchableOpacity>
          <View style={[styles.list, collapse.size ? {} : styles.inactivate]}>
            <TouchableOpacity onPress={() => handleFilter("size", "all")}>
              <View style={styles.listItem}>
                <Text
                  style={[
                    styles.itemText,
                    !filters.size || "all" === filters.size
                      ? styles.selected
                      : {},
                  ]}
                >
                  All
                </Text>
              </View>
            </TouchableOpacity>
            <View style={styles.color}>
              {sizelist.map((c, i) => (
                <TouchableOpacity
                  key={c.id}
                  onPress={() => handleFilter("size", c.name)}
                >
                  <View style={styles.listItem}>
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        borderWidth: 1,
                        width: 30,
                        height: 20,
                        borderRadius: 5,
                        borderColor:
                          c.name === filters.size
                            ? lightTheme.colors.primary
                            : colors.onBackground,
                      }}
                    >
                      <Text
                        style={[
                          [
                            styles.itemText,
                            c.name === filters.size ? styles.selected : {},
                          ],
                          { textTransform: "uppercase" },
                        ]}
                      >
                        {c.name}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
        <View style={styles.menu}>
          <TouchableOpacity
            style={styles.titleCont}
            onPress={() => toggleCollapse("shipping", !collapse.shipping)}
          >
            <Text style={styles.title}>Shipping</Text>
            <Ionicons
              name={
                collapse.shipping
                  ? "chevron-up-outline"
                  : "chevron-forward-outline"
              }
              size={15}
              color={colors.onBackground}
            />
          </TouchableOpacity>
          <View
            style={[styles.list, collapse.shipping ? {} : styles.inactivate]}
          >
            <TouchableOpacity onPress={() => handleFilter("shipping", "all")}>
              <View style={styles.listItem}>
                <Ionicons
                  style={{ marginRight: 5 }}
                  name="stop-circle-sharp"
                  size={10}
                  color={lightTheme.colors.secondary}
                />
                <Text
                  style={[
                    styles.itemText,
                    !filters.shipping || "all" === filters.shipping
                      ? styles.selected
                      : {},
                  ]}
                >
                  All
                </Text>
              </View>
            </TouchableOpacity>
            {shippinglist.map((c, i) => (
              <TouchableOpacity
                key={c.id}
                onPress={() => handleFilter("shipping", c.name)}
              >
                <View style={styles.listItem}>
                  <Ionicons
                    style={{ marginRight: 5 }}
                    name="stop-circle-sharp"
                    size={10}
                    color={lightTheme.colors.secondary}
                  />
                  <Text
                    style={[
                      styles.itemText,
                      c.name === filters.shipping ? styles.selected : {},
                    ]}
                  >
                    {c.name}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.menu}>
          <TouchableOpacity
            style={styles.titleCont}
            onPress={() => toggleCollapse("condition", !collapse.condition)}
          >
            <Text style={styles.title}>Condition</Text>
            <Ionicons
              name={
                collapse.condition
                  ? "chevron-up-outline"
                  : "chevron-forward-outline"
              }
              size={15}
              color={colors.onBackground}
            />
          </TouchableOpacity>
          <View
            style={[styles.list, collapse.condition ? {} : styles.inactivate]}
          >
            <TouchableOpacity onPress={() => handleFilter("condition", "all")}>
              <View style={styles.listItem}>
                <Ionicons
                  style={{ marginRight: 5 }}
                  name="stop-circle-sharp"
                  size={10}
                  color={lightTheme.colors.secondary}
                />
                <Text
                  style={[
                    styles.itemText,
                    !filters.condition || "all" === filters.condition
                      ? styles.selected
                      : {},
                  ]}
                >
                  All Condition
                </Text>
              </View>
            </TouchableOpacity>
            {conditionlist.map((c, i) => (
              <TouchableOpacity
                key={c._id}
                onPress={() => handleFilter("condition", c.name)}
              >
                <View style={styles.listItem}>
                  <Ionicons
                    style={{ marginRight: 5 }}
                    name="stop-circle-sharp"
                    size={10}
                    color={lightTheme.colors.secondary}
                  />
                  <Text
                    style={[
                      styles.itemText,
                      c.name === filters.condition ? styles.selected : {},
                    ]}
                  >
                    {c.name}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.menu}>
          <TouchableOpacity
            style={styles.titleCont}
            onPress={() =>
              toggleCollapse("availability", !collapse.availability)
            }
          >
            <Text style={styles.title}>Availability</Text>
            <Ionicons
              name={
                collapse.availability
                  ? "chevron-up-outline"
                  : "chevron-forward-outline"
              }
              size={15}
              color={colors.onBackground}
            />
          </TouchableOpacity>
          <View
            style={[
              styles.list,
              collapse.availability ? {} : styles.inactivate,
            ]}
          >
            <TouchableOpacity
              onPress={() => handleFilter("availability", "all")}
            >
              <View style={styles.listItem}>
                <Ionicons
                  style={{ marginRight: 5 }}
                  name="stop-circle-sharp"
                  size={10}
                  color={lightTheme.colors.secondary}
                />
                <Text
                  style={[
                    styles.itemText,
                    !filters.availability || "all" === filters.availability
                      ? styles.selected
                      : {},
                  ]}
                >
                  All
                </Text>
              </View>
            </TouchableOpacity>
            {availabilitylist.map((c, i) => (
              <TouchableOpacity
                key={c.id}
                onPress={() => handleFilter("availability", c.name)}
              >
                <View style={styles.listItem}>
                  <Ionicons
                    style={{ marginRight: 5 }}
                    name="stop-circle-sharp"
                    size={10}
                    color={lightTheme.colors.secondary}
                  />
                  <Text
                    style={[
                      styles.itemText,
                      c.name === filters.availability ? styles.selected : {},
                    ]}
                  >
                    {c.name}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.menu}>
          <TouchableOpacity
            style={styles.titleCont}
            onPress={() => toggleCollapse("type", !collapse.type)}
          >
            <Text style={styles.title}>Type</Text>
            <Ionicons
              name={
                collapse.type ? "chevron-up-outline" : "chevron-forward-outline"
              }
              size={15}
              color={colors.onBackground}
            />
          </TouchableOpacity>
          <View style={[styles.list, collapse.type ? {} : styles.inactivate]}>
            <TouchableOpacity onPress={() => handleFilter("type", "all")}>
              <View style={styles.listItem}>
                <Ionicons
                  style={{ marginRight: 5 }}
                  name="stop-circle-sharp"
                  size={10}
                  color={lightTheme.colors.secondary}
                />
                <Text
                  style={[
                    styles.itemText,
                    !filters.type || "all" === filters.type
                      ? styles.selected
                      : {},
                  ]}
                >
                  All
                </Text>
              </View>
            </TouchableOpacity>
            {typelist.map((c, i) => (
              <TouchableOpacity
                key={c.id}
                onPress={() => handleFilter("type", c.name)}
              >
                <View style={styles.listItem}>
                  <Ionicons
                    style={{ marginRight: 5 }}
                    name="stop-circle-sharp"
                    size={10}
                    color={lightTheme.colors.secondary}
                  />
                  <Text
                    style={[
                      styles.itemText,
                      c.name === filters.type ? styles.selected : {},
                    ]}
                  >
                    {c.name}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.menu}>
          <TouchableOpacity
            style={styles.titleCont}
            onPress={() => toggleCollapse("pattern", !collapse.pattern)}
          >
            <Text style={styles.title}>Pattern & Printed</Text>
            <Ionicons
              name={
                collapse.pattern
                  ? "chevron-up-outline"
                  : "chevron-forward-outline"
              }
              size={15}
              color={colors.onBackground}
            />
          </TouchableOpacity>
          <View
            style={[styles.list, collapse.pattern ? {} : styles.inactivate]}
          >
            <TouchableOpacity onPress={() => handleFilter("pattern", "all")}>
              <View style={styles.listItem}>
                <Ionicons
                  style={{ marginRight: 5 }}
                  name="stop-circle-sharp"
                  size={10}
                  color={lightTheme.colors.secondary}
                />
                <Text
                  style={[
                    styles.itemText,
                    !filters.pattern || "all" === filters.pattern
                      ? styles.selected
                      : {},
                  ]}
                >
                  All
                </Text>
              </View>
            </TouchableOpacity>
            {patternlist.map((c, i) => (
              <TouchableOpacity
                key={c.id}
                onPress={() => handleFilter("pattern", c.name)}
              >
                <View style={styles.listItem}>
                  <Ionicons
                    style={{ marginRight: 5 }}
                    name="stop-circle-sharp"
                    size={10}
                    color={lightTheme.colors.secondary}
                  />
                  <Text
                    style={[
                      styles.itemText,
                      c.name === filters.pattern ? styles.selected : {},
                    ]}
                  >
                    {c.name}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </View>
  )
}

export default Filters

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  button: { position: "absolute", bottom: 10, left: 10, width: "100%" },
  wrapper: {
    paddingVertical: 5,
  },
  menu: {
    marginBottom: 10,
  },
  title: {
    fontSize: 15,
    position: "relative",
    fontFamily: "absential-sans-bold",
    zIndex: 1,
  },
  list: {
    padding: 5,
    overflow: "hidden",
    // transition: "0.5s",
  },
  inactivate: { height: 0 },

  listItem: {
    padding: 5,
    flexDirection: "row",
    alignItems: "center",
    textTransform: "capitalize",
    borderRadius: 5,
  },
  itemText: {
    fontSize: 15,
    textTransform: "capitalize",
  },

  color: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 15,
  },
  titleCont: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 5,
    height: 35,
    padding: 10,
    fontSize: 15,
    borderColor: lightTheme.colors.secondary,
    marginVertical: 5,
  },
  rating: { flexDirection: "row", marginHorizontal: 5, marginVertical: 5 },
  selected: { fontFamily: "chronicle-text-bold", color: lightTheme.colors.primary },
})

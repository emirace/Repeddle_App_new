import {
  Image,
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { lightTheme } from "../constant/theme";
import { Ionicons } from "@expo/vector-icons";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { currency } from "../utils/common";
import { SearchOptionsKey, SearchOptionsObject } from "../types/search";
import {
  availabilitylist,
  color1,
  conditionlist,
  deals,
  patternlist,
  shippinglist,
  sizelist,
  typelist,
} from "../utils/constants";
import { Text, useTheme } from "react-native-paper";
import { ICategory } from "../types/category";
import useBrands from "../hooks/useBrand";

type Props = {
  tempFilters: SearchOptionsObject;
  handleTempFilter: (key: SearchOptionsKey, val: string | number) => void;
};

const Filters = ({ handleTempFilter, tempFilters }: Props) => {
  const { colors } = useTheme();
  const { brands, fetchBrands } = useBrands();

  const [priceRange, setPriceRange] = useState([
    +(tempFilters.minPrice ?? 0),
    +(tempFilters.maxPrice ?? 500000),
  ]);

  const [queryBrand, setQueryBrand] = useState<string>("");

  useEffect(() => {
    const params = [["search", queryBrand]];

    const string = new URLSearchParams(params).toString();

    fetchBrands(string);
  }, []);

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
  });

  const toggleCollapse = (key: keyof typeof collapse, val: boolean) => {
    setCollapse({ ...collapse, [key]: val });
  };

  const handleAfterPriceChange = (values: number[]) => {
    const [newMinValue, newMaxValue] = values;
    if (tempFilters.minPrice !== newMinValue) {
      handleTempFilter("minPrice", newMinValue);
    }
    if (tempFilters.maxPrice !== newMaxValue) {
      handleTempFilter("maxPrice", newMaxValue);
    }
    setPriceRange(values);
  };

  const region = "NGN";

  const categories: ICategory[] = [];

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
            <TouchableOpacity
              onPress={() => handleTempFilter("category", "all")}
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
                    !tempFilters.category || "all" === tempFilters.category
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
                  onPress={() => handleTempFilter("category", c.name)}
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
                        c.name === tempFilters.category ? styles.selected : {},
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
              value={queryBrand ?? tempFilters.brand?.toString()}
              onChangeText={(text) => {
                handleTempFilter("brand", "");
                setQueryBrand(text);
              }}
              style={[styles.textInput, { color: colors.onBackground }]}
              cursorColor={colors.onBackground}
            />
            <TouchableOpacity onPress={() => handleTempFilter("brand", "all")}>
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
                    !tempFilters.brand || "all" === tempFilters.brand
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
                        handleTempFilter("brand", p.name);
                        setQueryBrand("");
                        Keyboard.dismiss();
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
                          p.name === tempFilters.brand ? styles.selected : {},
                        ]}
                      >
                        {p.name}
                      </Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                </View>
              ))}
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
            <TouchableOpacity onPress={() => handleTempFilter("deal", "all")}>
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
                    !tempFilters.deal || "all" === tempFilters.deal
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
                <TouchableOpacity
                  onPress={() => handleTempFilter("deal", p.value)}
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
                        p.value === tempFilters.deal ? styles.selected : {},
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
            <TouchableOpacity onPress={() => handleTempFilter("rating", 1)}>
              <Ionicons
                style={{ marginRight: 20 }}
                name={
                  +(tempFilters?.rating ?? 0) >= 1 ? "star" : "star-outline"
                }
                size={26}
                color={lightTheme.colors.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleTempFilter("rating", 2)}>
              <Ionicons
                style={{ marginRight: 20 }}
                name={
                  +(tempFilters?.rating ?? 0) >= 2 ? "star" : "star-outline"
                }
                size={26}
                color={lightTheme.colors.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleTempFilter("rating", 3)}>
              <Ionicons
                style={{ marginRight: 20 }}
                name={
                  +(tempFilters?.rating ?? 0) >= 3 ? "star" : "star-outline"
                }
                size={26}
                color={lightTheme.colors.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleTempFilter("rating", 4)}>
              <Ionicons
                style={{ marginRight: 20 }}
                name={
                  +(tempFilters?.rating ?? 0) >= 4 ? "star" : "star-outline"
                }
                size={26}
                color={lightTheme.colors.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleTempFilter("rating", 5)}>
              <Ionicons
                style={{ marginRight: 20 }}
                name={
                  +(tempFilters?.rating ?? 0) >= 5 ? "star" : "star-outline"
                }
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
            <TouchableOpacity onPress={() => handleTempFilter("color", "all")}>
              <View style={styles.listItem}>
                <Text
                  style={[
                    styles.itemText,
                    !tempFilters.color || "all" === tempFilters.color
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
                    c.name === tempFilters.color
                      ? {
                          borderWidth: 2,
                          borderColor: lightTheme.colors.primary,
                        }
                      : {},
                  ]}
                  key={c.id}
                  onPress={() => handleTempFilter("color", c.name)}
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
            <TouchableOpacity onPress={() => handleTempFilter("size", "all")}>
              <View style={styles.listItem}>
                <Text
                  style={[
                    styles.itemText,
                    !tempFilters.size || "all" === tempFilters.size
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
                  onPress={() => handleTempFilter("size", c.name)}
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
                          c.name === tempFilters.size
                            ? lightTheme.colors.primary
                            : colors.onBackground,
                      }}
                    >
                      <Text
                        style={[
                          [
                            styles.itemText,
                            c.name === tempFilters.size ? styles.selected : {},
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
            <TouchableOpacity
              onPress={() => handleTempFilter("shipping", "all")}
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
                    !tempFilters.shipping || "all" === tempFilters.shipping
                      ? styles.selected
                      : {},
                  ]}
                >
                  All Product
                </Text>
              </View>
            </TouchableOpacity>
            {shippinglist.map((c, i) => (
              <TouchableOpacity
                key={c.id}
                onPress={() => handleTempFilter("shipping", c.name)}
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
                      c.name === tempFilters.shipping ? styles.selected : {},
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
            <TouchableOpacity
              onPress={() => handleTempFilter("condition", "all")}
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
                    !tempFilters.condition || "all" === tempFilters.condition
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
                key={c.id}
                onPress={() => handleTempFilter("price", c.name)}
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
                      c.name === tempFilters.condition ? styles.selected : {},
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
              onPress={() => handleTempFilter("availability", "all")}
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
                    !tempFilters.availability ||
                    "all" === tempFilters.availability
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
                onPress={() => handleTempFilter("availability", c.name)}
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
                      c.name === tempFilters.availability
                        ? styles.selected
                        : {},
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
            <TouchableOpacity onPress={() => handleTempFilter("type", "all")}>
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
                    !tempFilters.type || "all" === tempFilters.type
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
                onPress={() => handleTempFilter("type", c.name)}
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
                      c.name === tempFilters.type ? styles.selected : {},
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
            <TouchableOpacity
              onPress={() => handleTempFilter("pattern", "all")}
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
                    !tempFilters.pattern || "all" === tempFilters.pattern
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
                onPress={() => handleTempFilter("pattern", c.name)}
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
                      c.name === tempFilters.pattern ? styles.selected : {},
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
  );
};

export default Filters;

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
    fontWeight: "bold",
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
  selected: { fontWeight: "bold", color: lightTheme.colors.primary },
});

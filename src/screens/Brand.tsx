import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Appbar, Text, useTheme } from "react-native-paper";
import { lightTheme } from "../constant/theme";
import { BrandNavigationProp } from "../types/navigation/stack";
import useBrands from "../hooks/useBrand";
import { IBrand } from "../types/product";
import useToastNotification from "../hooks/useToastNotification";

const Brand = ({ navigation }: BrandNavigationProp) => {
  const { colors } = useTheme();
  const { fetchBrandsByAlpha } = useBrands();
  const { addNotification } = useToastNotification();
  const [activeTab, setActiveTab] = useState(0);
  const [data, setData] = useState<IBrand[]>([]);
  const [searchText, setSearchText] = useState("");
  const scrollViewRef = useRef<FlatList<any>>(null);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [filteredData, setFilteredData] = useState<IBrand[]>(data);
  const [showInfo, setShowInfo] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleTabPress = (tabIndex: number) => {
    setActiveTab(tabIndex);
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
    const filteredData1 = data.filter((item) =>
      item.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filteredData1);
  };

  const tabs = [
    { label: "A", id: 0 },
    { label: "B", id: 1 },
    { label: "C", id: 2 },
    { label: "D", id: 3 },
    { label: "E", id: 4 },
    { label: "F", id: 5 },
    { label: "G", id: 6 },
    { label: "H", id: 7 },
    { label: "I", id: 8 },
    { label: "J", id: 9 },
    { label: "K", id: 10 },
    { label: "L", id: 11 },
    { label: "M", id: 12 },
    { label: "N", id: 13 },
    { label: "O", id: 14 },
    { label: "P", id: 15 },
    { label: "Q", id: 16 },
    { label: "R", id: 17 },
    { label: "S", id: 18 },
    { label: "T", id: 19 },
    { label: "U", id: 20 },
    { label: "V", id: 21 },
    { label: "W", id: 22 },
    { label: "X", id: 23 },
    { label: "Y", id: 24 },
    { label: "Z", id: 25 },
    { label: "#", id: 26 },
  ];

  useEffect(() => {
    fetchDataForTab(activeTab);
  }, [activeTab]);

  const fetchDataForTab = async (tabIndex: number) => {
    try {
      setLoading(true);
      const response = await fetchBrandsByAlpha(tabs[tabIndex].label);
      setData(response);
      setFilteredData(response);
    } catch (error: any) {
      addNotification({ message: error, error: true });
    } finally {
      setLoading(false);
    }
  };

  const handleScrollToTop = () => {
    if (scrollViewRef.current)
      scrollViewRef.current.scrollToOffset({ offset: 0, animated: true });
  };

  const handleClosePress = () => {
    setShowInfo(false);
    setIsSearchVisible(false);
    setSearchText("");
    setFilteredData(data);
  };

  const handleSearchPress = () => {
    setIsSearchVisible(true);
  };

  const renderItem = ({ item }: { item: IBrand }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("Search", { query: item.name })}
    >
      <Text style={styles.item}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderItemTitle = ({
    item,
  }: {
    item: { label: string; id: number };
  }) => (
    <TouchableOpacity
      onPress={() => handleTabPress(item.id)}
      style={styles.titleCont}
    >
      <Text
        style={[
          styles.title,
          tabs[activeTab].label === item.label && {
            color: colors.primary,
            fontWeight: "bold",
          },
        ]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View
      style={{
        backgroundColor: colors.background,
        position: "relative",
        flex: 1,
      }}
    >
      <Appbar.Header
        mode="small"
        style={{
          justifyContent: "space-between",
          backgroundColor: colors.primary,
        }}
      >
        <Appbar.BackAction
          iconColor="white"
          onPress={() => navigation.goBack()}
        />
        <Appbar.Content titleStyle={{ color: "white" }} title="Brands" />
      </Appbar.Header>
      <View style={{ marginVertical: 5, flexDirection: "row" }}>
        {!isSearchVisible ? (
          <TouchableOpacity
            style={styles.searchIcon}
            onPress={handleSearchPress}
          >
            <Ionicons
              name="search-outline"
              size={24}
              color={colors.onBackground}
            />
          </TouchableOpacity>
        ) : (
          <View
            style={[
              styles.searchContainer,
              { borderColor: colors.onBackground },
            ]}
          >
            <View style={{ flex: 1 }}>
              <TextInput
                style={[styles.searchInput, { color: colors.onBackground }]}
                placeholder="Search..."
                placeholderTextColor={colors.onBackground}
                onChangeText={handleSearch}
                value={searchText}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: 5,
              }}
            >
              <TouchableOpacity
                style={styles.closeIconContainer}
                onPress={() => setShowInfo(!showInfo)}
              >
                <Ionicons
                  name="information-circle-outline"
                  size={24}
                  color={colors.onBackground}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeIconContainer}
                onPress={handleClosePress}
              >
                <Ionicons
                  name="close-outline"
                  size={24}
                  color={colors.onBackground}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
        <FlatList
          data={tabs}
          renderItem={renderItemTitle}
          horizontal
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          stickyHeaderIndices={[0]}
        />
      </View>

      {showInfo && (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: 10,
            flexDirection: "row",
          }}
        >
          <Ionicons
            name="information-circle-outline"
            size={24}
            color={colors.onBackground}
            style={{ padding: 10 }}
          />
          <View>
            <Text style={{ fontWeight: "bold" }}>Search faster and better</Text>
            <Text>
              Please input the brand name you're searching in the search bar
              according to the selected alphabet
            </Text>
          </View>
        </View>
      )}
      <Text
        style={[styles.header, { backgroundColor: colors.elevation.level3 }]}
      >
        {tabs[activeTab].label}
      </Text>
      <View
        style={{
          paddingTop: 5,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {loading ? (
          <ActivityIndicator />
        ) : filteredData.length <= 0 ? (
          <Text>Brand not available</Text>
        ) : null}
      </View>

      <FlatList
        ref={scrollViewRef}
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />
      <TouchableOpacity
        onPress={handleScrollToTop}
        style={styles.buttonContainer}
      >
        <View style={styles.button}>
          <Ionicons name="arrow-up" size={24} color="white" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 10,
    fontSize: 18,
  },
  titleCont: {
    height: 40,
    width: 30,
    marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    lineHeight: undefined,
    fontSize: 18,
  },
  item: {
    padding: 10,
    fontSize: 16,
    textTransform: "capitalize",
  },
  see: {
    color: lightTheme.colors.primary,
    fontWeight: "bold",
    padding: 10,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: lightTheme.colors.secondary,
    borderRadius: 30,
    overflow: "hidden",
  },
  button: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    borderRadius: 20,
    paddingHorizontal: 10,
    height: 40,
    width: 200,
    borderWidth: 1,
    justifyContent: "space-between",
  },
  searchIcon: {
    marginHorizontal: 5,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  searchInput: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  closeIconContainer: {
    padding: 2,
  },
});

export default Brand;

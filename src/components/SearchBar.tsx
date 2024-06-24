import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { useTheme } from "react-native-paper";

type Props = {
  onPress: (val: string) => void;
};

const SearchBar = ({ onPress }: Props) => {
  const [query, setQuery] = useState("");
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.inverseOnSurface,
          borderRadius: 10,
        },
      ]}
    >
      <View style={styles.searchCont}>
        <TouchableOpacity
          onPress={() => onPress(query)}
          style={styles.searchicon}
        >
          <Ionicons name="search" size={25} color={colors.onBackground} />
        </TouchableOpacity>
        <TextInput
          value={query}
          placeholder={"Search anything"}
          placeholderTextColor={colors.onBackground}
          style={[styles.TextInput, { color: colors.onBackground }]}
          cursorColor={colors.onBackground}
          selectionColor={colors.onBackground}
          keyboardType="web-search"
          returnKeyType="search"
          onSubmitEditing={() => onPress(query)}
          onChangeText={(text) => {
            setQuery(text);
          }}
          selectionColor={colors.primary}
        />
        {query ? (
          <TouchableOpacity onPress={() => setQuery("")}>
            <View style={styles.searchicon}>
              <Ionicons name="close-outline" size={20} />
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.searchicon} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 40,
    borderRadius: 5,
  },
  TextInput: { flex: 1, height: "100%" },
  searchCont: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  searchicon: {
    height: "100%",
    width: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SearchBar;

import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Appbar } from "react-native-paper";

const Category = () => {
  return (
    <View>
      <Appbar.Header>
        <Appbar.Content title="Category" />
      </Appbar.Header>
    </View>
  );
};

export default Category;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

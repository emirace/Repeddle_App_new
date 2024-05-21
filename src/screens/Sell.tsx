import { StyleSheet, View } from "react-native";
import React from "react";
import { Text, Appbar } from "react-native-paper";

const Sell = () => {
  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Sell" />
      </Appbar.Header>
      <Text>Listing a product</Text>
    </View>
  );
};

export default Sell;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

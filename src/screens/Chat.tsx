import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Appbar } from "react-native-paper";

const Chat = () => {
  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Chat" />
      </Appbar.Header>
    </View>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

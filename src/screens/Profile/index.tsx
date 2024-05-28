import { StyleSheet, View } from "react-native";
import React from "react";
import { Appbar, Avatar, List, Text, useTheme } from "react-native-paper";

const Profile: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: 20,
      }}
    >
      <Appbar.Header>
        <View style={styles.userInfo}>
          <Avatar.Icon size={48} icon="account" />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.greeting}>Hi, Emmanuel</Text>
            <Text style={styles.welcome}>Welcome, let's make payments!</Text>
          </View>
        </View>
        <Appbar.Action icon="calendar" onPress={() => {}} />
        <Appbar.Action icon="magnify" onPress={() => {}} />
      </Appbar.Header>
      <View>
        <List.Section>
          <List.Subheader>General</List.Subheader>

          <List.Item
            title="Notification"
            description="Control your notification"
            titleStyle={{
              fontSize: 22,
            }}
            descriptionStyle={{ fontSize: 18 }}
            left={() => <List.Icon icon="bell-outline" />}
            right={() => <List.Icon icon="chevron-right" />}
            // onPress={() => navigation.navigate('Appearance')}
          />
        </List.Section>
        <List.Section>
          <List.Subheader>Appearance</List.Subheader>
          <List.Item
            title="Theme"
            description="Select your prefered theme"
            titleStyle={{
              fontSize: 22,
            }}
            left={() => <List.Icon icon="theme-light-dark" />}
            right={() => <List.Icon icon="chevron-right" />}
            descriptionStyle={{ fontSize: 18 }}
            onPress={() => navigation.navigate("Appearance")}
          />
        </List.Section>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
  },
  welcome: {
    fontSize: 16,
    color: "gray",
  },
});

export default Profile;

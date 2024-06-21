import { StyleSheet, ScrollView,View } from "react-native";
import React from "react";
import { Appbar, Avatar, List, Text, useTheme } from "react-native-paper";
import Balance from "../../section/profile/Balances";
import { RootStackParamList } from "../../types/navigation/stack"

const Profile: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors } = useTheme()

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: 20,
      }}
      contentContainerStyle={{
        paddingBottom: 130,
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
        <Appbar.Action icon="face-agent" onPress={() => {}} />
        <Appbar.Action icon="bell-outline" onPress={() => {}} />
      </Appbar.Header>
      <View>
        <Balance navigation={navigation} />
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
        <List.Section>
          <List.Subheader>Dashboard</List.Subheader>
          {dashboardItems.map((item) => (
            <List.Item
              key={item.name}
              title={item.name}
              description={item.description}
              titleStyle={{
                fontSize: 22,
              }}
              left={() => <List.Icon icon={item.leftIcon} />}
              right={() => <List.Icon icon="chevron-right" />}
              descriptionStyle={{ fontSize: 18 }}
              onPress={() => navigation.navigate(`${item.link}`)}
            />
          ))}
        </List.Section>
      </View>
    </ScrollView>
  )
}

const dashboardItems: {
  name: string
  link: keyof RootStackParamList
  leftIcon: string
  description: string
}[] = [
  {
    name: "My Profile",
    link: "Profile",
    leftIcon: "account",
    description: "Manage your profile",
  },
  {
    name: "My Products",
    link: "ProductList",
    leftIcon: "bookmark",
    description: "Manage your products",
  },
  {
    name: "Orders",
    link: "OrderList",
    leftIcon: "basket",
    description: "View your purchased and sold returns history",
  },
  {
    name: "My Earnings",
    link: "Profile",
    leftIcon: "account",
    description: "See your achievements",
  },
  {
    name: "My Wishlist",
    link: "Wishlist",
    leftIcon: "cards-heart",
    description: "View saved products",
  },
  {
    name: "Returns",
    link: "Return",
    leftIcon: "arrow-u-left-top-bold",
    description: "View returns history",
  },
  {
    name: "All Transactions",
    link: "Transaction",
    leftIcon: "cash",
    description: "View all your transactions",
  },
]

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
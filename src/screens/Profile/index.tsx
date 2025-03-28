import { StyleSheet, ScrollView, View } from "react-native"
import React from "react"
import {
  Appbar,
  Avatar,
  Button,
  List,
  Text,
  useTheme,
} from "react-native-paper"
import Balance from "../../section/profile/Balances"
import { RootStackParamList } from "../../types/navigation/stack"
import useAuth from "../../hooks/useAuth"
import { baseURL } from "../../services/api"

const Profile: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors } = useTheme();
  const { logout, user } = useAuth();

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: 15,
      }}
      contentContainerStyle={{
        paddingBottom: 130,
      }}
    >
      {user ? (
        <Appbar.Header style={{ height: 80, paddingHorizontal: 0 }}>
          <View style={styles.userInfo}>
            {user.image ? (
              <Avatar.Image
                size={30}
                source={{ uri: baseURL + user.image }}
                style={{ marginRight: 10 }}
              />
            ) : (
              <Avatar.Icon size={30} icon="account" />
            )}
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.greeting}>Hi, {user?.username}</Text>
              <Text
                numberOfLines={2}
                ellipsizeMode="middle"
                style={styles.welcome}
              >
                Welcome, let's make payments!
              </Text>
            </View>
          </View>
          <Appbar.Action
            icon="face-agent"
            style={{ height: 30, width: 30 }}
            onPress={() => {}}
          />
          <Appbar.Action
            icon="bell-outline"
            style={{ height: 30, width: 30 }}
            onPress={() => {}}
          />
        </Appbar.Header>
      ) : (
        <Appbar.Header>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <View style={styles.userInfo}>
              <Avatar.Icon size={30} icon="account" />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.greeting}>Hi, </Text>
                <Text style={styles.welcome}>Welcome, please login</Text>
              </View>
              <Button
                mode="contained"
                style={{
                  borderRadius: 10,
                  marginLeft: "auto",
                }}
                onPress={() => navigation.push("Login", { back: true })}
              >
                Login
              </Button>
            </View>
          </View>
        </Appbar.Header>
      )}
      <View>
        {user ? <Balance navigation={navigation} /> : null}
        <List.Section style={{ marginBottom: 5, marginTop: 20 }}>
          <List.Subheader
            style={{
              paddingVertical: 6,
              borderRadius: 10,
              backgroundColor: colors.elevation.level2,
            }}
          >
            General
          </List.Subheader>

          <List.Item
            title="Notification"
            description="Control your notification"
            titleStyle={{
              fontSize: 18,
            }}
            style={{ paddingVertical: 5 }}
            descriptionStyle={{ fontSize: 14 }}
            left={() => <List.Icon icon="bell-outline" />}
            right={() => <List.Icon icon="chevron-right" />}
            // onPress={() => navigation.navigate('Appearance')}
          />
        </List.Section>
        <List.Section style={{ marginVertical: 5 }}>
          <List.Subheader
            style={{
              paddingVertical: 6,
              borderRadius: 10,
              backgroundColor: colors.elevation.level2,
            }}
          >
            Appearance
          </List.Subheader>
          <List.Item
            title="Theme"
            description="Select your prefered theme"
            titleStyle={{
              fontSize: 18,
            }}
            left={() => <List.Icon icon="theme-light-dark" />}
            right={() => <List.Icon icon="chevron-right" />}
            descriptionStyle={{ fontSize: 14 }}
            onPress={() => navigation.push("Appearance")}
          />
        </List.Section>
        {user ? (
          <List.Section style={{ marginVertical: 5 }}>
            <List.Subheader
              style={{
                paddingVertical: 6,
                borderRadius: 10,
                backgroundColor: colors.elevation.level2,
              }}
            >
              Dashboard
            </List.Subheader>
            {dashboardItems.map((item) => (
              <List.Item
                style={{ paddingVertical: 5 }}
                key={item.name}
                title={item.name}
                description={item.description}
                titleStyle={{
                  fontSize: 18,
                }}
                left={() => <List.Icon icon={item.leftIcon} />}
                right={() => <List.Icon icon="chevron-right" />}
                descriptionStyle={{ fontSize: 14 }}
                onPress={() => navigation.navigate(`${item.link}`)}
              />
            ))}
            <List.Item
              title="Log out"
              description={"Log out of your account"}
              titleStyle={{
                fontSize: 18,
              }}
              left={() => <List.Icon icon={"power"} />}
              right={() => <List.Icon icon="chevron-right" />}
              descriptionStyle={{ fontSize: 14 }}
              onPress={() => {
                logout();
                navigation.replace("Auth");
              }}
              style={{ paddingVertical: 5 }}
            />
          </List.Section>
        ) : null}
      </View>
    </ScrollView>
  );
};

const dashboardItems: {
  name: string;
  link: keyof RootStackParamList;
  leftIcon: string;
  description: string;
}[] = [
  {
    name: "My Profile",
    link: "ProfileSettings",
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
    link: "Earnings",
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
];

const styles = StyleSheet.create({
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  greeting: {
    fontSize: 18,
    fontFamily: "absential-sans-bold",
  },
  welcome: {
    fontSize: 13,
    color: "gray",
  },
});

export default Profile;

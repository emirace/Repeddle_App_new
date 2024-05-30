import { ScrollView, View } from "react-native"
import React from "react"
import { Appbar, List, useTheme } from "react-native-paper"

const Profile: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors } = useTheme()

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
      contentContainerStyle={{
        paddingBottom: 130,
      }}
    >
      <Appbar.Header>
        <Appbar.Content title="Profile" />
      </Appbar.Header>
      <View style={{ paddingHorizontal: 20 }}>
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
              // description="Select your prefered theme"
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

const dashboardItems = [
  {
    name: "My Profile",
    link: "profile",
    leftIcon: "account",
  },
  {
    name: "My Products",
    link: "profile",
    leftIcon: "account",
  },
  {
    name: "Orders",
    link: "profile",
    leftIcon: "account",
  },
  {
    name: "My Earnings",
    link: "profile",
    leftIcon: "account",
  },
  {
    name: "My Wishlist",
    link: "profile",
    leftIcon: "account",
  },
  {
    name: "Returns",
    link: "profile",
    leftIcon: "account",
  },
  {
    name: "All Transactions",
    link: "profile",
    leftIcon: "account",
  },
]

export default Profile

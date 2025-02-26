// MainBottomNav.tsx
import React from "react"
import { StyleProp, View, ViewStyle, Platform, Pressable } from "react-native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Icon, useTheme } from "react-native-paper"
import { lightTheme } from "../constant/theme"
import { MainScreenNavigationProp } from "../types/navigation/stack"
import Home from "../screens/Home"
import Category from "../screens/Category"
import CustomTabBarButton from "../components/CustomTabBarButton"
import Conversation from "../screens/chat/Conversation"
import Profile from "../screens/profile"
import useAuth from "../hooks/useAuth"

type TabConfiguration = {
  name: string
  component: React.ComponentType<any>
  iconSource: { selected: string; unselected: string }
  badge?: any
  floatingButton?: boolean
  requiresAuth?: boolean
}

const Tab = createBottomTabNavigator()

const tabBarStyle: StyleProp<ViewStyle> = {
  elevation: 0,
  shadowOpacity: 0,
  borderTopWidth: 0,
  borderRadius: 20,
  // height: 90,
  position: "absolute",
  height: Platform.OS === "ios" ? 90 : 75,
  backgroundColor: "transparent",
  bottom: 0,
  // paddingTop: Platform.OS === "ios" ? 30 : 0,
}

const tabBarShadowStyle: StyleProp<ViewStyle> = {
  shadowColor: lightTheme.colors.secondary,
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.1,
  shadowRadius: 3.5,
  elevation: 5,
}

const tabBarBadgeStyle: StyleProp<ViewStyle> = {
  position: "absolute",
  top: Platform.OS === "android" ? 10 : -10,
  right: -5,
  backgroundColor: lightTheme.colors.primary,
}

const CustomBottomTabBar2 = (props: any) => {
  const { colors } = useTheme()

  return (
    <View style={{ position: "relative", flex: 1 }}>
      <Pressable
        onPress={props.onPress}
        style={{
          position: "absolute",
          top: 1,
          left: Platform.OS === "ios" ? -0 : -1,
          right: -1,
          bottom: Platform.OS === "ios" ? -50 : 0,
          backgroundColor: colors.background,
          borderTopWidth: 1,
          borderTopColor: "#8a171920",
          paddingBottom: Platform.OS === "ios" ? 30 : 0,
        }}
      >
        {props.children}
      </Pressable>
    </View>
  )
}

const MainBottomNav: React.FC<MainScreenNavigationProp> = ({ navigation }) => {
  const { user } = useAuth()

  const tabConfigurations: TabConfiguration[] = [
    {
      name: "Home",
      component: Home,
      iconSource: { selected: "home", unselected: "home-outline" },
    },
    {
      name: "Category",
      component: Category,
      iconSource: {
        selected: "format-list-bulleted",
        unselected: "format-list-bulleted",
      },
    },
    {
      name: "FloatingButton",
      component: Home,
      iconSource: { selected: "plus", unselected: "plus-outline" },
      floatingButton: true,
      requiresAuth: true,
    },
    {
      name: "Chat",
      component: Conversation,
      iconSource: { selected: "chat", unselected: "chat-outline" },
      requiresAuth: true,
    },
    {
      name: "Profile",
      component: Profile,
      iconSource: { selected: "account", unselected: "account-outline" },
    },
  ]

  return (
    <View style={{ flex: 1, justifyContent: "flex-end" }}>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          tabBarActiveTintColor: lightTheme.colors.primary,
          tabBarInactiveTintColor: lightTheme.colors.secondary,
          tabBarStyle,
          tabBarShowLabel: false,
          tabBarBadgeStyle: tabBarBadgeStyle,
          headerShown: false,
        }}
      >
        {tabConfigurations.map((config) => (
          <Tab.Screen
            key={config.name}
            name={config.name}
            component={config.component}
            options={{
              tabBarIcon: ({ color, focused }) => (
                <Icon
                  source={
                    focused
                      ? config.iconSource.selected
                      : config.iconSource.unselected
                  }
                  color={color}
                  size={30}
                />
              ),
              tabBarBadge: config.badge,
              tabBarButton: config.floatingButton
                ? (props) => (
                    <CustomTabBarButton
                      onPress={() =>
                        user
                          ? navigation.push("Sell")
                          : navigation.push("Login", { back: true })
                      }
                    />
                  )
                : (props) => (
                    <CustomBottomTabBar2
                      {...props}
                      onPress={
                        config.requiresAuth && !user
                          ? () => navigation.push("Login", { back: true })
                          : props.onPress
                      }
                    />
                  ),
            }}
          />
        ))}
      </Tab.Navigator>
    </View>
  )
}

export default MainBottomNav

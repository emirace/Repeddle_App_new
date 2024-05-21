// MainBottomNav.tsx
import React, { useRef } from "react";
import { StyleProp, View, ViewStyle, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-paper";
import { lightTheme } from "../constant/theme";
import useCart from "../hooks/useCart";
import { MainScreenNavigationProp } from "../types/navigation/stack";
import Home from "../screens/Home";
import Category from "../screens/Category";
import Chat from "../screens/Chat";
import Profile from "../screens/Profile";
import CustomTabBarButton from "../components/CustomTabBarButton";

type TabConfiguration = {
  name: string;
  component: React.ComponentType<any>;
  iconSource: { selected: string; unselected: string };
  badge?: any;
  floatingButton?: boolean;
};

const Tab = createBottomTabNavigator();

const tabBarStyle: StyleProp<ViewStyle> = {
  elevation: 0,
  shadowOpacity: 0,
  position: "absolute",
  borderTopWidth: 0,
  bottom: 25,
  left: 20,
  right: 20,
  borderRadius: 20,
  height: 90,
  paddingTop: Platform.OS === "ios" ? 30 : 0,
};

const tabBarShadowStyle: StyleProp<ViewStyle> = {
  shadowColor: lightTheme.colors.secondary,
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.1,
  shadowRadius: 3.5,
  elevation: 5,
};

const tabBarBadgeStyle: StyleProp<ViewStyle> = {
  position: "absolute",
  top: Platform.OS === "android" ? 10 : -10,
  right: -5,
  backgroundColor: lightTheme.colors.primary,
};

const MainBottomNav: React.FC<MainScreenNavigationProp> = ({
  navigation,
  route,
}) => {
  const { cart } = useCart();

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
    },
    {
      name: "Chat",
      component: Chat,
      iconSource: { selected: "chat", unselected: "chat-outline" },
    },
    {
      name: "Profile",
      component: Profile,
      iconSource: { selected: "account", unselected: "account-outline" },
    },
  ];

  return (
    <View style={{ flex: 1, justifyContent: "flex-end" }}>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          tabBarActiveTintColor: lightTheme.colors.primary,
          tabBarStyle: { ...tabBarStyle, ...tabBarShadowStyle },
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
                      onPress={() => navigation.push("Sell")}
                    />
                  )
                : undefined,
            }}
          />
        ))}
      </Tab.Navigator>
    </View>
  );
};

export default MainBottomNav;

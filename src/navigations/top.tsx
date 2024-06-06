import React, { FC } from "react"
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs"
import { Text, useTheme } from "react-native-paper"

const Tab = createMaterialTopTabNavigator()

type Props = {
  tabs: {
    name: string
    component: FC
  }[]
}

const TopNavigation = ({ tabs }: Props) => {
  const { colors } = useTheme()

  return (
    <Tab.Navigator
      screenOptions={{
        // tabBarScrollEnabled: true,
        tabBarIndicatorStyle: {
          backgroundColor: colors.primary,
          height: 2,
        },
        tabBarStyle: { backgroundColor: "transparent" },
        lazy: true,
      }}
    >
      {tabs.map((tab) => (
        <Tab.Screen
          key={tab.name}
          options={{
            tabBarLabel: ({ focused }) => {
              return (
                <Text
                  style={{
                    color: focused ? colors.primary : colors.onBackground,
                    fontWeight: "bold",
                  }}
                >
                  {tab.name}
                </Text>
              )
            },
          }}
          component={tab.component}
          name={tab.name}
        />
      ))}
    </Tab.Navigator>
  )
}

export default TopNavigation

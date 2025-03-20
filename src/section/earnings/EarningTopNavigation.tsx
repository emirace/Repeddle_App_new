import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs"
import { Text, useTheme } from "react-native-paper"
import Today from "./Today"
import ThisWeek from "./ThisWeek"
import ThisMonth from "./ThisMonth"
import All from "./All"

const Tab = createMaterialTopTabNavigator()

export default function EarningNavigation() {
  const { colors } = useTheme()
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarScrollEnabled: true,
        tabBarIndicatorStyle: {
          backgroundColor: colors.primary,
          height: 2,
        },
        tabBarStyle: { backgroundColor: "transparent" },
      }}
    >
      <Tab.Screen
        options={{
          tabBarLabel: ({ focused }) => {
            return (
              <Text
                style={{
                  color: focused ? colors.primary : colors.primary,
                  fontWeight: "bold",
                }}
              >
                Today
              </Text>
            )
          },
        }}
        component={Today}
        name="Today"
      />
      <Tab.Screen
        options={{
          tabBarLabel: ({ focused }) => {
            return (
              <Text
                style={{
                  color: focused ? colors.primary : colors.primary,
                  fontWeight: "bold",
                }}
              >
                This Week
              </Text>
            )
          },
        }}
        component={ThisWeek}
        name="This Week"
      />

      <Tab.Screen
        options={{
          tabBarLabel: ({ focused }) => {
            return (
              <Text
                style={{
                  color: focused ? colors.primary : colors.primary,
                  fontWeight: "bold",
                }}
              >
                This Month
              </Text>
            )
          },
        }}
        component={ThisMonth}
        name="This Month"
      />
      <Tab.Screen
        options={{
          tabBarLabel: ({ focused }) => {
            return (
              <Text
                style={{
                  color: focused ? colors.primary : colors.primary,
                  fontWeight: "bold",
                }}
              >
                All
              </Text>
            )
          },
        }}
        component={All}
        name="All"
      />
    </Tab.Navigator>
  )
}

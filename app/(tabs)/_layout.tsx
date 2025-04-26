import { Tabs } from "expo-router";
import { View } from "react-native";

import HomeIcon from "@/assets/icons/HomeIcon.svg";
import HomeIconFilled from "@/assets/icons/HomeIconFilled.svg";
import RankIcon from "@/assets/icons/RankIcon.svg";
import RankIconFilled from "@/assets/icons/RankIconFilled.svg";
import BookIcon from "@/assets/icons/BookIcon.svg";
import BookIconFilled from "@/assets/icons/BookIconFilled.svg";
import ConfigIcon from "@/assets/icons/ConfigIcon.svg";
import ConfigIconFilled from "@/assets/icons/ConfigIconFilled.svg";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: "#ffffff",
          height: 60,
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarActiveTintColor: "#3995FF",
        tabBarInactiveTintColor: "#0040DD",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ focused }) =>
            focused ? (
              <HomeIconFilled width={28} height={28} />
            ) : (
              <HomeIcon width={24} height={24} />
            ),
        }}
      />
      <Tabs.Screen
        name="rank"
        options={{
          tabBarLabel: "Rank",
          tabBarIcon: ({ focused }) =>
            focused ? (
              <RankIconFilled width={28} height={28} />
            ) : (
              <RankIcon width={24} height={24} />
            ),
        }}
      />
      <Tabs.Screen
        name="summaries"
        options={{
          tabBarLabel: "Resumos",
          tabBarIcon: ({ focused }) =>
            focused ? (
              <BookIconFilled width={28} height={28} />
            ) : (
              <BookIcon width={24} height={24} />
            ),
        }}
      />
      <Tabs.Screen
        name="config"
        options={{
          tabBarLabel: "Config",
          tabBarIcon: ({ focused }) =>
            focused ? (
              <ConfigIconFilled width={28} height={28} />
            ) : (
              <ConfigIcon width={24} height={24} />
            ),
        }}
      />
    </Tabs>
  );
}

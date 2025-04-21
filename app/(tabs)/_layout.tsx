import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 0,
          elevation: 0,
          height: 60,
        },
      }}
    >
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="rank" options={{ title: "Rank" }} />
      <Tabs.Screen name="summaries" options={{ title: "Resumos" }} />
      <Tabs.Screen name="mindmaps" options={{ title: "Mapas Mentais" }} />
      <Tabs.Screen name="config" options={{ title: "Configurações" }} />
    </Tabs>
  );
}

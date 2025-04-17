import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="home" options={{ title: "Início" }} />
      <Tabs.Screen name="rank" options={{ title: "Rank" }} />
      <Tabs.Screen name="summaries" options={{ title: "Resumos" }} />
      <Tabs.Screen name="mindmaps" options={{ title: "Mapas Mentais" }} />
      <Tabs.Screen name="config" options={{ title: "Configurações" }} />
    </Tabs>
  );
}

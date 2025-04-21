import { Stack } from "expo-router";
import "../global.css";
import { SafeAreaView } from "react-native";

export default function RootLayout() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      {/* <StatusBar style="auto" />   */}
    </SafeAreaView>
  );
}

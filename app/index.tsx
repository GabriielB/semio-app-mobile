import { View, Text } from "react-native";
import SemioSplashLogo from "@/assets/images/SemioSplashLogo.svg";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace("/(auth)/login");
    }, 500);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <View className="bg-[#E3F2FF] w-full h-full items-center justify-center">
      <SemioSplashLogo width={300} height={300} />
    </View>
  );
}

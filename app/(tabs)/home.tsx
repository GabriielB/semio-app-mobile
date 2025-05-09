import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import SemioSplashLogo from "@/assets/images/SemioSplashLogo.svg";
import SemioHomePet from "@/assets/images/SemioHomePet.svg";
import StarIcon from "@/assets/icons/StarIcon.svg";
import MedalIcon from "@/assets/icons/MedalIcon.svg";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  const handleQuizzPress = () => {
    return router.push("/quizzes");
  };

  const handleMindmapPress = () => {
    return router.push("/mindmaps");
  };

  const handleCompetitive = () => {
    return router.push("/competitive");
  };

  return (
    <ScrollView
      className="bg-[#E3F2FF]"
      contentContainerStyle={{
        paddingVertical: 24,
        paddingHorizontal: 16,
        alignItems: "center",
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* estatisticas */}
      <View className="bg-white rounded-3xl w-full px-4 py-2 shadow-md">
        <View className="flex-row items-center justify-between">
          {/* pontos */}
          <View className="flex-1 items-center gap-1">
            <StarIcon width={25} height={25} />
            <Text className="text-black text-sm">Pontos</Text>
            <Text className="text-black font-bold text-base">
              {user?.total_points ?? 0}
            </Text>
          </View>

          {/* div */}
          <View className="w-[1px] h-[60px] bg-purple-200 mx-3" />

          {/* vitorias */}
          <View className="flex-1 items-center gap-1">
            <MedalIcon width={25} height={25} />
            <Text className="text-black text-sm">Vitórias</Text>
            <Text className="text-black font-bold text-base">
              {" "}
              {user?.total_wins ?? 0}
            </Text>
          </View>
        </View>
      </View>

      <View className="items-center">
        <SemioSplashLogo width={180} height={180} />
        <View className="mt-[-20px]">
          <SemioHomePet width={230} height={230} />
        </View>
      </View>

      <View className="gap-3 items-center mt-2">
        <TouchableOpacity
          className="w-[181px] h-[44px] bg-[#3995FF] rounded-3xl justify-center items-center"
          onPress={handleQuizzPress}
        >
          <Text className="text-white text-lg font-bold">QUIZZ</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="w-[256px] h-[44px] bg-[#0040DD] rounded-3xl justify-center items-center"
          onPress={handleCompetitive}
        >
          <Text className="text-white text-lg font-bold">Competitivo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="w-[256px] h-[44px] bg-[#007AFF] rounded-3xl justify-center items-center"
          onPress={handleMindmapPress}
        >
          <Text className="text-white text-lg font-bold">Mapas Mentais</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

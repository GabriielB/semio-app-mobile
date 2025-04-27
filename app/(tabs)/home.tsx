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
      {/* Estatísticas diretamente na tela */}
      <View className="bg-white rounded-3xl w-full px-4 py-4 shadow-md">
        <View className="flex-row items-center justify-between">
          {/* Pontos */}
          <View className="flex-1 items-center gap-1">
            <StarIcon width={25} height={25} />
            <Text className="text-black text-sm">Pontos</Text>
            <Text className="text-black font-bold text-base">
              {user?.total_points ?? 0}
            </Text>
          </View>

          {/* Divisor */}
          <View className="w-[1px] h-[60px] bg-purple-200 mx-3" />

          {/* Vitórias */}
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

      {/* Logo e Pet com menos espaçamento */}
      <View className="items-center">
        <SemioSplashLogo width={180} height={180} />
        <View className="mt-[-20px]">
          <SemioHomePet width={230} height={230} />
        </View>
      </View>

      {/* Botões */}
      <View className="gap-5 items-center mt-4">
        <TouchableOpacity
          className="w-[181px] h-[44px] bg-[#3995FF] rounded-3xl justify-center items-center"
          onPress={handleQuizzPress}
        >
          <Text className="text-white text-lg font-bold">QUIZZ</Text>
        </TouchableOpacity>

        <TouchableOpacity className="w-[256px] h-[44px] bg-[#0040DD] rounded-3xl justify-center items-center">
          <Text className="text-white text-lg font-bold">Competitivo</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

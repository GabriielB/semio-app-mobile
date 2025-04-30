import React from "react";
import { View, Text, TouchableOpacity, ImageBackground } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import ArrowLeftWhite from "@/assets/icons/ArrowLeftWhite.svg";

export default function QuizResultScreen() {
  const router = useRouter();
  const { total, correct } = useLocalSearchParams<{
    total: string;
    correct: string;
  }>();

  const totalNumber = parseInt(total || "1");
  const correctNumber = parseInt(correct || "0");
  const percentage = Math.round((correctNumber / totalNumber) * 100);

  return (
    <View className="flex-1">
      {/* header */}
      <View className="bg-[#007AFF] px-2 pt-12 pb-4">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeftWhite width={24} height={24} />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold flex-1 text-center mr-6">
            Quizz
          </Text>
        </View>
      </View>
      <View className="flex-1 justify-center items-center">
        <View className="bg-white rounded-3xl px-6 py-10 items-center shadow-lg w-full">
          {/* Progresso circular (simulado com texto por simplicidade) */}
          <View className="w-32 h-32 rounded-full border-[10px] border-[#007AFF] justify-center items-center mb-4">
            <Text className="text-2xl font-bold text-[#007AFF]">
              {percentage}%
            </Text>
          </View>

          <Text className="text-black text-base font-semibold mb-1">
            {correctNumber} / {totalNumber} Questões
          </Text>

          <Text className="text-[#007AFF] font-bold mb-4">+50 XP</Text>

          <Text className="text-lg font-bold text-[#31144B] mb-6">
            Bom Trabalho!
          </Text>

          {/* Botões */}
          <TouchableOpacity
            className="bg-[#007AFF] w-full py-3 rounded-full mb-3 items-center"
            onPress={() => router.back()}
          >
            <Text className="text-white font-bold text-base">
              Jogar Novamente
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="border border-[#007AFF] w-full py-3 rounded-full items-center"
            onPress={() => router.replace("/(tabs)/home")}
          >
            <Text className="text-[#007AFF] font-bold text-base">Sair</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

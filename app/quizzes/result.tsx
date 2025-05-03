import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import ArrowLeftWhite from "@/assets/icons/ArrowLeftWhite.svg";
import ProgressCircle from "@/components/ProgressCircle";

export default function QuizResultScreen() {
  const router = useRouter();
  const { id, total, correct, bonus } = useLocalSearchParams<{
    id: string;
    total: string;
    correct: string;
    bonus: string;
  }>();

  const totalNumber = parseInt(total || "1");
  const correctNumber = parseInt(correct || "0");
  const bonusPoints = parseInt(bonus || "0");
  const percentage = Math.round((correctNumber / totalNumber) * 100);
  const finalScore = percentage + bonusPoints;

  return (
    <View className="flex-1 bg-[#007AFF]">
      <View className="px-2 pt-12 pb-4">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeftWhite width={24} height={24} />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold flex-1 text-center mr-6">
            Quizz
          </Text>
        </View>
      </View>

      <View className="flex-1 bg-white rounded-t-3xl px-6 pt-10 pb-4 items-center">
        <View className="bg-white rounded-3xl px-6 py-10 items-center shadow-lg w-full justify-center mt-10">
          <ProgressCircle
            percentage={percentage}
            correct={correctNumber}
            total={totalNumber}
            bonus={bonusPoints}
            score={finalScore}
          />
        </View>

        <View className="gap-5 items-center mt-6 pt-4">
          <TouchableOpacity
            className="bg-[#0040DD] w-[256px] h-[44px] py-3 rounded-full items-center"
            onPress={() => router.replace(`/quizzes/${id}`)}
          >
            <Text className="text-white font-bold text-lg">
              Jogar Novamente
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="border-2 border-[#0040DD] w-[181px] h-[44px] py-3 rounded-full items-center"
            onPress={() => router.replace("/(tabs)/home")}
          >
            <Text className="text-[#1E1E1E] font-bold text-lg">Sair</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// app/competitive/challenge/[id]/winner.tsx

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/useAuthStore";
import ArrowLeft from "@/assets/icons/ArrowLeft.svg";
import StarIcon from "@/assets/icons/StarIcon.svg";

export default function ChallengeWinnerScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const user = useAuthStore((state) => state.user);
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlayers();
  }, []);

  async function loadPlayers() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("competition_players")
        .select("user_id, final_score, users (username, profile_picture)")
        .eq("competition_id", id)
        .order("final_score", { ascending: false });

      if (error) throw error;
      setPlayers(data || []);
    } catch (err) {
      console.error("Erro ao carregar ranking:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading || !user) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator color="#007AFF" />
      </View>
    );
  }

  const isWinner = players[0]?.user_id === user.id;
  const userData = players.find((p) => p.user_id === user.id);

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 pt-8 bg-white">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft width={24} height={24} />
          </TouchableOpacity>
          <Text className="text-black text-2xl font-bold flex-1 text-center mr-6">
            Resultado
          </Text>
        </View>
      </View>

      {/* Card */}
      <View className="flex-1 items-center justify-center">
        <View className="w-[90%] h-[60%] rounded-3xl bg-[#A4C4FF] items-center py-8 px-4 shadow-lg">
          <Text className="text-2xl font-bold text-black mb-3">
            {isWinner ? "Vencedor" : "Segundo colocado"}
          </Text>

          <View
            className={`border-4 ${
              isWinner ? "border-yellow-500" : "border-gray-300"
            } rounded-full p-1`}
          >
            <Image
              source={
                userData?.users?.profile_picture
                  ? { uri: userData.users.profile_picture }
                  : require("@/assets/images/default-profile.png")
              }
              className="w-[150px] h-[150px] rounded-full bg-gray-200"
            />
          </View>

          <Text className="mt-4 text-xl font-semibold text-black">
            {userData?.users?.username ?? "Usuário"}
          </Text>

          <View className="flex-row gap-1 items-center">
            <StarIcon width={20} height={20} />
            <Text className="mt-1 text-lg text-[#666]">
              {userData?.final_score != null
                ? `${userData.final_score} pontos`
                : "Calculando..."}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          className="mt-8 w-[220px] h-[44px] rounded-full border-2 border-[#0040DD] items-center justify-center"
          onPress={() => router.replace("/competitive")}
        >
          <Text className="text-[#0040DD] font-bold text-lg">Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

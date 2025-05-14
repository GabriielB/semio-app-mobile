import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/stores/useAuthStore";
import ArrowLeftWhite from "@/assets/icons/ArrowLeftWhite.svg";
import MedalIcon from "@/assets/icons/MedalIcon.svg";
import { competitionService } from "@/services/competitionService";

export default function CompletedChallengesScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchCompletedChallenges();
    }
  }, [user?.id]);

  const fetchCompletedChallenges = async () => {
    if (!user?.id) return;
    setLoading(true);

    try {
      const data = await competitionService.listCompletedChallenges(user.id);
      setChallenges(data);
    } catch (err) {
      console.error("Erro ao buscar desafios finalizados:", err);
    }

    setLoading(false);
  };

  const renderItem = ({ item }: { item: any }) => {
    const self = item.competition_players.find(
      (p: any) => p.user_id === user?.id
    );
    const opponent = item.competition_players.find(
      (p: any) => p.user_id !== user?.id
    );

    return (
      <View className="bg-white rounded-2xl p-4 mb-4 mx-4 shadow">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <Image
              source={
                opponent?.users?.profile_picture
                  ? { uri: opponent.users.profile_picture }
                  : require("@/assets/images/default-profile.png")
              }
              className="w-10 h-10 rounded-full bg-gray-300"
            />
            <View>
              <Text className="text-[#31144B] font-semibold">
                Contra: {opponent?.users?.username ?? "Jogador"}
              </Text>
              <Text className="text-sm text-[#666]">
                Quiz: {item.quizzes?.title ?? "Indefinido"}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() =>
              router.push(`/competitive/challenge/${item.id}/winner`)
            }
            className="bg-[#3995FF] px-4 py-2 rounded-full shadow-sm"
          >
            <Text className="text-white text-sm font-bold text-center">
              Visualizar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator color="#007AFF" size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#007AFF]">
      {/* Header */}
      <View className="pb-6 px-4 rounded-b-3xl bg-[#007AFF]">
        <View className="w-full h-20 flex-row items-center">
          <TouchableOpacity onPress={() => router.replace("/competitive")}>
            <ArrowLeftWhite width={24} height={24} />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-white flex-1 text-center mr-6">
            Finalizados
          </Text>
        </View>
      </View>

      {/* Lista */}
      <View className="flex-1 bg-white rounded-t-3xl -mt-6 pt-6">
        {loading ? (
          <ActivityIndicator size="large" color="#924BD0" className="mt-10" />
        ) : challenges.length > 0 ? (
          <FlatList
            data={challenges}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 40 }}
          />
        ) : (
          <Text className="text-center text-[#31144B] font-medium mt-10">
            Nenhum desafio finalizado.
          </Text>
        )}
      </View>
    </View>
  );
}

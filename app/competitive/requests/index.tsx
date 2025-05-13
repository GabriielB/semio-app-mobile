import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/stores/useAuthStore";
import { friendService } from "@/services/friendService";
import { competitionService } from "@/services/competitionService";
import ArrowLeftWhite from "@/assets/icons/ArrowLeftWhite.svg";
import { supabase } from "@/lib/supabase";

export default function RequestsScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [requests, setRequests] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadAll();
    }
  }, [user?.id]);

  const loadAll = async () => {
    setLoading(true);

    await supabase.auth.refreshSession(); // força nova sessão para evitar cache

    const [friendReqs, challengeReqs] = await Promise.all([
      friendService.listFriendRequests(user!.id),
      competitionService.listReceivedChallenges(user!.id),
    ]);

    setRequests(friendReqs || []);
    setChallenges(challengeReqs || []);
    setLoading(false);
  };

  const handleFriendAction = async (
    requestId: string,
    fromUserId: string,
    accept: boolean
  ) => {
    if (!accept) {
      await supabase
        .from("friend_requests")
        .update({ status: "rejected" })
        .eq("id", requestId);
      Alert.alert("Solicitação recusada");
    } else {
      const ok = await friendService.acceptFriendRequest(
        requestId,
        user!.id,
        fromUserId
      );
      if (ok) Alert.alert("Solicitação aceita");
    }

    loadAll();
  };

  const handleChallengeAction = async (
    competitionId: string,
    quizId: string
  ) => {
    try {
      await supabase.from("competition_players").insert({
        competition_id: competitionId,
        user_id: user!.id,
        score: 0,
      });

      await supabase
        .from("competitions")
        .update({ status: "accepted" })
        .eq("id", competitionId);

      router.replace(`/competitive/challenge/${competitionId}/play`);
    } catch (err: any) {
      console.error(err);
      Alert.alert("Erro", "Não foi possível aceitar o desafio.");
    }
  };

  const renderFriendItem = ({ item }: { item: any }) => (
    <View className="bg-white rounded-2xl p-4 mb-4 mx-4 shadow">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <Image
            source={
              item.users.profile_picture
                ? { uri: item.users.profile_picture }
                : require("@/assets/images/default-profile.png")
            }
            className="w-10 h-10 rounded-full bg-gray-300"
          />
          <Text className="text-[#31144B] font-semibold">
            {item.users.username}
          </Text>
        </View>

        <View className="flex-row gap-2">
          <TouchableOpacity
            className="bg-green-600 px-3 py-1 rounded-md"
            onPress={() => handleFriendAction(item.id, item.from_user, true)}
          >
            <Text className="text-white text-sm font-medium">Aceitar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-red-500 px-3 py-1 rounded-md"
            onPress={() => handleFriendAction(item.id, item.from_user, false)}
          >
            <Text className="text-white text-sm font-medium">Recusar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderChallengeItem = ({ item }: { item: any }) => {
    const challenger = item.competition_players?.find(
      (p: any) => p.user_id !== user?.id
    )?.users;

    if (!challenger) return null; // evita renderizar se estiver incompleto

    return (
      <View className="bg-white rounded-2xl p-4 mb-4 mx-4 shadow">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <Image
              source={
                challenger.profile_picture
                  ? { uri: challenger.profile_picture }
                  : require("@/assets/images/default-profile.png")
              }
              className="w-10 h-10 rounded-full bg-gray-300"
            />
            <View>
              <Text className="text-[#31144B] font-semibold">
                {challenger.username}
              </Text>
              <Text className="text-sm text-[#666]">{item.quizzes?.title}</Text>
            </View>
          </View>

          <View className="flex-row gap-2">
            <TouchableOpacity
              className="bg-green-600 px-3 py-1 rounded-md"
              onPress={() => handleChallengeAction(item.id, item.quiz_id)}
            >
              <Text className="text-white text-sm font-medium">Aceitar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-red-500 px-3 py-1 rounded-md"
              onPress={() => handleRejectChallenge(item.id)}
            >
              <Text className="text-white text-sm font-medium">Recusar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const handleRejectChallenge = async (competitionId: string) => {
    try {
      const { data, error } = await supabase
        .from("competitions")
        .update({ status: "rejected" })
        .eq("id", competitionId)
        .select();

      console.log("Resultado do update:", data, error);

      if (error) throw error;

      setChallenges((prev) => prev.filter((c) => c.id !== competitionId));
      Alert.alert("Desafio recusado.");
      loadAll(); //
    } catch (err: any) {
      console.error(err);
      Alert.alert("Erro", "Não foi possível recusar o desafio.");
    }
  };

  return (
    <View className="flex-1 bg-[#007AFF]">
      <View className="pb-6 px-4 rounded-b-3xl bg-[#007AFF]">
        <View className="w-full h-20 flex-row items-center">
          <TouchableOpacity
            onPress={() => router.replace("/competitive?refresh=true")}
          >
            <ArrowLeftWhite width={24} height={24} />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-white flex-1 text-center mr-6">
            Solicitações
          </Text>
        </View>
      </View>

      <View className="flex-1 bg-white rounded-t-3xl -mt-6 pt-6">
        {loading ? (
          <ActivityIndicator size="large" color="#924BD0" className="mt-10" />
        ) : (
          <FlatList
            ListHeaderComponent={
              <>
                {requests.length > 0 && (
                  <Text className="text-xl font-bold text-[#31144B] mb-2 px-4">
                    Amizades
                  </Text>
                )}
              </>
            }
            data={requests}
            keyExtractor={(item) => item.id}
            renderItem={renderFriendItem}
            ListFooterComponent={
              <>
                {challenges.length > 0 && (
                  <>
                    <Text className="text-xl font-bold text-[#31144B] mb-2 px-4 mt-6">
                      Desafios
                    </Text>
                    <FlatList
                      data={challenges}
                      keyExtractor={(item) => item.id}
                      renderItem={renderChallengeItem}
                      scrollEnabled={false}
                    />
                  </>
                )}
                {requests.length === 0 && challenges.length === 0 && (
                  <Text className="text-center text-[#31144B] font-medium mt-10">
                    Nenhuma solicitação pendente.
                  </Text>
                )}
              </>
            }
            contentContainerStyle={{ paddingBottom: 40 }}
          />
        )}
      </View>
    </View>
  );
}

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useAuthStore } from "@/stores/useAuthStore";
import { friendService, Friend } from "@/services/friendService";
import ArrowLeftWhite from "@/assets/icons/ArrowLeftWhite.svg";
import { useRouter } from "expo-router";
import AddFriendIcon from "@/assets/icons/AddFriendIcon.svg";
import BellIcon from "@/assets/icons/BellIcon.svg";
import ChallengeIcon from "@/assets/icons/ChallengeIcon.svg";
import TrashIcon from "@/assets/icons/TrashIcon.svg";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { supabase } from "@/lib/supabase";

export default function FriendsScreen() {
  const user = useAuthStore((state) => state.user);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasPendingRequests, setHasPendingRequests] = useState(false);

  const checkPendingRequests = async () => {
    if (!user?.id) return;
    const { data, error } = await supabase
      .from("friend_requests")
      .select("id")
      .eq("user_id", user.id)
      .eq("status", "pending");

    setHasPendingRequests(!!data && data.length > 0);
  };

  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      loadFriends();
      checkPendingRequests();
    }, [])
  );

  const loadFriends = async () => {
    setLoading(true);
    if (!user?.id) return;

    const data = await friendService.listFriends(user.id);
    if (data) setFriends(data);
    setLoading(false);
  };

  const handleDelete = async (friendId: string) => {
    if (!user?.id) return;
    const success = await friendService.deleteFriend(user.id, friendId);
    if (success) {
      Alert.alert("Amigo removido");
      loadFriends();
    }
  };

  const confirmDelete = (friendId: string, friendName: string) => {
    Alert.alert(
      "Confirmar exclusão",
      `Você tem certeza que deseja excluir o amigo(a) ${friendName}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => handleDelete(friendId),
        },
      ]
    );
  };

  const handleChallenge = (friendId: string) => {
    router.push(`/competitive/challenge/${friendId}`);
  };

  const renderItem = ({ item }: { item: Friend }) => (
    <View className="bg-white px-3 py-6 mb-4 mx-4 rounded-2xl flex-row items-center justify-between shadow-md">
      <View className="flex-row items-center gap-2">
        <Image
          source={
            item.users.profile_picture
              ? { uri: item.users.profile_picture }
              : require("@/assets/images/default-profile.png")
          }
          className="w-[45px] h-[45px] rounded-full bg-gray-300"
        />
        <Text className="text-[#924BD0] font-semibold text-lg">
          {item.users.username}
        </Text>
      </View>

      <View className="flex-row items-center gap-2">
        <TouchableOpacity
          onPress={() => handleChallenge(item.users.id)}
          className="flex-row items-center gap-1"
        >
          <Text className="text-base text-[#31144B] font-semibold">
            Desafiar
          </Text>
          <ChallengeIcon />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => confirmDelete(item.users.id, item.users.username)}
          className="flex-row items-center gap-1 border border-[#D51B1B] rounded-md px-3 py-1"
        >
          <Text className="text-base text-red-600">Excluir</Text>
          <TrashIcon />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-[#007AFF]">
      <View className="pb-6 px-4 my-2 rounded-b-3xl bg-[#007AFF]">
        <View className="w-full h-20 flex-row items-center">
          <TouchableOpacity onPress={() => router.replace("/(tabs)/home")}>
            <ArrowLeftWhite width={24} height={24} />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-white flex-1 text-center mr-6">
            Competitivo
          </Text>
        </View>

        <View className="flex-row justify-between items-center my-2 px-4">
          <Text className="text-xl font-semibold text-white">Meus Amigos</Text>

          <View className="flex-row gap-5">
            <TouchableOpacity
              onPress={() => router.push("/competitive/requests")}
            >
              <View className="relative">
                <BellIcon width={26} height={26} />
                {hasPendingRequests && (
                  <View className="w-2 h-2 bg-red-500 rounded-full absolute top-0 right-0" />
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/competitive/add-friend")}
            >
              <AddFriendIcon width={26} height={26} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View className="flex-1 bg-white py-4 rounded-t-3xl -my-6">
        {loading ? (
          <ActivityIndicator size="large" color="#924BD0" className="mt-10" />
        ) : (
          <FlatList
            data={friends}
            keyExtractor={(item) => item.friend_id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 40 }}
            ListEmptyComponent={
              <Text className="text-center text-[#31144B] mt-10 font-medium text-base">
                Você não possui nenhum amigo adicionado.
              </Text>
            }
          />
        )}
      </View>
    </View>
  );
}

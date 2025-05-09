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
import ArrowLeftWhite from "@/assets/icons/ArrowLeftWhite.svg";
import { supabase } from "@/lib/supabase";

export default function RequestsScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadRequests();
    }
  }, [user?.id]);

  const loadRequests = async () => {
    setLoading(true);
    const data = await friendService.listFriendRequests(user!.id);
    if (data) setRequests(data);
    setLoading(false);
  };

  const handleAction = async (
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

    loadRequests();
  };

  const renderItem = ({ item }: { item: any }) => (
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
            onPress={() => handleAction(item.id, item.from_user, true)}
          >
            <Text className="text-white text-sm font-medium">Aceitar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-red-500 px-3 py-1 rounded-md"
            onPress={() => handleAction(item.id, item.from_user, false)}
          >
            <Text className="text-white text-sm font-medium">Recusar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

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
        ) : requests.length === 0 ? (
          <Text className="text-center text-[#31144B] font-medium mt-10">
            Nenhuma solicitação pendente.
          </Text>
        ) : (
          <FlatList
            data={requests}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 40 }}
          />
        )}
      </View>
    </View>
  );
}

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/useAuthStore";
import { friendService } from "@/services/friendService";
import ArrowLeftWhite from "@/assets/icons/ArrowLeftWhite.svg";
import SendIcon from "@/assets/icons/SendIcon.svg";

export default function AddFriendScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [success, setSuccess] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    setResult(null);
    setSuccess(false);

    const { data, error } = await supabase
      .from("users")
      .select("id, username, profile_picture")
      .or(`username.eq.${search},email.eq.${search}`)
      .neq("id", user?.id)
      .single();

    if (error || !data) {
      Alert.alert("Usuário não encontrado");
      setLoading(false);
      return;
    }

    setResult(data);
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!user?.id || !result?.id) return;

    const ok = await friendService.sendFriendRequest(result.id, user.id);
    if (ok) {
      setSuccess(true);
      setSearch("");
      setResult(null);
    } else {
      Alert.alert("Erro", "Não foi possível enviar a solicitação.");
    }
  };

  return (
    <View className="flex-1 bg-[#007AFF]">
      <View className="pb-6 px-4 my-2 rounded-b-3xl bg-[#007AFF]">
        <View className="w-full h-20 flex-row items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeftWhite width={24} height={24} />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-white flex-1 text-center mr-6">
            Adicionar Amigo
          </Text>
        </View>
      </View>

      <View className="flex-1 bg-white rounded-t-3xl -mt-6 px-4 pt-6">
        <Text className="text-[#31144B] text-base mb-2 font-semibold">
          Buscar por nome de usuário ou e-mail:
        </Text>

        <TextInput
          placeholder="Digite aqui..."
          placeholderTextColor="#aaa"
          value={search}
          onChangeText={setSearch}
          className="border border-[#924BD0] rounded-xl px-4 py-3 mb-4 text-black"
        />

        <TouchableOpacity
          className="bg-[#007AFF] py-3 rounded-xl items-center mb-6"
          onPress={handleSearch}
          disabled={loading}
        >
          <Text className="text-white font-semibold text-base">Buscar</Text>
        </TouchableOpacity>

        {loading && <ActivityIndicator color="#924BD0" />}

        {result && !success && (
          <View className="flex-row items-center justify-between bg-[#F9F9F9] px-4 py-4 rounded-xl mb-4">
            <View className="flex-row items-center gap-3">
              <Image
                source={
                  result.profile_picture
                    ? { uri: result.profile_picture }
                    : require("@/assets/images/default-profile.png")
                }
                className="w-[40px] h-[40px] rounded-full bg-gray-300"
              />
              <Text className="text-[#924BD0] font-medium text-lg">
                {result.username}
              </Text>
            </View>

            <TouchableOpacity
              className="bg-green-600 px-3 py-1 rounded-md"
              onPress={handleAdd}
            >
              <Text className="text-white font-semibold">Adicionar</Text>
            </TouchableOpacity>
          </View>
        )}

        {success && (
          <View className="items-center py-10">
            <Text className="text-[#924BD0] text-lg font-semibold mb-4">
              Convite enviado com sucesso
            </Text>
            <SendIcon />
          </View>
        )}
      </View>
    </View>
  );
}

import { View, Text, TouchableOpacity, Pressable } from "react-native";
import ArrowLeft from "@/assets/icons/ArrowLeft.svg";
import ArrowRight from "@/assets/icons/ArrowRight.svg";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { supabase } from "@/lib/supabase";

export default function ConfigScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      await SecureStore.deleteItemAsync("user_id");
      await SecureStore.deleteItemAsync("access_token");
      await SecureStore.deleteItemAsync("refresh_token");
      router.replace("/login");
    } catch (error) {
      console.error("Erro ao deslogar:", error);
    }
  };

  return (
    <View className="flex-1 bg-white px-4 justify-between">
      {/* Header */}
      <View>
        <View className="pt-6 pb-4 flex-row items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft width={24} height={24} />
          </TouchableOpacity>
          <Text className="text-[#31144B] text-2xl font-bold flex-1 text-center mr-6">
            Configurações
          </Text>
        </View>

        {/* Seção: Conta */}
        <View className="mt-4 pt-2">
          <Text className="text-lg font-bold text-[#31144B] mb-4">Conta</Text>

          <View className="bg-[#E1F4FF] rounded-2xl shadow-md p-2">
            <Pressable
              className="flex-row justify-between items-center px-5 py-4"
              onPress={() => router.push("/preferences")}
            >
              <Text className="text-base text-[#1E1E1E] font-semibold">
                Preferências
              </Text>
              <ArrowRight />
            </Pressable>

            <View className="h-px bg-[#924BD0] mx-5" />

            <Pressable
              className="flex-row justify-between items-center px-5 py-4"
              onPress={() => router.push("/profile")}
            >
              <Text className="text-base text-[#1E1E1E] font-semibold">
                Perfil
              </Text>
              <ArrowRight />
            </Pressable>
          </View>
        </View>
      </View>

      {/* Rodapé */}
      <View className="mb-6">
        <TouchableOpacity
          className="border border-[#0040DD] rounded-full w-full mx-auto py-2 items-center"
          onPress={handleLogout}
        >
          <Text className="text-[#0040DD] font-bold text-base">Sair</Text>
        </TouchableOpacity>

        <View className="mt-4 mb-4 pb-2">
          <Text className="text-[#007AFF] text-base font-bold">
            TEMOS DE USO
          </Text>
          <Text className="text-[#007AFF] text-base font-bold">
            POLÍTICA DE PRIVACIDADE
          </Text>
        </View>
      </View>
    </View>
  );
}

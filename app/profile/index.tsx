import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/stores/useAuthStore";
import ArrowLeft from "@/assets/icons/ArrowLeft.svg";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "@/lib/supabase";

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const [loading, setLoading] = useState(false);

  const handleImagePick = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permissão negada", "Permita o acesso à galeria.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (result.canceled || result.assets.length === 0) return;

      const image = result.assets[0];

      setLoading(true);

      const fileExt = image.uri.split(".").pop() || "jpg";
      const fileName = `${user?.id}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const res = await fetch(image.uri);
      const blob = await res.blob();

      const { error: uploadError } = await supabase.storage
        .from("profile-pictures")
        .upload(filePath, blob, {
          contentType: blob.type || "image/jpeg",
          upsert: true,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        Alert.alert("Erro", uploadError.message);
        return;
      }

      const { data } = supabase.storage
        .from("profile-pictures")
        .getPublicUrl(filePath);

      const publicUrl = data.publicUrl;

      const { error: updateError } = await supabase
        .from("users")
        .update({ profile_picture: publicUrl })
        .eq("id", user?.id);

      if (updateError) {
        console.error("Erro ao atualizar perfil:", updateError);
        Alert.alert("Erro", "Erro ao atualizar perfil.");
        return;
      }

      updateUser({ profile_picture: publicUrl });
      Alert.alert("Sucesso", "Foto de perfil atualizada!");
    } catch (e: any) {
      console.error("Erro inesperado:", e);
      Alert.alert("Erro", e.message || "Erro inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white px-4 pt-12">
      <View className="pt-6 pb-4 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft width={24} height={24} />
        </TouchableOpacity>
        <Text className="text-[#31144B] text-2xl font-bold flex-1 text-center mr-6">
          Configurações
        </Text>
      </View>

      <TouchableOpacity onPress={handleImagePick} className="items-center mb-6">
        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : (
          <Image
            source={
              user?.profile_picture
                ? { uri: user.profile_picture }
                : require("@/assets/images/default-profile.png")
            }
            className="w-32 h-32 rounded-full bg-gray-300"
            resizeMode="cover"
          />
        )}
        <Text className="text-sm text-[#007AFF] font-semibold mt-1">
          Foto de perfil
        </Text>
      </TouchableOpacity>

      <View className="gap-4 mb-10 w-full">
        <View className="bg-[#F4F4F4] rounded-xl px-4 py-2">
          <Text className="text-xs text-[#777] mb-1">Email</Text>
          <Text className="text-base text-[#1E1E1E]">{user?.email}</Text>
        </View>

        <View className="bg-[#F4F4F4] rounded-xl px-4 py-2">
          <Text className="text-xs text-[#777] mb-1">Nome de usuário</Text>
          <Text className="text-base text-[#1E1E1E]">{user?.username}</Text>
        </View>
      </View>

      <TouchableOpacity
        className="bg-[#0040DD] py-3 rounded-full items-center"
        onPress={() =>
          Alert.alert("Em breve", "Função de editar perfil será implementada.")
        }
      >
        <Text className="text-white font-bold text-base">Editar Perfil</Text>
      </TouchableOpacity>
    </View>
  );
}

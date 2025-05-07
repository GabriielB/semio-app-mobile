import React, { useEffect, useState } from "react";
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
import * as FileSystem from "expo-file-system";
import Constants from "expo-constants";
import { supabase } from "@/lib/supabase";

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const [loading, setLoading] = useState(false);

  const supabaseUrl = Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_URL!;

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      }
    })();
  }, []);

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
      const fileUri = image.uri;
      const fileExt = fileUri.split(".").pop() || "jpg";
      const fileName = `${user?.id}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      setLoading(true);

      const base64 = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // converte base64 para array de bytes
      const binaryString = atob(base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      await supabase.storage.from("profile-pictures").remove([filePath]);

      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;

      const supabaseUrl =
        Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_URL!;
      const uploadRes = await fetch(
        `${supabaseUrl}/storage/v1/object/profile-pictures/${filePath}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "image/jpeg",
            Authorization: `Bearer ${accessToken}`,
          },
          body: bytes,
        }
      );

      if (!uploadRes.ok) {
        console.error("Erro ao fazer upload:", await uploadRes.text());
        Alert.alert("Erro", "Falha ao enviar imagem para o Supabase.");
        return;
      }

      const { data } = await supabase.storage
        .from("profile-pictures")
        .getPublicUrl(filePath);

      const rawPublicUrl = data.publicUrl;
      const publicUrl = `${rawPublicUrl}?v=${Date.now()}`; // quebrando o cache

      const { error: updateError } = await supabase
        .from("users")
        .update({ profile_picture: rawPublicUrl })
        .eq("id", user?.id);

      if (updateError) {
        console.error("Erro ao atualizar perfil:", updateError);
        Alert.alert("Erro", "Erro ao atualizar perfil.");
        return;
      }

      // func para atualizara a store com cache quebrado
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
    <View className="flex-1 bg-white px-4">
      <View className="pt-6 pb-4 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft width={24} height={24} />
        </TouchableOpacity>
        <Text className="text-[#31144B] text-2xl font-bold flex-1 text-center mr-6">
          Configurações
        </Text>
      </View>

      <TouchableOpacity
        onPress={handleImagePick}
        className="items-center mb-6 pt-2"
      >
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
        <Text className="text-sm text-[#924BD0] font-semibold mt-1">
          Foto de perfil
        </Text>
      </TouchableOpacity>

      <View className="gap-4 mb-10 w-full">
        <Text className="text-base text-[#1E1E1E]">Email</Text>
        <View className="bg-[#F4F4F4] rounded-lg px-4 py-2 border border-[#924BD0]">
          <Text className="text-base text-[#1E1E1E]">{user?.email}</Text>
        </View>

        <Text className="text-base text-[#1E1E1E] mt-4">Nome de usuário</Text>
        <View className="bg-[#F4F4F4] rounded-lg px-4 py-2 border border-[#924BD0]">
          <Text className="text-base text-[#1E1E1E]">{user?.username}</Text>
        </View>
      </View>

      {/* <TouchableOpacity
        className="bg-[##31144B] py-3 rounded-full items-center"
        onPress={() =>
         
        }
      >
        <Text className="text-white font-bold text-base">Editar Perfil</Text>
      </TouchableOpacity> */}
    </View>
  );
}

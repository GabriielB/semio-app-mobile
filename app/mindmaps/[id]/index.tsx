import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Linking,
  Alert,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import ArrowLeftWhite from "@/assets/icons/ArrowLeftWhite.svg";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

const { height } = Dimensions.get("window");

export default function MindmapDetailScreen() {
  const router = useRouter();
  const { title, fileUrl, coverImage } = useLocalSearchParams<{
    title: string;
    fileUrl: string;
    coverImage: string;
  }>();

  if (!fileUrl || typeof fileUrl !== "string") {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-red-500 font-bold text-lg">
          Arquivo inválido ou não encontrado.
        </Text>
      </View>
    );
  }

  async function handleShare() {
    try {
      const filename = fileUrl.split("/").pop();
      if (!FileSystem.documentDirectory) {
        throw new Error("Diretório de documentos não disponível.");
      }
      const fileUri = FileSystem.documentDirectory + filename;

      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (!fileInfo.exists) {
        const downloadResumable = FileSystem.createDownloadResumable(
          fileUrl,
          fileUri
        );
        await downloadResumable.downloadAsync();
      }

      await Sharing.shareAsync(fileUri);
    } catch (error) {
      console.error("Erro ao compartilhar o arquivo:", error);
      Alert.alert("Erro", "Não foi possível compartilhar o mapa mental.");
    }
  }

  async function handleOpenInBrowser() {
    try {
      await Linking.openURL(fileUrl);
    } catch (error) {
      console.error("Erro ao abrir no navegador:", error);
      Alert.alert("Erro", "Não foi possível abrir o mapa mental no navegador.");
    }
  }

  return (
    <View className="flex-1 bg-[#007AFF]">
      <View className="px-4 pt-12 pb-4 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeftWhite width={24} height={24} />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold flex-1 text-center mr-6">
          {title}
        </Text>
      </View>

      <ScrollView
        className="flex-1 bg-white rounded-t-3xl px-4 pt-6"
        contentContainerStyle={{ alignItems: "center", paddingBottom: 32 }}
      >
        <Image
          source={
            coverImage
              ? { uri: coverImage }
              : require("@/assets/images/default-quiz.png")
          }
          style={{
            width: "100%",
            height: height * 0.45,
            borderRadius: 16,
            marginBottom: 24,
          }}
          resizeMode="cover"
        />

        <TouchableOpacity
          className="bg-[#0040DD] w-[80%] py-3 rounded-full items-center mb-4"
          onPress={handleShare}
        >
          <Text className="text-white font-bold text-lg">Compartilhar PDF</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="border-2 border-[#0040DD] w-[80%] py-3 rounded-full items-center"
          onPress={handleOpenInBrowser}
        >
          <Text className="text-[#0040DD] font-bold text-lg">
            Abrir no Navegador
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

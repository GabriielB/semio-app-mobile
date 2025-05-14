import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
  ImageBackground,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import ArrowLeftWhite from "@/assets/icons/ArrowLeftWhite.svg";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/useAuthStore";
import { Dropdown } from "react-native-element-dropdown";
import { competitionService } from "@/services/competitionService";

export default function ChallengeScreen() {
  const { friendId } = useLocalSearchParams();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const [friend, setFriend] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<string>("");

  useEffect(() => {
    if (!user?.id || typeof friendId !== "string") return;
    loadFriend(friendId);
    loadCategories();
  }, []);

  const loadFriend = async (id: string) => {
    const { data, error } = await supabase
      .from("users")
      .select("id, username, profile_picture")
      .eq("id", id)
      .single();

    if (!error) setFriend(data);
    setLoading(false);
  };

  const loadCategories = async () => {
    const { data } = await supabase
      .from("quizzes")
      .select("category")
      .neq("category", "")
      .order("category");

    const unique = [...new Set(data?.map((q) => q.category))];
    setCategories(unique);
  };

  const loadQuizzes = async (category: string) => {
    setQuizzes([]);
    setSelectedQuiz("");
    const { data } = await supabase
      .from("quizzes")
      .select("id, title")
      .eq("category", category);
    if (data) setQuizzes(data);
  };

  const handleStartChallenge = async () => {
    if (!selectedQuiz || !friend || !user?.id) {
      Alert.alert("Atenção", "Selecione um quiz.");
      return;
    }

    try {
      setLoading(true);

      const competitionId = await competitionService.createCompetition(
        user.id,
        friend.id,
        selectedQuiz
      );

      router.replace(`/competitive/challenge/${competitionId}/play`);
    } catch (error: any) {
      console.error(error);
      Alert.alert("Erro", error.message || "Erro ao criar desafio.");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !friend || !user) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#924BD0" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#007AFF]">
      <View className="pb-6 px-4 my-2 rounded-b-3xl bg-[#007AFF]">
        <View className="w-full h-20 flex-row items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeftWhite width={24} height={24} />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-white flex-1 text-center mr-6">
            Competitivo
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1 bg-white rounded-t-3xl px-4 pt-8"
        contentContainerStyle={{ alignItems: "center", paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="w-full items-center px-4 mb-8">
          <ImageBackground
            source={require("@/assets/images/VersusPNG.png")}
            resizeMode="cover"
            style={{
              width: "100%",
              aspectRatio: 369 / 233,
              justifyContent: "center",
              alignItems: "center",
            }}
            imageStyle={{
              borderRadius: 20,
            }}
          >
            {/* Avatar da esquerda (usuário) */}
            <View
              style={{
                position: "absolute",
                left: 24,
                top: "50%",
                transform: [{ translateY: -50 }],
                alignItems: "center",
              }}
            >
              <Image
                source={
                  user?.profile_picture
                    ? { uri: user.profile_picture }
                    : require("@/assets/images/default-profile.png")
                }
                className="w-20 h-20 rounded-full bg-gray-200"
              />
              <Text
                className="text-[#FBFBFB] text-base font-bold text-center mt-2 w-24"
                numberOfLines={1}
              >
                {user?.username}
              </Text>
            </View>

            {/* avatar da direita (amigo) */}
            <View
              style={{
                position: "absolute",
                right: 24,
                top: "50%",
                transform: [{ translateY: -50 }],
                alignItems: "center",
              }}
            >
              <Image
                source={
                  friend.profile_picture
                    ? { uri: friend.profile_picture }
                    : require("@/assets/images/default-profile.png")
                }
                className="w-20 h-20 rounded-full bg-gray-200"
              />
              <Text
                className="text-[#FBFBFB] text-base font-bold text-center mt-2 w-24"
                numberOfLines={1}
              >
                {friend.username}
              </Text>
            </View>
          </ImageBackground>
        </View>

        {/* dropdowns */}
        <Dropdown
          style={{
            height: 50,
            width: "100%",
            borderWidth: 1,
            borderColor: "#924BD0",
            borderRadius: 10,
            paddingHorizontal: 12,
            marginBottom: 16,
          }}
          placeholder="Escolher Categoria"
          data={categories.map((c) => ({ label: c, value: c }))}
          value={selectedCategory}
          labelField="label"
          valueField="value"
          onChange={(item) => {
            setSelectedCategory(item.value);
            loadQuizzes(item.value);
          }}
        />

        <Dropdown
          style={{
            height: 50,
            width: "100%",
            borderWidth: 1,
            borderColor: "#924BD0",
            borderRadius: 10,
            paddingHorizontal: 12,
            marginBottom: 24,
          }}
          placeholder="Selecionar Quiz"
          data={quizzes.map((q) => ({ label: q.title, value: q.id }))}
          value={selectedQuiz}
          labelField="label"
          valueField="value"
          onChange={(item) => setSelectedQuiz(item.value)}
        />

        <TouchableOpacity
          className="bg-[#3995FF] w-[257px] py-3 px-4 rounded-3xl mt-8"
          onPress={handleStartChallenge}
        >
          <Text className="text-white text-base font-bold text-center">
            Iniciar Desafio
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import ArrowLeftWhite from "@/assets/icons/ArrowLeftWhite.svg";
import ProgressCircle from "@/components/ProgressCircle";
import { supabase } from "@/lib/supabase";

export default function ChallengeResultScreen() {
  const router = useRouter();
  const confettiRef = useRef<LottieView>(null);

  const { id, total, correct, bonus } = useLocalSearchParams<{
    id: string;
    total: string;
    correct: string;
    bonus: string;
  }>();

  const totalNumber = parseInt(total || "1");
  const correctNumber = parseInt(correct || "0");
  const bonusPoints = parseInt(bonus || "0");
  const percentage = Math.round((correctNumber / totalNumber) * 100);
  const finalScore = percentage + bonusPoints;

  const [bothFinished, setBothFinished] = useState<boolean | null>(null);

  useEffect(() => {
    if (percentage >= 70) {
      confettiRef.current?.play();
    }
    checkIfBothPlayersFinished();
  }, []);

  async function checkIfBothPlayersFinished() {
    try {
      const { data, error } = await supabase
        .from("competition_players")
        .select("user_id, finished")
        .eq("competition_id", id);

      if (error) throw error;

      const uniqueFinishedUserIds = Array.from(
        new Set(
          (data || []).filter((p) => p.finished === true).map((p) => p.user_id)
        )
      );

      setBothFinished(uniqueFinishedUserIds.length >= 2);
    } catch (err) {
      console.error("Erro ao verificar jogadores:", err);
      setBothFinished(false);
    }
  }

  return (
    <View style={styles.container}>
      {/* condicional do confeti */}
      {percentage >= 70 && (
        <View pointerEvents="none" style={styles.confettiOverlay}>
          <LottieView
            ref={confettiRef}
            source={require("@/assets/animations/confetti.json")}
            autoPlay
            loop={false}
            style={styles.confetti}
          />
        </View>
      )}

      {/* Header */}
      <View className="px-2 pt-12 pb-4 z-20">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeftWhite width={24} height={24} />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold flex-1 text-center mr-6">
            Resultado
          </Text>
        </View>
      </View>

      <View className="flex-1 bg-white rounded-t-3xl px-6 pt-10 pb-4 items-center z-20">
        <View className="bg-white rounded-3xl px-6 py-10 items-center shadow-lg w-full justify-center mt-10">
          <ProgressCircle
            percentage={percentage}
            correct={correctNumber}
            total={totalNumber}
            bonus={bonusPoints}
            score={finalScore}
          />
        </View>

        <View className="gap-5 items-center mt-6 pt-4">
          {bothFinished === null ? (
            <ActivityIndicator color="#0040DD" />
          ) : bothFinished ? (
            <TouchableOpacity
              className="bg-[#0040DD] w-[256px] h-[44px] py-3 rounded-full items-center"
              onPress={() =>
                router.replace(`/competitive/challenge/${id}/winner`)
              }
            >
              <Text className="text-white font-bold text-lg">Ver Ranking</Text>
            </TouchableOpacity>
          ) : (
            <View className="bg-gray-700 w-[256px] h-[44px] py-3 rounded-full items-center justify-center">
              <Text className="text-white font-bold text-lg">
                Aguardando jogador...
              </Text>
            </View>
          )}

          <TouchableOpacity
            className="border-2 border-[#0040DD] w-[181px] h-[44px] py-3 rounded-full items-center"
            onPress={() => router.replace("/(tabs)/home")}
          >
            <Text className="text-[#1E1E1E] font-bold text-lg">Sair</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#007AFF",
    position: "relative",
  },
  confettiOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 100,
  },
  confetti: {
    width: "100%",
    height: "100%",
  },
});

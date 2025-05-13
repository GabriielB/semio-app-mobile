import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import ArrowLeftWhite from "@/assets/icons/ArrowLeftWhite.svg";
import { fetchQuestionsByQuizId } from "@/services/questionService";
import { supabase } from "@/lib/supabase";

export default function CompetitiveQuizPlayScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [bonusPoints, setBonusPoints] = useState(0);

  useEffect(() => {
    loadQuestions();
  }, []);

  useEffect(() => {
    if (!loading) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            handleNextQuestion(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current!);
  }, [loading, currentIndex]);

  async function loadQuestions() {
    try {
      const { data: competition, error } = await supabase
        .from("competitions")
        .select("quiz_id")
        .eq("id", id)
        .single();

      if (error || !competition?.quiz_id) {
        throw new Error("Competição não encontrada.");
      }

      const data = await fetchQuestionsByQuizId(competition.quiz_id);
      setQuestions(data);
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Não foi possível carregar as perguntas.");
    } finally {
      setLoading(false);
    }
  }

  function handleNextQuestion(
    option: { text: string; correct: boolean } | null
  ) {
    clearInterval(intervalRef.current!);

    if (option?.correct) {
      setScore((prev) => prev + 1);
      const bonus = Math.round((timeLeft / 60) * 10);
      setBonusPoints((prev) => prev + bonus);
    }

    setTimeout(() => {
      setSelected(null);
      setTimeLeft(60);
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        router.push({
          pathname: "/competitive/challenge/[id]/results",
          params: {
            id,
            total: questions.length,
            correct: score + (option?.correct ? 1 : 0),
            bonus:
              bonusPoints +
              (option?.correct ? Math.round((timeLeft / 60) * 10) : 0),
          },
        });
      }
    }, 700);
  }

  const question = questions[currentIndex] ?? null;

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#007AFF]">
        <ActivityIndicator color="#fff" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#007AFF]">
      {/* Header */}
      <View className="px-2 pt-12 pb-4">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeftWhite width={24} height={24} />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold flex-1 text-center mr-6">
            Quizz
          </Text>
        </View>
      </View>

      <View className="flex-1 bg-white rounded-t-3xl shadow-lg overflow-hidden">
        {!question ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-center text-base text-gray-500 mt-6">
              Nenhuma pergunta disponível.
            </Text>
          </View>
        ) : (
          <>
            <ScrollView className="px-4 mb-16">
              <View className="flex-row justify-center items-center my-4 pt-4">
                <Text className="text-[#1E1E1E] font-bold text-center text-xl">
                  Questão {currentIndex + 1}
                </Text>
              </View>

              <View className="bg-white rounded-2xl p-2">
                <Image
                  source={
                    question.media
                      ? { uri: question.media }
                      : require("@/assets/images/default-quiz.png")
                  }
                  className="w-full h-[230px] rounded-2xl mb-4"
                  resizeMode="cover"
                />

                <Text className="text-base text-[#1E1E1E] font-semibold mb-6 mt-3">
                  {question.description}
                </Text>

                <View className="flex-row flex-wrap justify-between">
                  {question.options.map(
                    (
                      option: { text: string; correct: boolean },
                      idx: number
                    ) => {
                      const isSelected = selected === option.text;
                      const background = isSelected
                        ? option.correct
                          ? "bg-green-500"
                          : "bg-red-500"
                        : "bg-[#3995FF]";

                      return (
                        <TouchableOpacity
                          key={idx}
                          disabled={!!selected}
                          onPress={() => {
                            setSelected(option.text);
                            handleNextQuestion(option);
                          }}
                          className={`w-[48%] mb-3 py-3 rounded-full ${background} items-center`}
                        >
                          <Text className="text-sm font-bold text-white">
                            {option.text}
                          </Text>
                        </TouchableOpacity>
                      );
                    }
                  )}
                </View>
              </View>
            </ScrollView>

            {/* Footer */}
            <View className="px-6 pb-4 flex-row items-center gap-4">
              <View className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <View
                  className="bg-[#007AFF] h-full"
                  style={{ width: `${(timeLeft / 60) * 100}%` }}
                />
              </View>

              <View className="bg-[#007AFF] rounded-xl p-3">
                <Text className="text-white font-semibold text-sm">
                  {currentIndex + 1} de {questions.length}
                </Text>
              </View>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

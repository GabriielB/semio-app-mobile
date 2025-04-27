import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import { fetchQuizCategories, fetchQuizzes } from "@/services/quizzService";
import { useRouter } from "expo-router";
import ArrowLeft from "@/assets/icons/ArrowLeft.svg";
import { Dropdown } from "react-native-element-dropdown";
import ArrowLeftWhite from "@/assets/icons/ArrowLeftWhite.svg";

interface Quiz {
  id: string;
  title: string;
  category: string;
  cover_image: string | null;
}

export default function QuizScreen() {
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadCategories();
    loadQuizzes();
  }, []);

  async function loadCategories() {
    const cats = await fetchQuizCategories();
    const allCategories = ["Todos", ...cats];
    setCategories(allCategories);
    setSelectedCategory("Todos");
  }

  async function loadQuizzes(reset = false) {
    if (loading) return;
    setLoading(true);
    try {
      const newQuizzes = await fetchQuizzes(page);
      setQuizzes((prev) => (reset ? newQuizzes : [...prev, ...newQuizzes]));
      setPage((prev) => prev + 1);
    } finally {
      setLoading(false);
    }
  }

  const filteredQuizzes = quizzes.filter(
    (quiz) => selectedCategory === "Todos" || quiz.category === selectedCategory
  );

  return (
    <View className="flex-1 bg-[#007AFF]">
      <View className="px-4 ">
        {/* Header */}
        <View className="w-full h-20 flex-row items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeftWhite width={24} height={24} />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-white flex-1 text-center mr-6">
            Quizz
          </Text>
        </View>

        {/* Dropdown de Categorias */}
        <View className="mt-2">
          <Dropdown
            style={{
              height: 50, //
              backgroundColor: "white",
              borderRadius: 10,
              paddingHorizontal: 12,
            }}
            containerStyle={{
              borderRadius: 10,
              backgroundColor: "white",
              paddingVertical: 6,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 4,
            }}
            itemContainerStyle={{
              borderBottomWidth: 0,
              paddingVertical: 6,
              paddingHorizontal: 12,
              borderRadius: 8,
            }}
            itemTextStyle={{
              fontSize: 14, //
              color: "#31144B",
            }}
            selectedTextStyle={{
              fontSize: 14,
              fontWeight: "bold",
              color: "#31144B",
            }}
            placeholderStyle={{ fontSize: 14 }}
            activeColor="#E3F2FF"
            data={categories.map((cat) => ({ label: cat, value: cat }))}
            labelField="label"
            valueField="value"
            placeholder="Escolher Categoria"
            value={selectedCategory}
            onChange={(item) => setSelectedCategory(item.value)}
          />
        </View>
      </View>

      {/* container branco da lista */}
      <View className="flex-1 bg-white rounded-t-3xl mt-6 shadow-lg">
        <FlatList
          data={filteredQuizzes}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{ paddingBottom: 40, paddingTop: 16 }}
          columnWrapperStyle={{
            justifyContent: "space-between",
            paddingHorizontal: 16,
          }}
          onEndReachedThreshold={0.1}
          ListFooterComponent={loading ? <ActivityIndicator /> : null}
          ListEmptyComponent={
            loading ? null : (
              <Text className="text-center text-[#31144B] font-semibold text-base mt-10">
                Nenhum quiz cadastrado.
              </Text>
            )
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              className="w-[48%] bg-[#E1F4FF] rounded-2xl mb-4 p-3 items-center"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 6,
                elevation: 6,
              }}
            >
              <Image
                source={
                  item.cover_image
                    ? { uri: item.cover_image }
                    : require("@/assets/images/default-quiz.png")
                }
                className="w-20 h-20 mb-2 rounded-md"
                resizeMode="cover"
              />
              <Text className="text-lg text-center font-semibold text-[#31144B]">
                {item.title}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

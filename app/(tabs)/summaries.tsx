import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import { fetchSummaries, fetchCategories } from "@/services/summaryService";
import { useRouter } from "expo-router";
import { Dropdown } from "react-native-element-dropdown";
import ArrowLeftWhite from "@/assets/icons/ArrowLeftWhite.svg";

interface Summary {
  id: string;
  title: string;
  category: string;
  cover_image: string | null;
  file_url: string;
}

export default function SummariesScreen() {
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [loading, setLoading] = useState(false);
  const [range, setRange] = useState({ from: 0, to: 9 });
  const router = useRouter();

  useEffect(() => {
    loadCategories();
    loadMoreSummaries(true);
  }, []);

  async function loadCategories() {
    const cats = await fetchCategories();
    setCategories(["Todos", ...cats]);
  }

  async function loadMoreSummaries(reset = false) {
    if (loading) return;
    setLoading(true);
    try {
      const newItems = await fetchSummaries(range.from, range.to);
      setSummaries((prev) => (reset ? newItems : [...prev, ...newItems]));
      setRange((prev) => ({ from: prev.to + 1, to: prev.to + 10 }));
    } finally {
      setLoading(false);
    }
  }

  const filteredSummaries = summaries.filter(
    (item) => selectedCategory === "Todos" || item.category === selectedCategory
  );

  return (
    <View className="flex-1 bg-[#007AFF]">
      <View className="px-4">
        <View className="w-full h-20 flex-row items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeftWhite width={24} height={24} />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-white flex-1 text-center mr-6">
            Resumos
          </Text>
        </View>

        <View className="mt-2">
          <Dropdown
            style={{
              height: 45,
              backgroundColor: "white",
              borderRadius: 10,
              paddingHorizontal: 12,
            }}
            data={categories.map((cat) => ({ label: cat, value: cat }))}
            labelField="label"
            valueField="value"
            value={selectedCategory}
            onChange={(item) => setSelectedCategory(item.value)}
          />
        </View>
      </View>

      <View className="flex-1 bg-white rounded-t-3xl mt-6 shadow-lg">
        <FlatList
          data={filteredSummaries}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{ paddingBottom: 40, paddingTop: 16 }}
          columnWrapperStyle={{
            justifyContent: "space-between",
            paddingHorizontal: 16,
          }}
          onEndReachedThreshold={0.1}
          onEndReached={() => loadMoreSummaries()}
          ListFooterComponent={loading ? <ActivityIndicator /> : null}
          ListEmptyComponent={
            !loading ? (
              <Text className="text-center text-[#31144B] font-semibold text-base mt-10">
                Nenhum resumo encontrado.
              </Text>
            ) : null
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: `/summaries/${item.id}`,
                  params: {
                    title: item.title,
                    fileUrl: item.file_url,
                    coverImage: item.cover_image,
                  },
                })
              }
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

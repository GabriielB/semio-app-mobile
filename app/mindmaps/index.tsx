// app/mindmaps/index.tsx

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import {
  fetchMindmaps,
  fetchMindmapCategories,
} from "@/services/mindmapService";
import ArrowLeftWhite from "@/assets/icons/ArrowLeftWhite.svg";
import { Dropdown } from "react-native-element-dropdown";

interface Mindmap {
  id: string;
  title: string;
  category: string;
  cover_image: string | null;
  file_url: string;
}

export default function MindmapListScreen() {
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [mindmaps, setMindmaps] = useState<Mindmap[]>([]);
  const [loading, setLoading] = useState(false);
  const [range, setRange] = useState({ from: 0, to: 9 });
  const router = useRouter();

  useEffect(() => {
    loadCategories();
    loadMoreMindmaps(true);
  }, []);

  async function loadCategories() {
    const cats = await fetchMindmapCategories();
    setCategories(["Todos", ...cats]);
  }

  async function loadMoreMindmaps(reset = false) {
    if (loading) return;
    setLoading(true);
    try {
      const newItems = await fetchMindmaps(range.from, range.to);
      setMindmaps((prev) => (reset ? newItems : [...prev, ...newItems]));
      setRange((prev) => ({ from: prev.to + 1, to: prev.to + 10 }));
    } finally {
      setLoading(false);
    }
  }

  const filteredMindmaps = mindmaps.filter(
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
            Mapas Mentais
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
          data={filteredMindmaps}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{ paddingBottom: 40, paddingTop: 16 }}
          columnWrapperStyle={{
            justifyContent: "space-between",
            paddingHorizontal: 16,
          }}
          onEndReachedThreshold={0.1}
          onEndReached={() => loadMoreMindmaps()}
          ListFooterComponent={loading ? <ActivityIndicator /> : null}
          ListEmptyComponent={
            !loading ? (
              <Text className="text-center text-[#31144B] font-semibold text-base mt-10">
                Nenhum mapa mental encontrado.
              </Text>
            ) : null
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: `/mindmaps/${item.id}`,
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

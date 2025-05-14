import { View, Text, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/useAuthStore";
import CrownIcon from "@/assets/icons/CrownIcon.svg";

interface Friend {
  id: string;
  username: string;
  profile_picture: string | null;
  total_points: number;
}

export default function RankScreen() {
  const user = useAuthStore((state) => state.user);
  const [friends, setFriends] = useState<Friend[]>([]);

  useEffect(() => {
    if (user?.id) fetchFriendsRanking();
  }, [user]);

  const fetchFriendsRanking = async () => {
    const { data: friendList, error } = await supabase.rpc("get_all_friends", {
      current_user_id: user!.id,
    });

    if (error) {
      console.error("Erro ao buscar amigos via função RPC:", error.message);
      return;
    }

    const allIds = [user!.id, ...new Set(friendList.map((f: any) => f.id))];

    const { data: usersData, error: usersError } = await supabase
      .from("users")
      .select("id, username, profile_picture, total_points")
      .in("id", allIds);

    if (usersError) {
      console.error("Erro ao buscar usuários:", usersError.message);
      return;
    }

    const sorted = (usersData || [])
      .sort((a, b) => (b.total_points || 0) - (a.total_points || 0))
      .map((u) => ({
        id: u.id,
        username: u.username,
        profile_picture: u.profile_picture,
        total_points: u.total_points ?? 0,
      }));

    setFriends(sorted);
  };

  const top3 = friends.slice(0, 3);
  const rest = friends.slice(3);
  const hasNoFriends = friends.length <= 1;
  const shouldShowSuggestion = friends.length <= 3;

  return (
    <SafeAreaView className="flex-1 bg-[#007AFF]">
      <View className="flex-1">
        <Text className="text-white text-center text-2xl font-bold mt-6 mb-10">
          Ranking
        </Text>

        {/* PÓDIO MAIOR */}
        <View className="flex-row justify-center items-end mt-12 px-4 space-x-6 gap-1">
          {/* 2º lugar */}
          {top3[1] && (
            <View
              className="bg-[#E6F0F8] w-32 h-52 items-center justify-start pt-4 shadow-md"
              style={{
                borderTopLeftRadius: 80,
                borderTopRightRadius: 80,
                borderBottomLeftRadius: 60,
              }}
            >
              <Image
                source={
                  top3[1].profile_picture
                    ? { uri: top3[1].profile_picture }
                    : require("@/assets/images/default-profile.png")
                }
                className="w-20 h-20 rounded-full mb-2"
              />
              <Text className="text-base text-[#5E888C] font-bold">2º</Text>
              <Text
                className="text-lg text-center text-[#5E888C] font-semibold px-1 mt-1"
                numberOfLines={1}
              >
                {top3[1].username}
              </Text>
              <View className="bg-[#5E888C] px-4 rounded-xl mt-1">
                <Text className="text-sm text-white font-bold">
                  {top3[1].total_points} P
                </Text>
              </View>
            </View>
          )}

          {/* 1º lugar */}
          {top3[0] && (
            <View
              className="bg-[#FFF9E5] w-36 h-60 items-center justify-start pt-5 border-1 border-yellow-400 shadow-lg"
              style={{
                borderTopLeftRadius: 90,
                borderTopRightRadius: 90,
              }}
            >
              <Image
                source={
                  top3[0].profile_picture
                    ? { uri: top3[0].profile_picture }
                    : require("@/assets/images/default-profile.png")
                }
                className="w-24 h-24 rounded-full mb-2"
              />
              <View className="flex-row gap-1 items-center">
                <Text className="text-lg text-[#F8BD00] font-extrabold">
                  1º
                </Text>
                <CrownIcon />
              </View>
              <Text
                className="text-xl text-[#F8BD00] text-center font-semibold px-1 mt-1"
                numberOfLines={1}
              >
                {top3[0].username}
              </Text>
              <View className="bg-[#FFC60B] px-4 rounded-xl mt-1">
                <Text className="text-base text-white font-bold">
                  {top3[0].total_points} P
                </Text>
              </View>
            </View>
          )}

          {/* 3º lugar */}
          {top3[2] && friends.length >= 4 && (
            <View
              className="bg-[#FFEFE4] w-32 h-52 items-center justify-start pt-4 shadow-md"
              style={{
                borderTopLeftRadius: 80,
                borderTopRightRadius: 80,
                borderBottomRightRadius: 60,
              }}
            >
              <Image
                source={
                  top3[2].profile_picture
                    ? { uri: top3[2].profile_picture }
                    : require("@/assets/images/default-profile.png")
                }
                className="w-20 h-20 rounded-full mb-2"
              />
              <Text className="text-base text-[#F55E00] font-bold">3º</Text>
              <Text
                className="text-lg text-center text-[#F55E00] font-semibold px-1 mt-1"
                numberOfLines={1}
              >
                {top3[2].username}
              </Text>
              <View className="bg-[#F55E00] px-4 rounded-xl mt-1">
                <Text className="text-sm text-white font-bold">
                  {top3[2].total_points} P
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* ÁREA BRANCA PREENCHENDO O RESTO */}
        <View className="flex-1 bg-white mt-8 rounded-t-3xl px-4 pt-6 pb-4">
          {hasNoFriends ? (
            <Text className="text-center text-lg  text-[#924BD0] mt-4">
              Nenhum amigo no ranking ainda 😢
            </Text>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              {rest.map((friend, index) => (
                <View
                  key={friend.id}
                  className="flex-row items-center justify-between bg-white rounded-3xl mb-4 px-5 py-5 shadow-lg"
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 6,
                    elevation: 4,
                  }}
                >
                  <Text className="text-lg font-bold w-7 text-gray-700">
                    {index + 4}º
                  </Text>
                  <Image
                    source={
                      friend.profile_picture
                        ? { uri: friend.profile_picture }
                        : require("@/assets/images/default-profile.png")
                    }
                    className="w-[60px] h-[60px] rounded-full"
                  />
                  <Text
                    className="flex-1 ml-3 font-semibold text-lg text-[#924BD0]"
                    numberOfLines={1}
                  >
                    {friend.username}
                  </Text>
                  <Text className="font-semibold text-base text-violet-500">
                    {friend.total_points} Pontos
                  </Text>
                </View>
              ))}
            </ScrollView>
          )}

          {/* Texto de sugestão para adicionar mais amigos */}
          {shouldShowSuggestion && (
            <Text className="text-center text-lg text-[#924BD0] mt-4 mb-10 pb-10">
              Adicione mais amigos para aumentar seu ranking
            </Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

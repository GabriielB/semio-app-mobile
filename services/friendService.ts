import { supabase } from "@/lib/supabase";

// tipagem do usuário amigo
export interface FriendUser {
  id: string;
  username: string;
  email: string;
  profile_picture: string | null;
  created_at: string;
}

// tipagem da relação de amizade
export interface Friend {
  friend_id: string;
  users: FriendUser;
}

export const friendService = {
  async listFriends(userId: string): Promise<Friend[] | null> {
    const { data, error } = await supabase
      .from("friends")
      .select(
        "friend_id, users:friend_id (id, username, email, profile_picture, created_at)"
      )
      .eq("user_id", userId);

    if (error) {
      console.error("Erro ao buscar amigos:", error.message);
      return null;
    }

    // corrige estrutura: garante que `users` seja um objeto (e não  um array)
    const normalized = data.map((item: any) => ({
      friend_id: item.friend_id,
      users: Array.isArray(item.users) ? item.users[0] : item.users,
    })) as Friend[];

    return normalized;
  },

  async sendFriendRequest(toUserId: string, fromUserId: string) {
    const { error } = await supabase.from("friend_requests").insert({
      user_id: toUserId,
      from_user: fromUserId,
      status: "pending",
    });

    if (error) {
      console.error("Erro ao enviar solicitação:", error.message);
      return false;
    }

    return true;
  },

  async deleteFriend(userId: string, friendId: string) {
    const { error } = await supabase
      .from("friends")
      .delete()
      .or(
        `and(user_id.eq.${userId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${userId})`
      );

    if (error) {
      console.error("Erro ao excluir amigo:", error.message);
      return false;
    }

    return true;
  },

  async acceptFriendRequest(
    requestId: string,
    userId: string,
    friendId: string
  ) {
    const { error: updateError } = await supabase
      .from("friend_requests")
      .update({ status: "accepted" })
      .eq("id", requestId);

    if (updateError) {
      console.error("Erro ao aceitar solicitação:", updateError.message);
      return false;
    }

    // antes de inserir, garantir que os dois lados ainda não existam
    const { data: existing, error: existingError } = await supabase
      .from("friends")
      .select("id")
      .or(
        `and(user_id.eq.${userId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${userId})`
      );

    if (existingError) {
      console.error(
        "Erro ao verificar amizades existentes:",
        existingError.message
      );
      return false;
    }

    if (existing?.length === 0) {
      const { error: insertError } = await supabase.from("friends").insert([
        { user_id: userId, friend_id: friendId },
        { user_id: friendId, friend_id: userId },
      ]);

      if (insertError) {
        console.error("Erro ao criar vínculo de amizade:", insertError.message);
        return false;
      }
    }

    return true;
  },
  async listFriendRequests(userId: string) {
    const { data, error } = await supabase
      .from("friend_requests")
      .select("id, from_user, users:from_user (id, username, profile_picture)")
      .eq("user_id", userId)
      .eq("status", "pending");

    if (error) {
      console.error("Erro ao buscar solicitações:", error.message);
      return null;
    }

    const normalized = data.map((item: any) => ({
      id: item.id,
      from_user: item.from_user,
      users: Array.isArray(item.users) ? item.users[0] : item.users,
    }));

    return normalized;
  },
};

import { supabase } from "@/lib/supabase";
import { AuthUser, useAuthStore } from "@/stores/useAuthStore";

export async function signIn(
  email: string,
  password: string
): Promise<AuthUser> {
  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (authError) throw authError;

  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", authData.user.id)
    .single();

  if (userError) throw userError;

  return userData as AuthUser;
}

export async function signUp(
  email: string,
  password: string,
  username: string
): Promise<AuthUser> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;

  const userId = data.user?.id;
  if (!userId) throw new Error("Usuário não foi criado corretamente.");

  // verifica se já existe na tabela "users"
  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (!existingUser) {
    const { error: insertError } = await supabase.from("users").insert({
      id: userId,
      email,
      username,
      profile_picture: null,
      total_points: 0,
      total_wins: 0,
    });

    if (insertError) throw insertError;
  }

  //  chama a função RPC que confirma o email no Supabase
  const { error: confirmError } = await supabase.rpc("auto_confirm_user", {
    uid: userId,
  });

  if (confirmError) throw confirmError;

  // busca os dados completos da tabela "users"
  const { data: userData, error: fetchError } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (fetchError) throw fetchError;

  return userData as AuthUser;
}

export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
  });

  if (error) throw error;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;

  const clearUser = useAuthStore.getState().setUser;
  clearUser(null);
}

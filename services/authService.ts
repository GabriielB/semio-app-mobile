import { supabase } from "@/lib/supabase";
import { AuthUser } from "@/stores/useAuthStore";

/**
 * Login com email e senha.
 * Retorna os dados completos do usuário da tabela "users".
 */
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

/**
 * Cadastro com email, senha e username.
 * Cria o usuário no Supabase Auth e na tabela "users", evitando duplicações.
 */
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

  // Verifica se já existe na tabela "users"
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

  // 🔥 Chama a função RPC que confirma o email no Supabase
  const { error: confirmError } = await supabase.rpc("auto_confirm_user", {
    uid: userId,
  });

  if (confirmError) throw confirmError;

  // Busca os dados completos da tabela "users"
  const { data: userData, error: fetchError } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (fetchError) throw fetchError;

  return userData as AuthUser;
}

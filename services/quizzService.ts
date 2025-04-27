// src/services/quizService.ts

import { supabase } from "@/lib/supabase";

/**
 * Busca categorias únicas manualmente da tabela "quizzes".
 */
export async function fetchQuizCategories(): Promise<string[]> {
  const { data, error } = await supabase.from("quizzes").select("category");

  if (error || !data) {
    console.error("Erro ao buscar categorias:", error?.message);
    return [];
  }

  // Filtra categorias únicas
  const uniqueCategories = Array.from(
    new Set(data.map((item) => item.category))
  );
  return uniqueCategories.filter(Boolean); // Remove possíveis null/undefined
}

/**
 * Busca quizzes com paginação.
 */
export async function fetchQuizzes(page: number = 1, pageSize: number = 10) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error } = await supabase
    .from("quizzes")
    .select("*")
    .range(from, to)
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Erro ao buscar quizzes:", error?.message);
    return [];
  }

  return data;
}

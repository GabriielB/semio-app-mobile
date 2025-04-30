// src/services/questionService.ts

import { supabase } from "@/lib/supabase";

/**
 * Busca todas as questões associadas a um quiz pelo ID do quiz.
 */
export async function fetchQuestionsByQuizId(quizId: string) {
  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .eq("quiz_id", quizId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Erro ao buscar questões:", error.message);
    throw error;
  }

  return data;
}

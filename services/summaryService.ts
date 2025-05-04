import { supabase } from "@/lib/supabase";

export async function fetchSummaries(from = 0, to = 9) {
  const { data, error } = await supabase
    .from("summaries")
    .select("id, title, category, cover_image, file_url")
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;

  return data;
}

export async function fetchCategories() {
  const { data, error } = await supabase
    .from("summaries")
    .select("category")
    .neq("category", null);

  if (error) throw error;

  const uniqueCategories = Array.from(
    new Set(data.map((item) => item.category))
  );

  return uniqueCategories;
}

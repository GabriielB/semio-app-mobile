import { supabase } from "@/lib/supabase";

export async function fetchSummaries({
  page = 1,
  limit = 10,
}: {
  page?: number;
  limit?: number;
}) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error } = await supabase
    .from("summaries")
    .select("id, title, category, cover_image")
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

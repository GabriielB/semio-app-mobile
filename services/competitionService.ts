import { supabase } from "@/lib/supabase";

export const competitionService = {
  async createCompetition(
    challengerId: string,
    opponentId: string,
    quizId: string | null
  ) {
    const { data, error } = await supabase
      .from("competitions")
      .insert({
        quiz_id: quizId,
        status: "pending",
      })
      .select("id")
      .single();

    if (error) throw error;

    const competitionId = data.id;

    const { error: playerInsertError } = await supabase
      .from("competition_players")
      .insert({
        competition_id: competitionId,
        user_id: challengerId,
        score: 0,
        finished: false,
      });

    if (playerInsertError) throw playerInsertError;

    return competitionId;
  },

  async listPendingChallenges(userId: string) {
    const { data, error } = await supabase
      .from("competitions")
      .select("id, quiz_id, quizzes(title), created_at")
      .order("created_at", { ascending: false })
      .eq("status", "pending");

    if (error) throw error;

    return (data || []).filter((comp: any) => comp.quiz_id !== null);
  },

  async acceptChallenge(competitionId: string, userId: string) {
    // Atualiza status da competição
    const { error: updateError } = await supabase
      .from("competitions")
      .update({ status: "accepted" })
      .eq("id", competitionId);

    if (updateError) throw updateError;

    // verifica se o jogador já está registrado na competição
    const { data: existingPlayers, error: fetchError } = await supabase
      .from("competition_players")
      .select("id")
      .eq("competition_id", competitionId)
      .eq("user_id", userId);

    if (fetchError) throw fetchError;

    if (existingPlayers.length > 0) return;

    const { error: insertError } = await supabase
      .from("competition_players")
      .insert({
        competition_id: competitionId,
        user_id: userId,
        score: 0,
        finished: false,
      });

    if (insertError) throw insertError;
  },

  async registerScore(
    competitionId: string,
    userId: string,
    score: number,
    totalQuestions: number,
    bonusPoints: number
  ) {
    const percentage = Math.round((score / totalQuestions) * 100);

    const finalScore = percentage + bonusPoints;

    const { error } = await supabase
      .from("competition_players")
      .update({
        score,
        finished: true,
        final_score: finalScore,
      })
      .eq("competition_id", competitionId)
      .eq("user_id", userId);

    if (error) throw error;
  },
  async listReceivedChallenges(userId: string) {
    const { data, error } = await supabase
      .from("competitions")
      .select(
        `
      id,
      status,
      created_at,
      quiz_id,
      quizzes (id, title),
      competition_players (
        user_id,
        users (id, username, profile_picture)
      )
    `
      )
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (data || [])
      .filter((comp: any) => comp.status === "pending")
      .filter((comp: any) => {
        const alreadyJoined = comp.competition_players.some(
          (p: any) => p.user_id === userId
        );
        return !alreadyJoined;
      });
  },
};

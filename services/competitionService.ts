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
        challenger_id: challengerId,
        opponent_id: opponentId,
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
    const { error: updateError } = await supabase
      .from("competitions")
      .update({ status: "accepted" })
      .eq("id", competitionId);

    if (updateError) throw updateError;

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

    // atualiza score do jogador atual
    const { error: updateError } = await supabase
      .from("competition_players")
      .update({
        score,
        finished: true,
        final_score: finalScore,
      })
      .eq("competition_id", competitionId)
      .eq("user_id", userId);

    if (updateError) throw updateError;

    // pega todos os jogadores da competição
    const { data: players, error: fetchError } = await supabase
      .from("competition_players")
      .select("user_id, finished")
      .eq("competition_id", competitionId);

    if (fetchError) throw fetchError;

    const allFinished = players?.every((p) => p.finished);

    //  somente se houverem 2 jogadores e ambos finalizaram
    if ((players || []).length === 2 && allFinished) {
      const { error: callError } = await supabase.rpc("finalizar_competicao", {
        comp_id: competitionId,
      });
      if (callError) throw callError;
    }
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
      opponent_id,
      quizzes (id, title),
      competition_players (
        user_id,
        users (id, username, profile_picture)
      )
    `
      )
      .eq("status", "pending")
      .or(`opponent_id.eq.${userId},opponent_id.is.null`)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (data || []).filter((comp: any) => {
      //  verifica se o desafio foi enviado para o usuário logado (via opponent_id)
      const isTargetedToUser = comp.opponent_id === userId;
      const alreadyJoined = comp.competition_players.some(
        (p: any) => p.user_id === userId
      );
      console.log(data);
      return isTargetedToUser && !alreadyJoined;
    });
  },

  async listCompletedChallenges(userId: string) {
    const { data, error } = await supabase
      .from("competitions")
      .select(
        `
        id,
        status,
        created_at,
        quizzes (title),
        competition_players (
          user_id,
          users (username, profile_picture)
        )
      `
      )
      .eq("status", "completed")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (data || []).filter((comp: any) =>
      comp.competition_players.some((p: any) => p.user_id === userId)
    );
  },
};

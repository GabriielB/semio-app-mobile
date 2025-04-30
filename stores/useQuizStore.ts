import { create } from "zustand";

type Question = {
  id: string;
  description: string;
  media: string | null;
  options: { text: string; correct: boolean }[];
};

interface QuizState {
  questions: Question[];
  score: number;
  setQuestions: (questions: Question[]) => void;
  incrementScore: () => void;
  resetQuiz: () => void;
}

export const useQuizStore = create<QuizState>((set) => ({
  questions: [],
  score: 0,
  setQuestions: (questions) => set({ questions }),
  incrementScore: () => set((state) => ({ score: state.score + 1 })),
  resetQuiz: () => set({ questions: [], score: 0 }),
}));

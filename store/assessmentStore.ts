import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Assessment, AssessmentResult, UserResponse } from '../types';
import { generateId } from '../lib/utils';

interface AssessmentState {
  // History
  history: AssessmentResult[];

  // Active State
  activeAssessment: Assessment | null;
  currentQuestionIndex: number;
  responses: Record<string, string | number>; // questionId -> answer
  isFinished: boolean;
  
  startAssessment: (assessment: Assessment) => void;
  submitAnswer: (questionId: string, answer: string | number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  finishAssessment: () => void;
  resetAssessment: () => void;
  
  // Computed helpers could be done via selectors, but methods work for simplicity
  getProgress: () => number;
}

export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set, get) => ({
      history: [],
      activeAssessment: null,
      currentQuestionIndex: 0,
      responses: {},
      isFinished: false,

      startAssessment: (assessment) => set({
        activeAssessment: assessment,
        currentQuestionIndex: 0,
        responses: {},
        isFinished: false
      }),

      submitAnswer: (questionId, answer) => set((state) => ({
        responses: { ...state.responses, [questionId]: answer }
      })),

      nextQuestion: () => set((state) => {
        if (!state.activeAssessment) return state;
        const nextIndex = state.currentQuestionIndex + 1;
        if (nextIndex >= state.activeAssessment.questions.length) {
          return state; // Can't go past last question
        }
        return { currentQuestionIndex: nextIndex };
      }),

      prevQuestion: () => set((state) => ({
        currentQuestionIndex: Math.max(0, state.currentQuestionIndex - 1)
      })),

      finishAssessment: () => {
        const state = get();
        if (state.activeAssessment && !state.isFinished) {
          // Convert record to array for AssessmentResult
          const responseArray: UserResponse[] = Object.entries(state.responses).map(([qId, ans]) => ({
            questionId: qId,
            answer: ans as string | number
          }));
          
          // Calculate mock score for analytics (in real app, compare with correct answers)
          // For now, we assume 85% for demo purposes if not strictly calculable
          const mockScore = 85; 

          const result: AssessmentResult = {
            assessmentId: state.activeAssessment.id,
            responses: responseArray,
            score: mockScore,
            completedAt: Date.now(),
          };

          set((state) => ({
            isFinished: true,
            history: [result, ...state.history]
          }));
        } else {
          set({ isFinished: true });
        }
      },

      resetAssessment: () => set({
        activeAssessment: null,
        currentQuestionIndex: 0,
        responses: {},
        isFinished: false
      }),

      getProgress: () => {
        const state = get();
        if (!state.activeAssessment) return 0;
        const answeredCount = Object.keys(state.responses).length;
        return (answeredCount / state.activeAssessment.questions.length) * 100;
      }
    }),
    {
      name: 'assessment-store',
      partialize: (state) => ({ history: state.history }), // Only persist history
    }
  )
);
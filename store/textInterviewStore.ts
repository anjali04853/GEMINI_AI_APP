import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TextInterviewConfig, TextInterviewSession, TextQuestion } from '../types';
import { mockTextQuestions } from '../data/mockInterviewData';
import { generateId } from '../lib/utils';

interface ActiveInterviewData {
  sessionId: string;
  questions: TextQuestion[];
  config: TextInterviewConfig;
}

interface TextInterviewStore {
  sessions: TextInterviewSession[];

  activeConfig: TextInterviewConfig | null;
  activeQuestions: TextQuestion[];
  activeSessionId: string | null; // API session ID
  currentQuestionIndex: number;
  answers: Record<string, string>; // Drafts and finals mixed here, simplistically
  isInterviewActive: boolean;

  startInterview: (config: TextInterviewConfig) => void;
  setActiveInterview: (data: ActiveInterviewData) => void; // For API integration
  updateAnswer: (questionId: string, text: string) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  submitInterview: () => string; // returns session ID
  saveFeedback: (sessionId: string, feedback: Record<string, string>) => void;
  resetInterview: () => void;
}

export const useTextInterviewStore = create<TextInterviewStore>()(
  persist(
    (set, get) => ({
      sessions: [],
      activeConfig: null,
      activeQuestions: [],
      activeSessionId: null,
      currentQuestionIndex: 0,
      answers: {},
      isInterviewActive: false,

      // Set active interview from API response
      setActiveInterview: (data) => {
        set({
          activeSessionId: data.sessionId,
          activeQuestions: data.questions,
          activeConfig: data.config,
          currentQuestionIndex: 0,
          answers: {},
          isInterviewActive: true,
        });
      },

      startInterview: (config) => {
        // Filter questions based on selected types
        let filtered = mockTextQuestions.filter(q => 
          config.types.includes(q.type)
        );
        
        // Shuffle
        filtered = filtered.sort(() => 0.5 - Math.random());
        
        // Slice
        const selectedQuestions = filtered.slice(0, config.questionCount);
        
        set({
          activeConfig: config,
          activeQuestions: selectedQuestions,
          currentQuestionIndex: 0,
          answers: {}, // Reset answers
          isInterviewActive: true,
        });
      },

      updateAnswer: (questionId, text) => set((state) => ({
        answers: { ...state.answers, [questionId]: text }
      })),

      nextQuestion: () => set((state) => ({
        currentQuestionIndex: Math.min(
          state.currentQuestionIndex + 1, 
          state.activeQuestions.length - 1
        )
      })),

      prevQuestion: () => set((state) => ({
        currentQuestionIndex: Math.max(0, state.currentQuestionIndex - 1)
      })),

      submitInterview: () => {
        const state = get();
        // Use API session ID if available, otherwise generate one
        const sessionId = state.activeSessionId || generateId();

        const newSession: TextInterviewSession = {
          id: sessionId,
          date: Date.now(),
          config: state.activeConfig!,
          questions: state.activeQuestions,
          answers: state.answers,
          feedback: {}
        };

        set((s) => ({
          sessions: [newSession, ...s.sessions],
          isInterviewActive: false,
          activeSessionId: null
        }));

        return sessionId;
      },
      
      saveFeedback: (sessionId, feedback) => set((state) => ({
        sessions: state.sessions.map(s => 
          s.id === sessionId ? { ...s, feedback: { ...s.feedback, ...feedback } } : s
        )
      })),

      resetInterview: () => set({
        activeConfig: null,
        activeQuestions: [],
        activeSessionId: null,
        currentQuestionIndex: 0,
        answers: {},
        isInterviewActive: false
      }),
    }),
    {
      name: 'text-interview-store',
      partialize: (state) => ({ sessions: state.sessions }),
    }
  )
);
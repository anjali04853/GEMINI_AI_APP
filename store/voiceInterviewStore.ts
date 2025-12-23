import { create } from 'zustand';
import { VoiceInterviewSession, VoiceAnswer, TextQuestion, VoiceInterviewConfig } from '../types';
import { mockTextQuestions } from '../data/mockInterviewData';
import { generateId } from '../lib/utils';

interface ActiveVoiceInterviewData {
  sessionId: string;
  questions: TextQuestion[];
  config: VoiceInterviewConfig;
}

interface VoiceInterviewStore {
  sessions: VoiceInterviewSession[];

  activeQuestions: TextQuestion[];
  activeSessionId: string | null;
  currentQuestionIndex: number;
  answers: Record<string, VoiceAnswer>;
  isInterviewActive: boolean;

  startInterview: (config: VoiceInterviewConfig) => void;
  setActiveInterview: (data: ActiveVoiceInterviewData) => void;
  saveAnswer: (questionId: string, answer: VoiceAnswer) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  submitInterview: () => string; // returns session ID
  saveFeedback: (sessionId: string, feedback: Record<string, string>) => void;
  resetInterview: () => void;
}

export const useVoiceInterviewStore = create<VoiceInterviewStore>((set, get) => ({
  sessions: [],
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
      currentQuestionIndex: 0,
      answers: {},
      isInterviewActive: true,
    });
  },

  startInterview: (config) => {
    // Select Behavioral and Situational questions for voice
    let filtered = mockTextQuestions.filter(q => 
      ['Behavioral', 'Situational'].includes(q.type)
    );
    
    // Shuffle
    filtered = filtered.sort(() => 0.5 - Math.random());
    
    // Slice
    const selectedQuestions = filtered.slice(0, config.questionCount);
    
    set({
      activeQuestions: selectedQuestions,
      currentQuestionIndex: 0,
      answers: {},
      isInterviewActive: true,
    });
  },

  saveAnswer: (questionId, answer) => set((state) => ({
    answers: { ...state.answers, [questionId]: answer }
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
    const sessionId = state.activeSessionId || generateId();
    const newSession: VoiceInterviewSession = {
      id: sessionId,
      date: Date.now(),
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
    activeQuestions: [],
    activeSessionId: null,
    currentQuestionIndex: 0,
    answers: {},
    isInterviewActive: false
  }),
}));
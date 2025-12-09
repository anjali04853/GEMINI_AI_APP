
import { create } from 'zustand';
import { User, Dataset, ReportItem, SystemConfig, InterviewQuestion } from '../types';
import { mockUsers, mockDatasets, mockReports, defaultSystemConfig } from '../data/mockAdminData';
import { mockInterviewQuestions } from '../data/mockInterviewData';
import { generateId } from '../lib/utils';

interface AdminStore {
  users: User[];
  questions: InterviewQuestion[];
  datasets: Dataset[];
  reports: ReportItem[];
  config: SystemConfig;

  // Actions
  toggleUserStatus: (userId: string) => void;
  deleteUser: (userId: string) => void;
  
  addQuestion: (question: Omit<InterviewQuestion, 'id'>) => void;
  updateQuestion: (id: string, updates: Partial<InterviewQuestion>) => void;
  deleteQuestion: (id: string) => void;

  toggleDatasetStatus: (id: string) => void;
  addDataset: (dataset: Omit<Dataset, 'id' | 'lastUpdated'>) => void;
  
  updateConfig: (updates: Partial<SystemConfig>) => void;
  resolveReport: (id: string) => void;
}

export const useAdminStore = create<AdminStore>((set) => ({
  users: mockUsers,
  questions: mockInterviewQuestions,
  datasets: mockDatasets,
  reports: mockReports,
  config: defaultSystemConfig,

  toggleUserStatus: (userId) => set((state) => ({
    users: state.users.map(u => 
      u.id === userId ? { ...u, status: u.status === 'active' ? 'blocked' : 'active' } : u
    )
  })),

  deleteUser: (userId) => set((state) => ({
    users: state.users.filter(u => u.id !== userId)
  })),

  addQuestion: (question) => set((state) => ({
    questions: [...state.questions, { ...question, id: generateId() }]
  })),

  updateQuestion: (id, updates) => set((state) => ({
    questions: state.questions.map(q => q.id === id ? { ...q, ...updates } : q)
  })),

  deleteQuestion: (id) => set((state) => ({
    questions: state.questions.filter(q => q.id !== id)
  })),

  toggleDatasetStatus: (id) => set((state) => ({
    datasets: state.datasets.map(d => 
      d.id === id ? { ...d, isActive: !d.isActive } : d
    )
  })),

  addDataset: (dataset) => set((state) => ({
    datasets: [...state.datasets, { ...dataset, id: generateId(), lastUpdated: Date.now() }]
  })),

  updateConfig: (updates) => set((state) => ({
    config: { ...state.config, ...updates }
  })),

  resolveReport: (id) => set((state) => ({
    reports: state.reports.map(r => r.id === id ? { ...r, status: 'resolved' } : r)
  }))
}));


import { User, Dataset, ReportItem, SystemConfig } from '../types';

export const mockUsers: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin', status: 'active', joinedAt: Date.now() - 10000000 },
  { id: '2', name: 'John Doe', email: 'john@example.com', role: 'user', status: 'active', joinedAt: Date.now() - 5000000 },
  { id: '3', name: 'Jane Smith', email: 'jane@example.com', role: 'user', status: 'blocked', joinedAt: Date.now() - 2000000 },
  { id: '4', name: 'Alice Johnson', email: 'alice@example.com', role: 'user', status: 'active', joinedAt: Date.now() - 100000 },
];

export const mockDatasets: Dataset[] = [
  { id: 'd1', name: 'Frontend React 2024', description: 'Updated question bank for React 18+', questionCount: 45, isActive: true, lastUpdated: Date.now() },
  { id: 'd2', name: 'System Design Classics', description: 'Core distributed systems concepts', questionCount: 20, isActive: true, lastUpdated: Date.now() - 86400000 },
  { id: 'd3', name: 'Behavioral Starter', description: 'Common HR questions', questionCount: 15, isActive: false, lastUpdated: Date.now() - 172800000 },
];

export const mockReports: ReportItem[] = [
  { id: 'r1', type: 'question', contentId: 'q2', reason: 'Ambiguous wording', status: 'pending', timestamp: Date.now() - 3600000 },
  { id: 'r2', type: 'response', contentId: 'resp_123', reason: 'Inappropriate content', status: 'resolved', timestamp: Date.now() - 7200000 },
];

export const defaultSystemConfig: SystemConfig = {
  maintenanceMode: false,
  allowRegistrations: true,
  aiModelVersion: 'gemini-2.5-flash',
  defaultTimeLimit: 30,
  maxDailySessions: 10,
};

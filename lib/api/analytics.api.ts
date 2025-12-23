import { apiClient } from './client';
import type {
  AnalyticsSummary,
  ActivityHistoryFilters,
  ActivityHistoryResponse,
  SkillsResponse,
  ActivityTimelineResponse,
  AnalyticsReportResponse,
} from './types';

export const analyticsApi = {
  getSummary: async (): Promise<AnalyticsSummary> => {
    const response = await apiClient.get<AnalyticsSummary>('/skillforge/analytics/summary');
    return response.data;
  },

  getHistory: async (filters?: ActivityHistoryFilters): Promise<ActivityHistoryResponse> => {
    const response = await apiClient.get<ActivityHistoryResponse>('/skillforge/analytics/history', {
      params: filters,
    });
    return response.data;
  },

  getSkills: async (): Promise<SkillsResponse> => {
    const response = await apiClient.get<SkillsResponse>('/skillforge/analytics/skills');
    return response.data;
  },

  getActivity: async (period?: '7d' | '30d' | '90d' | 'all'): Promise<ActivityTimelineResponse> => {
    const response = await apiClient.get<ActivityTimelineResponse>('/skillforge/analytics/activity', {
      params: { period },
    });
    return response.data;
  },

  getReport: async (period?: '7d' | '30d' | '90d' | 'all'): Promise<AnalyticsReportResponse> => {
    const response = await apiClient.get<AnalyticsReportResponse>('/skillforge/analytics/report', {
      params: { period },
    });
    return response.data;
  },
};

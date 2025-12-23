import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '../../lib/api/analytics.api';
import { queryKeys } from '../../lib/query/queryKeys';
import type { ActivityHistoryFilters } from '../../lib/api/types';

export const useAnalyticsSummary = () => {
  return useQuery({
    queryKey: queryKeys.analytics.summary(),
    queryFn: () => analyticsApi.getSummary(),
  });
};

export const useActivityHistory = (filters?: ActivityHistoryFilters) => {
  return useQuery({
    queryKey: queryKeys.analytics.history(filters),
    queryFn: () => analyticsApi.getHistory(filters),
  });
};

export const useSkillsData = () => {
  return useQuery({
    queryKey: queryKeys.analytics.skills(),
    queryFn: () => analyticsApi.getSkills(),
  });
};

type Period = '7d' | '30d' | '90d' | 'all';

export const useActivityData = (period?: Period) => {
  return useQuery({
    queryKey: queryKeys.analytics.activity(period),
    queryFn: () => analyticsApi.getActivity(period),
  });
};

export const useAnalyticsReport = (period?: Period) => {
  return useQuery({
    queryKey: queryKeys.analytics.report(period),
    queryFn: () => analyticsApi.getReport(period),
  });
};

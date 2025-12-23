import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { chatApi, type SendMessageRequest } from '../../lib/api/chat.api';

const chatQueryKeys = {
  all: ['chat'] as const,
  conversations: () => [...chatQueryKeys.all, 'conversations'] as const,
  conversation: (id: string) => [...chatQueryKeys.all, 'conversation', id] as const,
};

export const useConversations = (limit = 20, offset = 0) => {
  return useQuery({
    queryKey: chatQueryKeys.conversations(),
    queryFn: () => chatApi.getConversations(limit, offset),
  });
};

export const useConversation = (conversationId: string) => {
  return useQuery({
    queryKey: chatQueryKeys.conversation(conversationId),
    queryFn: () => chatApi.getConversation(conversationId),
    enabled: !!conversationId,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SendMessageRequest) => chatApi.sendMessage(data),
    onSuccess: (data) => {
      // Invalidate conversations list
      queryClient.invalidateQueries({ queryKey: chatQueryKeys.conversations() });
      // Invalidate specific conversation if exists
      if (data.conversationId) {
        queryClient.invalidateQueries({ queryKey: chatQueryKeys.conversation(data.conversationId) });
      }
    },
  });
};

export const useDeleteConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: string) => chatApi.deleteConversation(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatQueryKeys.conversations() });
    },
  });
};

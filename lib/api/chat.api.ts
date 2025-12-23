import { apiClient } from './client';

export interface ChatMessage {
  id: number;
  role: 'user' | 'model';
  content: string;
  createdAt: string;
}

export interface ChatConversation {
  id: string;
  title: string | null;
  messageCount: number;
  createdAt: string;
  lastMessageAt: string | null;
}

export interface SendMessageRequest {
  message: string;
  conversationId?: string;
  systemPrompt?: string;
}

export interface SendMessageResponse {
  conversationId: string;
  message: string;
  timestamp: string;
}

export interface GetConversationResponse {
  conversation: ChatConversation;
  messages: ChatMessage[];
}

export interface GetConversationsResponse {
  conversations: Array<{
    conversationId: string;
    title: string | null;
    messageCount: number;
    lastMessageAt: string | null;
    createdAt: string;
  }>;
}

export const chatApi = {
  sendMessage: async (data: SendMessageRequest): Promise<SendMessageResponse> => {
    const response = await apiClient.post<SendMessageResponse>(
      '/skillforge/chat',
      data,
    );
    return response.data;
  },

  getConversations: async (limit = 20, offset = 0): Promise<GetConversationsResponse> => {
    const response = await apiClient.get<GetConversationsResponse>(
      '/skillforge/chat',
      { params: { limit, offset } },
    );
    return response.data;
  },

  getConversation: async (conversationId: string): Promise<GetConversationResponse> => {
    const response = await apiClient.get<GetConversationResponse>(
      `/skillforge/chat/${conversationId}`,
    );
    return response.data;
  },

  deleteConversation: async (conversationId: string): Promise<void> => {
    await apiClient.delete(`/skillforge/chat/${conversationId}`);
  },
};

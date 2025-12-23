import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Send, Bot, User as UserIcon, MessageSquarePlus, Trash2, History, Loader2 } from 'lucide-react';
import { useSendMessage, useConversations, useConversation, useDeleteConversation } from '../hooks/api/useChatApi';
import { ChatMessage } from '../types';
import { generateId, cn } from '../lib/utils';
import { useToast } from '../components/ui/Toast';

export const AIChatPage = () => {
  const { addToast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: 'Hello! I am your AI assistant for SkillForge. I can help you with interview preparation, technical concepts, and career advice. How can I help you today?',
      timestamp: Date.now(),
    }
  ]);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessageMutation = useSendMessage();
  const { data: conversationsData } = useConversations();
  const { data: conversationData, isLoading: isLoadingConversation } = useConversation(conversationId || '');
  const deleteConversationMutation = useDeleteConversation();

  // Load messages when a conversation is selected
  useEffect(() => {
    if (conversationData?.messages && conversationId) {
      const loadedMessages: ChatMessage[] = conversationData.messages.map((msg) => ({
        id: String(msg.id),
        role: msg.role as 'user' | 'model',
        text: msg.content,
        timestamp: new Date(msg.createdAt).getTime(),
      }));
      if (loadedMessages.length > 0) {
        setMessages(loadedMessages);
      }
    }
  }, [conversationData, conversationId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sendMessageMutation.isPending) return;

    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      text: input,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');

    try {
      const response = await sendMessageMutation.mutateAsync({
        message: currentInput,
        conversationId: conversationId || undefined,
      });

      // Update conversation ID if this is a new conversation
      if (!conversationId && response.conversationId) {
        setConversationId(response.conversationId);
      }

      const modelMessage: ChatMessage = {
        id: generateId(),
        role: 'model',
        text: response.message || "I couldn't generate a response.",
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: generateId(),
        role: 'model',
        text: "Sorry, I encountered an error. Please make sure you're logged in and try again.",
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
      addToast('Failed to send message. Please try again.', 'error');
    }
  };

  const handleNewConversation = () => {
    setConversationId(null);
    setMessages([
      {
        id: generateId(),
        role: 'model',
        text: 'Starting a new conversation! How can I help you today?',
        timestamp: Date.now(),
      }
    ]);
    setShowHistory(false);
  };

  const handleSelectConversation = (convId: string) => {
    if (convId !== conversationId) {
      setConversationId(convId);
      setShowHistory(false);
    }
  };

  const handleDeleteConversation = async (id: string) => {
    try {
      await deleteConversationMutation.mutateAsync(id);
      addToast('Conversation deleted', 'success');
      if (conversationId === id) {
        handleNewConversation();
      }
    } catch {
      addToast('Failed to delete conversation', 'error');
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-4">
      {/* Sidebar - Conversation History */}
      <div className={cn(
        "w-64 flex-shrink-0 bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col transition-all",
        showHistory ? "block" : "hidden md:flex"
      )}>
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800 text-sm">Conversations</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNewConversation}
            className="h-8 w-8"
            title="New conversation"
          >
            <MessageSquarePlus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversationsData?.conversations?.length === 0 && (
            <p className="text-xs text-slate-400 p-2 text-center">No conversations yet</p>
          )}
          {conversationsData?.conversations?.map((conv) => (
            <div
              key={conv.conversationId}
              onClick={() => handleSelectConversation(conv.conversationId)}
              className={cn(
                "group flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all text-sm",
                conversationId === conv.conversationId
                  ? "bg-brand-purple/10 text-brand-purple"
                  : "hover:bg-slate-50 text-slate-600"
              )}
            >
              <span className="truncate flex-1" title={conv.title || 'Untitled'}>
                {conv.title || 'Untitled'}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteConversation(conv.conversationId);
                }}
              >
                <Trash2 className="h-3 w-3 text-slate-400 hover:text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardHeader className="border-b border-slate-100 py-4 flex flex-row items-center justify-between">
          <CardTitle className="flex items-center text-lg">
            <Bot className="h-5 w-5 mr-2 text-brand-purple" />
            AI Assistant
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setShowHistory(!showHistory)}
            >
              <History className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNewConversation}
              className="text-xs"
            >
              <MessageSquarePlus className="h-4 w-4 mr-1" />
              New Chat
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoadingConversation && conversationId && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-brand-purple" />
              <span className="ml-2 text-sm text-slate-500">Loading conversation...</span>
            </div>
          )}
          {(!isLoadingConversation || !conversationId) && messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex items-start gap-3 max-w-[80%]",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <div className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0",
                msg.role === 'user' ? "bg-brand-purple text-white" : "bg-brand-turquoise text-white"
              )}>
                {msg.role === 'user' ? <UserIcon className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
              </div>
              <div className={cn(
                "p-3 rounded-lg text-sm whitespace-pre-wrap",
                msg.role === 'user'
                  ? "bg-brand-purple text-white rounded-tr-none"
                  : "bg-slate-100 text-slate-800 rounded-tl-none"
              )}>
                {msg.text}
              </div>
            </div>
          ))}
          {sendMessageMutation.isPending && (
            <div className="flex items-start gap-3 mr-auto max-w-[80%]">
              <div className="h-8 w-8 rounded-full bg-brand-turquoise flex items-center justify-center flex-shrink-0">
                 <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="p-3 rounded-lg bg-slate-100 text-slate-800 rounded-tl-none">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>
        <div className="p-4 border-t border-slate-100 bg-white">
          <form onSubmit={handleSend} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about interviews, technical concepts, or career advice..."
              disabled={sendMessageMutation.isPending}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={sendMessageMutation.isPending || !input.trim()}
              className="bg-brand-purple hover:bg-brand-darkPurple"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

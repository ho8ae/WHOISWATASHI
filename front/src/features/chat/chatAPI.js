// src/features/chat/chatAPI.js
import { apiClient } from '../../services/api/client';
import { API_ENDPOINTS } from '../../services/api/endpoints';
import socketService from '../../utils/socketService';

export const chatAPI = {
  // 내 채팅 목록 조회
  getMyChats: async () => {
    const response = await apiClient.get(API_ENDPOINTS.CHAT.MY_CHAT);
    return response.data;
  },

  // 관리자: 모든 채팅 목록 조회
  getAdminChats: async (status = null) => {
    const params = status ? { status } : {};
    const response = await apiClient.get(API_ENDPOINTS.CHAT.ADMIN_CHATS, { params });
    return response.data;
  },

  // 채팅 상세 조회
  getChatById: async (chatId) => {
    const response = await apiClient.get(API_ENDPOINTS.CHAT.DETAIL(chatId));
    return response.data;
  },

  // 채팅 메시지 목록 조회
  getChatMessages: async (chatId) => {
    const response = await apiClient.get(API_ENDPOINTS.CHAT.MESSAGES(chatId));
    return response.data;
  },

  // 새 채팅 생성
  createChat: async (subject, initialMessage) => {
    const response = await apiClient.post(API_ENDPOINTS.CHAT.CREATE, {
      subject,
      initialMessage,
    });
    return response.data;
  },

  // 메시지 전송
  sendMessage: async (chatId, content) => {
    const response = await apiClient.post(API_ENDPOINTS.CHAT.SEND_MESSAGE(chatId), {
      content,
    });
    return response.data;
  },

  // 채팅 상태 변경
  updateChatStatus: async (chatId, status) => {
    const response = await apiClient.patch(API_ENDPOINTS.CHAT.UPDATE_STATUS(chatId), {
      status,
    });
    return response.data;
  },

  // 읽지 않은 메시지 수 조회
  getUnreadCount: async () => {
    const response = await apiClient.get(API_ENDPOINTS.CHAT.UNREAD_COUNT);
    return response.data;
  },

  // 관리자 배정
  assignChat: async (chatId, adminId) => {
    const response = await apiClient.patch(API_ENDPOINTS.CHAT.ASSIGN(chatId), {
      adminId,
    });
    return response.data;
  }
};
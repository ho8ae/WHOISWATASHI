import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { chatAPI } from './chatAPI';

// 내 채팅 목록 조회 액션
export const fetchMyChats = createAsyncThunk(
  'chat/fetchMyChats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await chatAPI.getMyChats();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || '채팅 목록 조회에 실패했습니다.');
    }
  },
);

// 채팅 상세 조회 액션
export const fetchChatById = createAsyncThunk(
  'chat/fetchChatById',
  async (chatId, { rejectWithValue }) => {
    try {
      const response = await chatAPI.getChatById(chatId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || '채팅 상세 조회에 실패했습니다.');
    }
  },
);

// 채팅 메시지 목록 조회 액션
export const fetchChatMessages = createAsyncThunk(
  'chat/fetchChatMessages',
  async (chatId, { rejectWithValue }) => {
    try {
      const response = await chatAPI.getChatMessages(chatId);
      return { chatId, messages: response.data };
    } catch (error) {
      return rejectWithValue(
        error.message || '메시지 목록 조회에 실패했습니다.',
      );
    }
  },
);

// 새 채팅 생성 액션
export const createChat = createAsyncThunk(
  'chat/createChat',
  async ({ subject, initialMessage }, { rejectWithValue }) => {
    try {
      const response = await chatAPI.createChat(subject, initialMessage);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || '채팅 생성에 실패했습니다.');
    }
  },
);

// 메시지 전송 액션
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ chatId, content }, { rejectWithValue }) => {
    try {
      const response = await chatAPI.sendMessage(chatId, content);
      return { chatId, message: response.data };
    } catch (error) {
      return rejectWithValue(error.message || '메시지 전송에 실패했습니다.');
    }
  },
);

// 채팅 상태 변경 액션
export const updateChatStatus = createAsyncThunk(
  'chat/updateChatStatus',
  async ({ chatId, status }, { rejectWithValue }) => {
    try {
      const response = await chatAPI.updateChatStatus(chatId, status);
      return { chatId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.message || '채팅 상태 변경에 실패했습니다.');
    }
  },
);

// 읽지 않은 메시지 수 조회 액션
export const fetchUnreadCount = createAsyncThunk(
  'chat/fetchUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await chatAPI.getUnreadCount();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.message || '읽지 않은 메시지 조회에 실패했습니다.',
      );
    }
  },
);

// 관리자용 채팅 목록 조회 액션
export const fetchAdminChats = createAsyncThunk(
  'chat/fetchAdminChats',
  async (status, { rejectWithValue }) => {
    try {
      const response = await chatAPI.getAdminChats(status);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.message || '관리자 채팅 목록 조회에 실패했습니다.',
      );
    }
  },
);

// 관리자 배정 액션
export const assignChat = createAsyncThunk(
  'chat/assignChat',
  async ({ chatId, adminId }, { rejectWithValue }) => {
    try {
      const response = await chatAPI.assignChat(chatId, adminId);
      return { chatId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.message || '관리자 배정에 실패했습니다.');
    }
  },
);

// 초기 상태
const initialState = {
  // 채팅 목록
  list: [],

  // 관리자용 채팅 목록
  adminList: [],

  // 현재 활성화된 채팅
  currentChat: null,

  // 메시지 맵 (채팅 ID를 키로 메시지 목록 저장)
  messagesMap: {},

  // 채팅 위젯 관련 상태
  widget: {
    isOpen: false,
    isMinimized: false,
    newChatMode: false,
  },

  // 읽지 않은 메시지 수
  unreadCount: 0,

  // 로딩 및 에러 상태
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // 소켓으로부터 새 메시지 수신 시
    receiveMessage: (state, action) => {
      const { chatId, message, messages } = action.payload;
      
      // 메시지 배열을 처리하는 경우
      if (messages && Array.isArray(messages)) {
        if (!state.messagesMap[chatId]) {
          state.messagesMap[chatId] = [];
        }
        
        // 중복 메시지 방지를 위한 ID 기반 필터링
        const existingIds = new Set(state.messagesMap[chatId].map(m => m.id));
        const newMessages = messages.filter(m => !existingIds.has(m.id));
        
        if (newMessages.length > 0) {
          state.messagesMap[chatId] = [...state.messagesMap[chatId], ...newMessages];
          console.log(`Added ${newMessages.length} new messages to chat ${chatId}`);
        }
      } 
      // 단일 메시지를 처리하는 경우
      else if (message) {
        if (!state.messagesMap[chatId]) {
          state.messagesMap[chatId] = [];
        }
        
        // ID 기반 중복 체크
        const isDuplicate = message.id && state.messagesMap[chatId].some(m => m.id === message.id);
        
        // ID 없는 경우 내용+시간 기반 중복 체크
        const isDuplicateContent = state.messagesMap[chatId].some(m => {
          // 내용과 발신자 동일 + 시간 5초 이내 차이
          return (
            (m.content === message.content || m.message === message.content) &&
            m.senderId === message.senderId &&
            m.createdAt && message.createdAt &&
            Math.abs(new Date(m.createdAt) - new Date(message.createdAt)) < 1000
          );
        });
        
        // 중복이 아닌 경우에만 추가
        if (!isDuplicate && !isDuplicateContent) {
          state.messagesMap[chatId].push(message);
          console.log(`Added new message to chat ${chatId}`);
        } else {
          console.log(`Ignored duplicate message for chat ${chatId}`);
        }
      }
      
      // 현재 활성화된 채팅이 아니면 읽지 않은 메시지 수 증가
      if (message && (!state.currentChat || state.currentChat.id !== chatId)) {
        state.unreadCount += 1;
        
        // 채팅 목록에서 해당 채팅의 읽지 않은 메시지 카운트 증가
        const chatIndex = state.list.findIndex(chat => chat.id === chatId);
        if (chatIndex !== -1) {
          state.list[chatIndex].unreadCount = (state.list[chatIndex].unreadCount || 0) + 1;
        }
      }
      
      // 채팅 목록에서 해당 채팅의 최신 메시지 업데이트
      if (message) {
        const chatIndex = state.list.findIndex(chat => chat.id === chatId);
        if (chatIndex !== -1) {
          state.list[chatIndex].messages = [message];
          // 최신 채팅을 맨 위로 이동
          if (chatIndex > 0) {
            const updatedChat = state.list[chatIndex];
            state.list.splice(chatIndex, 1);
            state.list.unshift(updatedChat);
          }
        }
      }
    },

    // 관리자 참여 이벤트
    adminJoined: (state, action) => {
      const { chatId, adminId, adminName } = action.payload;

      const chatIndex = state.list.findIndex((chat) => chat.id === chatId);
      if (chatIndex !== -1) {
        state.list[chatIndex].adminId = adminId;
        state.list[chatIndex].admin = { id: adminId, name: adminName };
        state.list[chatIndex].status = 'in_progress';
      }

      if (state.currentChat?.id === chatId) {
        state.currentChat.adminId = adminId;
        state.currentChat.admin = { id: adminId, name: adminName };
        state.currentChat.status = 'in_progress';
      }
    },

    // 채팅 종료 이벤트
    chatClosed: (state, action) => {
      const { chatId } = action.payload;

      const chatIndex = state.list.findIndex((chat) => chat.id === chatId);
      if (chatIndex !== -1) {
        state.list[chatIndex].status = 'closed';
      }

      if (state.currentChat?.id === chatId) {
        state.currentChat.status = 'closed';
      }
    },

    // 채팅 위젯 열기
    openChatWidget: (state) => {
      state.widget.isOpen = true;
      state.widget.isMinimized = false;
    },

    // 채팅 위젯 닫기
    closeChatWidget: (state) => {
      state.widget.isOpen = false;
      state.widget.newChatMode = false;
    },

    // 채팅 위젯 최소화/최대화 토글
    toggleMinimize: (state) => {
      state.widget.isMinimized = !state.widget.isMinimized;
    },

    // 현재 채팅 선택
    selectChat: (state, action) => {
      state.currentChat = action.payload;
      state.widget.newChatMode = false;
    
      // 현재 채팅의 읽지 않은 메시지 카운트 차감
      if (action.payload) {
        const chatIndex = state.list.findIndex(
          (chat) => chat.id === action.payload.id,
        );
        if (chatIndex !== -1 && state.list[chatIndex].unreadCount) {
          state.unreadCount -= state.list[chatIndex].unreadCount;
          state.list[chatIndex].unreadCount = 0;
        }
      }
    },

    // 새 채팅 모드 활성화
    startNewChat: (state) => {
      state.currentChat = null;
      state.widget.newChatMode = true;
      state.widget.isOpen = true;
      state.widget.isMinimized = false;
    },

    // 에러 초기화
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 내 채팅 목록 조회
      .addCase(fetchMyChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyChats.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;

        // 읽지 않은 메시지 수 계산
        state.unreadCount = action.payload.reduce(
          (sum, chat) => sum + (chat.unreadCount || 0),
          0,
        );
      })
      .addCase(fetchMyChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 채팅 상세 조회
      .addCase(fetchChatById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentChat = action.payload;
      })
      .addCase(fetchChatById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 채팅 메시지 목록 조회
      .addCase(fetchChatMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatMessages.fulfilled, (state, action) => {
        state.loading = false;
        const { chatId, messages } = action.payload;
        
        console.log(`Loaded ${messages.length} messages for chat ${chatId}`);
        
        // 메시지 맵에 저장
        if (Array.isArray(messages)) {
          state.messagesMap[chatId] = messages;
        } else {
          console.error('Messages is not an array:', messages);
          state.messagesMap[chatId] = [];
        }
        
        // 해당 채팅의 읽지 않은 메시지 카운트 초기화
        const chatIndex = state.list.findIndex(chat => chat.id === chatId);
        if (chatIndex !== -1 && state.list[chatIndex].unreadCount) {
          state.unreadCount -= state.list[chatIndex].unreadCount;
          state.list[chatIndex].unreadCount = 0;
        }
      })
      .addCase(fetchChatMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 새 채팅 생성
      .addCase(createChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createChat.fulfilled, (state, action) => {
        state.loading = false;

        // 새 채팅을 목록 맨 앞에 추가
        state.list = [action.payload, ...state.list];

        // 생성된 채팅을 현재 채팅으로 선택
        state.currentChat = action.payload;
        state.widget.newChatMode = false;
      })
      .addCase(createChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 메시지 전송
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        const { chatId, message } = action.payload;

        // 메시지맵에 추가
        if (!state.messagesMap[chatId]) {
          state.messagesMap[chatId] = [];
        }
        state.messagesMap[chatId].push(message);

        // 채팅 목록 업데이트
        const chatIndex = state.list.findIndex((chat) => chat.id === chatId);
        if (chatIndex !== -1) {
          state.list[chatIndex].messages = [message];

          // 최신 채팅을 맨 위로 이동
          if (chatIndex > 0) {
            const updatedChat = state.list[chatIndex];
            state.list.splice(chatIndex, 1);
            state.list.unshift(updatedChat);
          }
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 채팅 상태 변경
      .addCase(updateChatStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateChatStatus.fulfilled, (state, action) => {
        state.loading = false;
        const { chatId, status } = action.payload;

        // 채팅 목록에서 상태 업데이트
        const chatIndex = state.list.findIndex((chat) => chat.id === chatId);
        if (chatIndex !== -1) {
          state.list[chatIndex].status = status;
        }

        // 현재 채팅인 경우 상태 업데이트
        if (state.currentChat?.id === chatId) {
          state.currentChat.status = status;
        }
      })
      .addCase(updateChatStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 읽지 않은 메시지 수 조회
      .addCase(fetchUnreadCount.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload.unreadCount;
      })
      .addCase(fetchUnreadCount.rejected, (state, action) => {
        state.error = action.payload;
      })

      // 관리자용 채팅
      // extraReducers에 추가할 내용
      .addCase(fetchAdminChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminChats.fulfilled, (state, action) => {
        state.loading = false;
        state.adminList = action.payload;
      })
      .addCase(fetchAdminChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(assignChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignChat.fulfilled, (state, action) => {
        state.loading = false;
        const { chatId, adminId, admin } = action.payload;

        // 현재 선택된 채팅인 경우 업데이트
        if (state.currentChat?.id === chatId) {
          state.currentChat.adminId = adminId;
          state.currentChat.admin = admin;
          state.currentChat.status = 'in_progress';
        }

        // 관리자 채팅 목록에서 해당 채팅 업데이트
        const adminChatIndex = state.adminList.findIndex(
          (chat) => chat.id === chatId,
        );
        if (adminChatIndex !== -1) {
          state.adminList[adminChatIndex].adminId = adminId;
          state.adminList[adminChatIndex].admin = admin;
          state.adminList[adminChatIndex].status = 'in_progress';
        }

        // 일반 채팅 목록에서도 해당 채팅 업데이트
        const chatIndex = state.list.findIndex((chat) => chat.id === chatId);
        if (chatIndex !== -1) {
          state.list[chatIndex].adminId = adminId;
          state.list[chatIndex].admin = admin;
          state.list[chatIndex].status = 'in_progress';
        }
      })
      .addCase(assignChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  receiveMessage,
  adminJoined,
  chatClosed,
  openChatWidget,
  closeChatWidget,
  toggleMinimize,
  selectChat,
  startNewChat,
  clearError,
} = chatSlice.actions;

export default chatSlice.reducer;

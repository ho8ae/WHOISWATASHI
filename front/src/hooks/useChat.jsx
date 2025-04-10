// src/hooks/useChat.jsx
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchMyChats,
  fetchAdminChats,
  fetchChatById,
  fetchChatMessages,
  createChat,
  sendMessage,
  updateChatStatus,
  fetchUnreadCount,
  assignChat,
  receiveMessage,
  adminJoined,
  chatClosed,
  openChatWidget,
  closeChatWidget,
  toggleMinimize,
  selectChat,
  startNewChat,
  clearError,
} from '../features/chat/chatSlice';
import useAuth from './useAuth';
import socketService from '../utils/socketService';

const useChat = () => {
  const dispatch = useDispatch();
  const chatState = useSelector((state) => state.chat);
  const { token, user } = useAuth();
  const [socketConnected, setSocketConnected] = useState(false);

  // 관리자 여부 확인
  const isAdmin = user?.role === 'admin';

  // 소켓 초기화 여부 추적
  const socketInitialized = useRef(false);

  // 소켓 상태 변경 핸들러
  const handleSocketStatus = useCallback(() => {
    const isConnected = socketService.isConnected();
    setSocketConnected(isConnected);
    return isConnected;
  }, []);

  const lastSentMessageInfo = {
    chatId: null,
    content: null,
    timestamp: 0
  };

  // 소켓 이벤트 핸들러 설정
  const setupSocketEvents = useCallback(
    (socket) => {
      if (!socket) return;

      // 채팅 메시지 수신
      socket.on('new_message', (message) => {
        console.log('New message received:', message);
        if (message && message.chatId) {
          dispatch(receiveMessage({ chatId: message.chatId, message }));
        }
      });
      

      // 관리자 참여
      socket.on('admin_joined', (data) => {
        console.log('Admin joined:', data);
        dispatch(adminJoined(data));
      });

      // 채팅 종료
      socket.on('chat_closed', (data) => {
        console.log('Chat closed:', data);
        dispatch(chatClosed(data));
      });

      // 채팅 기록 수신
      socket.on('chat_history', (messages) => {
        console.log(
          'Chat history received:',
          messages?.length || 0,
          'messages',
        );
        if (chatState.currentChat?.id && messages?.length) {
          const enhancedMessages = messages.map((msg) => ({
            ...msg,
            chatId: msg.chatId || chatState.currentChat.id,
          }));

          dispatch(
            receiveMessage({
              chatId: chatState.currentChat.id,
              messages: enhancedMessages,
            }),
          );
        }
      });

      // 관리자용 이벤트 리스너
      if (isAdmin) {
        socket.on('new_chat', (chat) => {
          console.log('New chat received:', chat);
          dispatch(fetchAdminChats());
        });

        socket.on('chat_assigned', (data) => {
          console.log('Chat assigned:', data);
          dispatch(fetchAdminChats());
        });

        socket.on('pending_chats', (chats) => {
          console.log('Pending chats received:', chats);
        });
      }
    },
    [dispatch, isAdmin, chatState.currentChat?.id],
  );

  // 소켓 초기화
  const initializeSocket = useCallback(() => {
    if (!token) {
      console.error('Cannot initialize socket: No auth token');
      return;
    }

    if (socketInitialized.current) {
      console.log('Socket already initialized');
      return;
    }

    console.log('Initializing socket with token');

    // 소켓 연결
    const socket = socketService.connect(token);
    if (!socket) {
      console.error('Failed to create socket instance');
      return;
    }

    // 연결 상태 이벤트 설정
    socket.on('connect', () => {
      console.log('Socket connected');
      socketInitialized.current = true;
      handleSocketStatus();
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      handleSocketStatus();
    });

    // 소켓 이벤트 핸들러 설정
    setupSocketEvents(socket);
  }, [token, setupSocketEvents, handleSocketStatus]);

  // 컴포넌트 마운트 시 초기화
  useEffect(() => {
    if (token && !socketInitialized.current) {
      initializeSocket();

      // 사용자 또는 관리자에 따라 다른 액션 실행
      if (isAdmin) {
        dispatch(fetchAdminChats());
      } else {
        dispatch(fetchMyChats());
        dispatch(fetchUnreadCount());
      }
    }

    // 언마운트 시 정리
    return () => {
      if (socketInitialized.current) {
        socketService.disconnect();
        socketInitialized.current = false;
        setSocketConnected(false);
      }
    };
  }, [token, dispatch, initializeSocket, isAdmin]);

  

  // 소켓 연결 상태 확인
  const checkSocketConnection = useCallback(() => {
    return handleSocketStatus();
  }, [handleSocketStatus]);

  // 재연결
  const reconnectSocket = useCallback(() => {
    console.log('Manually reconnecting socket');
    socketService.disconnect();
    socketInitialized.current = false;
    setSocketConnected(false);

    setTimeout(() => {
      if (token) {
        initializeSocket();
      }
    }, 1000);
  }, [token, initializeSocket]);

  // 채팅 목록 조회
  const getMyChats = useCallback(() => {
    return dispatch(fetchMyChats());
  }, [dispatch]);

  const getAdminChats = useCallback(() => {
    return dispatch(fetchAdminChats());
  }, [dispatch]);

  // 채팅 상세 조회
  const getChatById = useCallback(
    (chatId) => {
      return dispatch(fetchChatById(chatId));
    },
    [dispatch],
  );

  // 채팅 메시지 목록 조회
  const getChatMessages = useCallback(
    (chatId) => {
      return dispatch(fetchChatMessages(chatId));
    },
    [dispatch],
  );

  // 새 채팅 생성
  const createNewChat = useCallback(
    (subject, initialMessage) => {
      return dispatch(createChat({ subject, initialMessage }));
    },
    [dispatch],
  );

  // 소켓을 통한 채팅 시작
  const startChat = useCallback(
    (subject, initialMessage) => {
      if (socketConnected) {
        const success = socketService.emit('start_chat', {
          subject,
          initialMessage,
        });
        if (!success) {
          return dispatch(createChat({ subject, initialMessage }));
        }
        return Promise.resolve();
      } else {
        return dispatch(createChat({ subject, initialMessage }));
      }
    },
    [dispatch, socketConnected],
  );

  // 메시지 전송
  const sendChatMessage = useCallback((chatId, content) => {
    if (!chatId || !content) {
      return Promise.reject('유효하지 않은 메시지 정보입니다.');
    }
    
    // 빈 문자열 체크
    const trimmedContent = content.trim();
    if (!trimmedContent) {
      return Promise.reject('메시지 내용을 입력해주세요.');
    }
    
    console.log(`메시지 전송 시도: chatId=${chatId}, content=${trimmedContent}`);
    
    // 소켓 연결 상태 확인
    const isConnected = socketService.isConnected();
    console.log(`현재 소켓 연결 상태: ${isConnected ? '연결됨' : '연결 안됨'}`);
    
    if (isConnected) {
      // 소켓 연결되어 있으면 소켓으로 전송
      console.log('소켓으로 메시지 전송 시도');
      const success = socketService.emit('send_message', { chatId, message: trimmedContent });
      
      // 전송 결과 로깅
      if (success) {
        console.log('소켓으로 메시지 전송 성공');
        
        // 소켓 전송 성공해도 Redux에 메시지 추가 (UI 바로 업데이트)
        const mockResponse = {
          data: {
            id: `temp-${Date.now()}`,
            chatId,
            content: trimmedContent,
            senderId: user?.id,
            sender: user,
            createdAt: new Date().toISOString()
          }
        };
        
        // Redux에 임시 메시지 추가
        dispatch(receiveMessage({ 
          chatId, 
          message: mockResponse.data
        }));
        
        return Promise.resolve(mockResponse);
      } else {
        console.log('소켓 전송 실패, API로 대체 전송');
        // 소켓 실패시 API로 대체
        return dispatch(sendMessage({ chatId, content: trimmedContent }));
      }
    } else {
      // 소켓 연결 안 되어 있으면 API로 전송
      console.log('소켓 연결 안됨, API로 메시지 전송');
      return dispatch(sendMessage({ chatId, content: trimmedContent }));
    }
  }, [dispatch, socketConnected, user]);

  // 채팅 종료
  const closeChat = useCallback(
    (chatId) => {
      if (!chatId) {
        return Promise.reject('유효하지 않은 채팅 정보입니다.');
      }

      if (socketConnected) {
        const success = socketService.emit('close_chat', chatId);
        if (!success) {
          return dispatch(updateChatStatus({ chatId, status: 'closed' }));
        }
        return Promise.resolve();
      } else {
        return dispatch(updateChatStatus({ chatId, status: 'closed' }));
      }
    },
    [dispatch, socketConnected],
  );

  // 채팅방 입장
  const joinChat = useCallback(
    (chatId) => {
      if (!chatId) return;

      if (socketConnected) {
        socketService.emit('join_chat', chatId);
      }

      dispatch(fetchChatMessages(chatId));
    },
    [dispatch, socketConnected],
  );

  // 관리자 채팅방 입장
  const joinAdminChat = useCallback(
    (chatId) => {
      if (!chatId || !isAdmin) return;

      if (socketConnected) {
        socketService.emit('admin_join_chat', chatId);
      }

      dispatch(fetchChatMessages(chatId));
    },
    [dispatch, socketConnected, isAdmin],
  );

  // 관리자 배정
  const assignChatToMe = useCallback(
    (chatId) => {
      if (!isAdmin || !user?.id) return Promise.reject('권한이 없습니다.');
      return dispatch(assignChat({ chatId, adminId: user.id }));
    },
    [dispatch, isAdmin, user?.id],
  );

  // 타이핑 상태 전송
  const sendTypingStatus = useCallback(
    (chatId, isTyping) => {
      if (socketConnected) {
        socketService.emit('typing', { chatId, isTyping });
      }
    },
    [socketConnected],
  );

  // UI 관련 함수
  const openWidget = useCallback(() => {
    dispatch(openChatWidget());
  }, [dispatch]);

  const closeWidget = useCallback(() => {
    dispatch(closeChatWidget());
  }, [dispatch]);

  const toggleWidget = useCallback(() => {
    dispatch(toggleMinimize());
  }, [dispatch]);

  const selectCurrentChat = useCallback((chat) => {
    if (!chat) {
      // 채팅이 null이면 채팅 선택 해제 (null 대신 undefined 사용)
      dispatch(selectChat(undefined));
      return;
    }
    
    if (!chat.id) return;
    
    dispatch(selectChat(chat));
    
    if (isAdmin) {
      joinAdminChat(chat.id);
    } else {
      joinChat(chat.id);
    }
  }, [dispatch, joinChat, joinAdminChat, isAdmin]);

  const startNewChatMode = useCallback(() => {
    dispatch(startNewChat());
  }, [dispatch]);

  const resetError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    // 상태
    chats: chatState.list,
    adminChats: chatState.adminList,
    currentChat: chatState.currentChat,
    messages: chatState.currentChat
      ? chatState.messagesMap[chatState.currentChat.id] || []
      : [],
    isWidgetOpen: chatState.widget.isOpen,
    isWidgetMinimized: chatState.widget.isMinimized,
    isNewChatMode: chatState.widget.newChatMode,
    unreadCount: chatState.unreadCount,
    loading: chatState.loading,
    error: chatState.error,
    socketConnected,

    // 액션
    getMyChats,
    getAdminChats,
    getChatById,
    getChatMessages,
    createNewChat,
    startChat,
    sendChatMessage,
    closeChat,
    joinChat,
    joinAdminChat,
    assignChatToMe,
    sendTypingStatus,

    // UI 관련
    openWidget,
    closeWidget,
    toggleWidget,
    selectCurrentChat,
    startNewChatMode,
    resetError,

    // 소켓 관리
    checkSocketConnection,
    reconnectSocket,
    initializeSocket,
  };
};

export default useChat;

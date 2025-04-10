// src/components/chat/ChatWidgetProvider.jsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ChatWidget from './ChatWidget';
import useAuth from '../../hooks/useAuth';

/**
 * 채팅 위젯을 앱 전체에서 관리하기 위한 프로바이더 컴포넌트
 * 로그인 상태에 따라 채팅 위젯을 표시하거나 숨김
 */
const ChatWidgetProvider = () => {
  const { isAuthenticated, user } = useAuth();
  const [shouldShow, setShouldShow] = useState(false);
  const { isWidgetOpen } = useSelector(state => state.chat.widget || { isOpen: false });
  
  // 사용자가 로그인하면 위젯 표시 상태를 업데이트
  useEffect(() => {
    // 로그인 상태이고 일반 사용자(관리자가 아닌 경우)인 경우에만 위젯 표시
    if (isAuthenticated && user && user.role !== 'admin') {
      setShouldShow(true);
    } else {
      setShouldShow(false);
    }
  }, [isAuthenticated, user]);
  
  // 페이지를 떠날 때 경고 표시 (채팅이 진행 중인 경우)
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isWidgetOpen) {
        const message = '채팅이 진행 중입니다. 페이지를 나가시겠습니까?';
        e.returnValue = message; // Chrome에서는 이 메시지가 표시되지 않지만 필요함
        return message;
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isWidgetOpen]);
  
  // 참고: 소켓 연결은 위젯 버튼 클릭 시 ChatWidget 컴포넌트에서 initializeSocket() 호출로 처리됨
  
  // 위젯을 표시해야 하는 경우에만 렌더링
  if (!shouldShow) return null;
  
  return <ChatWidget />;
};

export default ChatWidgetProvider;
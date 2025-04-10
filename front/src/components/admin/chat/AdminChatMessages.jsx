// src/components/admin/chat/AdminChatMessages.jsx
import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

// 시간 포맷팅
const formatTime = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// 날짜 포맷팅
const formatDate = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // 오늘, 어제, 또는 날짜를 표시
  if (date.toDateString() === today.toDateString()) {
    return '오늘';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return '어제';
  } else {
    return date.toLocaleDateString();
  }
};

const AdminChatMessages = ({ messages, currentChat, messagesEndRef }) => {
  // 중복 제거된 메시지 저장 state
  const [uniqueMessages, setUniqueMessages] = useState([]);
  const containerRef = useRef(null);
  
  // 메시지 중복 제거 처리
  useEffect(() => {
    if (!messages || !Array.isArray(messages)) {
      setUniqueMessages([]);
      return;
    }
    
    // 메시지 ID 기반 중복 제거
    const messageMap = new Map();
    const contentTimeMap = new Map(); // 내용 + 시간 기반 중복 체크용
    
    // 정렬된 메시지 배열 준비 (시간순)
    const sortedMessages = [...messages].sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeA - timeB;
    });
    
    // 중복 제거 처리
    sortedMessages.forEach(msg => {
      if (!msg) return;
      
      // ID가 있으면 ID로 중복 체크
      if (msg.id) {
        messageMap.set(msg.id, msg);
      } else {
        // ID가 없으면 내용 + 생성시간으로 중복 체크
        const content = msg.content || msg.message || '';
        const time = msg.createdAt ? new Date(msg.createdAt).getTime() : Date.now();
        const key = `${content}-${time}`;
        
        // 5초 이내 같은 내용 메시지는 중복으로 처리
        let isDuplicate = false;
        contentTimeMap.forEach((value, existingKey) => {
          const [existingContent, existingTimeStr] = existingKey.split('-');
          const existingTime = parseInt(existingTimeStr);
          
          if (content === existingContent && Math.abs(time - existingTime) < 5000) {
            isDuplicate = true;
          }
        });
        
        if (!isDuplicate) {
          contentTimeMap.set(key, msg);
        }
      }
    });
    
    // ID 기반과 내용 기반 중복 제거 결과 합치기
    const uniqueMessagesArray = [
      ...Array.from(messageMap.values()),
      ...Array.from(contentTimeMap.values()).filter(msg => !msg.id) // ID 없는 메시지만 추가
    ];
    
    // 다시 시간순 정렬
    uniqueMessagesArray.sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeA - timeB;
    });
    
    setUniqueMessages(uniqueMessagesArray);
  }, [messages]);
  
  // 메시지 변경 시 자동 스크롤
  useEffect(() => {
    if (messagesEndRef.current && containerRef.current) {
      // 스크롤을 최하단으로 이동
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'end' 
      });
      
      // 추가적으로 살짝 더 스크롤 (여백 추가)
      setTimeout(() => {
        containerRef.current.scrollTop = containerRef.current.scrollHeight + 100;
      }, 100);
    }
  }, [uniqueMessages]);
  
  // 메시지가 없는 경우
  if (!uniqueMessages || uniqueMessages.length === 0) {
    return (
      <div ref={containerRef} className="flex-1 overflow-y-auto p-4 flex flex-col">
        <div className="self-center bg-gray-800 px-4 py-2 rounded-lg text-gray-400 text-sm">
          {currentChat?.status === 'pending' ? (
            '고객이 문의를 시작했습니다. 응대를 시작해주세요.'
          ) : currentChat?.status === 'closed' ? (
            '상담이 종료되었습니다.'
          ) : (
            '대화를 시작하세요!'
          )}
        </div>
        <div ref={messagesEndRef} className="h-4" /> {/* 여백 추가 */}
      </div>
    );
  }
  
  // 같은 날짜의 메시지를 그룹화하는 로직
  const groupedMessages = [];
  let currentDate = null;
  
  uniqueMessages.forEach((message, index) => {
    // message가 비어있거나 null인 경우 건너뛰기
    if (!message) return;
    
    const messageDate = message.createdAt ? formatDate(message.createdAt) : null;
    
    // 날짜가 변경되면 날짜 구분선 추가
    if (messageDate && messageDate !== currentDate) {
      currentDate = messageDate;
      groupedMessages.push({ 
        type: 'date', 
        date: messageDate, 
        id: `date-${message.id || index}` 
      });
    }
    
    groupedMessages.push(message);
  });
  
  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
      {groupedMessages.map((item, index) => {
        // item이 비어있거나 null인 경우 건너뛰기
        if (!item) return null;
        
        // 날짜 구분선인 경우
        if (item.type === 'date') {
          return (
            <div key={item.id} className="self-center bg-gray-800 px-3 py-1 rounded-full text-xs text-gray-400 my-2">
              {item.date}
            </div>
          );
        }
        
        // 시스템 메시지인 경우
        if (item.type === 'system') {
          return (
            <div key={item.id || `system-${index}`} className="self-center bg-gray-800 px-3 py-2 rounded-lg text-xs text-gray-400">
              {item.content || '시스템 메시지'}
            </div>
          );
        }
        
        // 일반 메시지인 경우 - 사용자 또는 관리자 메시지 구분
        // 메시지 내용 확인
        const messageContent = item.content || item.message || '';
        
        // 사용자 메시지 vs 관리자 메시지 구분
        const isUserMessage = currentChat && item.senderId === currentChat.userId;
        
        return (
          <motion.div
            key={item.id || `msg-${index}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`max-w-[75%] flex ${isUserMessage ? 'self-start' : 'self-end flex-row-reverse'}`}
          >
            {/* 프로필 아이콘 */}
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              isUserMessage ? 'bg-gray-700 mr-2' : 'bg-blue-600 ml-2'
            }`}>
              <span className="text-xs font-bold text-white">
                {isUserMessage 
                  ? currentChat.user?.name?.charAt(0) || 'C' 
                  : item.sender?.name?.charAt(0) || 'A'}
              </span>
            </div>
            
            {/* 메시지 내용 */}
            <div className="flex flex-col">
              {/* 발신자 이름 */}
              <span className={`text-xs mb-1 ${isUserMessage ? 'text-gray-400' : 'text-blue-400 text-right'}`}>
                {isUserMessage 
                  ? currentChat.user?.name || '고객' 
                  : item.sender?.name || '관리자'}
              </span>
              
              {/* 메시지 버블 */}
              <div className={`px-3 py-2 rounded-xl text-white ${
                isUserMessage ? 'bg-gray-700 rounded-tl-sm' : 'bg-blue-600 rounded-tr-sm'
              }`}>
                {messageContent}
              </div>
              
              {/* 시간 */}
              <div className={`text-xs text-gray-500 mt-1 ${isUserMessage ? 'text-left' : 'text-right'}`}>
                {formatTime(item.createdAt)}
              </div>
            </div>
          </motion.div>
        );
      })}
      {/* 스크롤 여백 확보를 위한 요소 */}
      <div ref={messagesEndRef} className="h-8" />
    </div>
  );
};

export default AdminChatMessages;
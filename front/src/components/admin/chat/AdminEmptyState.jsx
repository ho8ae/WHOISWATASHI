// src/components/admin/chat/AdminEmptyState.jsx
import React from 'react';

const AdminEmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="bg-gray-800 p-8 rounded-xl max-w-lg">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-16 w-16 mx-auto mb-4 text-gray-500" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
          />
        </svg>
        
        <h2 className="text-2xl font-bold mb-2">채팅을 선택해주세요</h2>
        <p className="text-gray-400 mb-6">
          왼쪽에서 고객 채팅을 선택하여 상담을 시작하세요. 대기 중인 채팅을 우선적으로 확인해주세요.
        </p>
        
        <div className="grid grid-cols-2 gap-4 text-left">
          <div className="bg-gray-700 p-3 rounded-lg">
            <div className="flex items-center mb-2">
              <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
              <span className="font-medium">대기 중</span>
            </div>
            <p className="text-sm text-gray-400">
              고객이 상담을 요청하고 관리자 배정을 기다리고 있습니다.
            </p>
          </div>
          
          <div className="bg-gray-700 p-3 rounded-lg">
            <div className="flex items-center mb-2">
              <span className="inline-block w-3 h-3 bg-blue-600 rounded-full mr-2"></span>
              <span className="font-medium">상담 중</span>
            </div>
            <p className="text-sm text-gray-400">
              관리자가 배정되어 상담이 진행 중입니다.
            </p>
          </div>
          
          <div className="bg-gray-700 p-3 rounded-lg">
            <div className="flex items-center mb-2">
              <span className="inline-block w-3 h-3 bg-gray-500 rounded-full mr-2"></span>
              <span className="font-medium">종료됨</span>
            </div>
            <p className="text-sm text-gray-400">
              상담이 완료되어 채팅이 종료되었습니다.
            </p>
          </div>
          
          <div className="bg-gray-700 p-3 rounded-lg">
            <div className="flex items-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">알아두세요</span>
            </div>
            <p className="text-sm text-gray-400">
              채팅 종료 후에는 다시 활성화할 수 없습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEmptyState;
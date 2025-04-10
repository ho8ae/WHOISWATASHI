// src/test/SocketTestPage.jsx
import React, { useState, useEffect } from 'react';
import socketService from '../utils/socketService';

const SocketTestPage = () => {
  const [token, setToken] = useState('');
  const [connected, setConnected] = useState(false);
  const [socketInfo, setSocketInfo] = useState({});
  const [serverReachable, setServerReachable] = useState(null);
  const [logs, setLogs] = useState([]);

  // 로컬 스토리지에서 토큰 가져오기
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // 소켓 정보 업데이트
  const updateSocketInfo = () => {
    const info = socketService.getSocketInfo();
    setConnected(info.connected);
    setSocketInfo(info);
  };

  // 로그 추가
  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toISOString().substr(11, 8);
    setLogs(prev => [{
      id: Date.now(),
      time: timestamp,
      message,
      type
    }, ...prev].slice(0, 50)); // 최대 50개 로그 유지
  };

  // 서버 연결성 테스트
  const testServerConnection = async () => {
    addLog('서버 연결성 테스트 중...', 'info');
    const reachable = await socketService.testConnection();
    setServerReachable(reachable);
    addLog(`서버 연결성 테스트 결과: ${reachable ? '성공' : '실패'}`, reachable ? 'success' : 'error');
  };

  // 소켓 연결
  const connectSocket = () => {
    addLog('소켓 연결 시도...', 'info');
    
    const socket = socketService.connect(token);
    
    if (!socket) {
      addLog('소켓 인스턴스 생성 실패', 'error');
      return;
    }
    
    socket.on('connect', () => {
      addLog(`소켓 연결 성공: ${socket.id}`, 'success');
      updateSocketInfo();
    });
    
    socket.on('connect_error', (error) => {
      addLog(`소켓 연결 오류: ${error.message}`, 'error');
      updateSocketInfo();
    });
    
    socket.on('disconnect', (reason) => {
      addLog(`소켓 연결 해제: ${reason}`, 'warning');
      updateSocketInfo();
    });
    
    // 5초마다 소켓 정보 업데이트
    const interval = setInterval(updateSocketInfo, 5000);
    
    return () => {
      clearInterval(interval);
      socket.off('connect');
      socket.off('connect_error');
      socket.off('disconnect');
    };
  };

  // 소켓 연결 해제
  const disconnectSocket = () => {
    addLog('소켓 연결 해제 요청', 'info');
    socketService.disconnect();
    updateSocketInfo();
  };
  
  // 간단한 메시지 전송 테스트
  const sendTestMessage = () => {
    if (!connected) {
      addLog('소켓이 연결되지 않았습니다', 'error');
      return;
    }
    
    addLog('테스트 메시지 전송', 'info');
    socketService.emit('test_message', { text: 'Hello, server!', time: new Date().toISOString() });
  };

  // 로그 지우기
  const clearLogs = () => {
    setLogs([]);
    addLog('로그 지워짐', 'info');
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">소켓 테스트 페이지</h1>
      
      {/* 토큰 관리 */}
      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="text-lg font-semibold mb-2">인증 토큰</h2>
        <div className="flex space-x-2 mb-4">
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="JWT 토큰 입력"
            className="flex-1 border p-2 rounded"
          />
          <button
            onClick={() => {
              localStorage.setItem('token', token);
              addLog('토큰이 localStorage에 저장됨', 'success');
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            저장
          </button>
          <button
            onClick={() => {
              const storedToken = localStorage.getItem('token');
              if (storedToken) {
                setToken(storedToken);
                addLog('localStorage에서 토큰 로드됨', 'info');
              } else {
                addLog('localStorage에 토큰이 없음', 'warning');
              }
            }}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            로드
          </button>
        </div>
      </div>
      
      {/* 서버 연결성 테스트 */}
      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="text-lg font-semibold mb-2">서버 연결성 테스트</h2>
        <div className="flex items-center space-x-4 mb-2">
          <div className="flex-1">
            <span className="mr-2">상태:</span>
            {serverReachable === null ? (
              <span className="text-gray-500">테스트되지 않음</span>
            ) : serverReachable ? (
              <span className="text-green-500">서버 응답 성공</span>
            ) : (
              <span className="text-red-500">서버 응답 실패</span>
            )}
          </div>
          <button
            onClick={testServerConnection}
            className="px-4 py-2 bg-purple-500 text-white rounded"
          >
            서버 테스트
          </button>
        </div>
      </div>
      
      {/* 소켓 연결 관리 */}
      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="text-lg font-semibold mb-2">소켓 연결 관리</h2>
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1">
            <span className="mr-2">상태:</span>
            <span className={connected ? 'text-green-500' : 'text-red-500'}>
              {connected ? '연결됨' : '연결 안됨'}
            </span>
          </div>
          <button
            onClick={connectSocket}
            disabled={connected}
            className={`px-4 py-2 rounded ${
              connected ? 'bg-gray-300' : 'bg-green-500 text-white'
            }`}
          >
            연결
          </button>
          <button
            onClick={disconnectSocket}
            disabled={!connected}
            className={`px-4 py-2 rounded ${
              !connected ? 'bg-gray-300' : 'bg-red-500 text-white'
            }`}
          >
            연결 해제
          </button>
          <button
            onClick={sendTestMessage}
            disabled={!connected}
            className={`px-4 py-2 rounded ${
              !connected ? 'bg-gray-300' : 'bg-blue-500 text-white'
            }`}
          >
            테스트 메시지
          </button>
        </div>
        
        {socketInfo.id && (
          <div className="bg-gray-100 p-3 rounded text-sm">
            <h3 className="font-medium mb-1">소켓 정보</h3>
            <div className="grid grid-cols-2 gap-2">
              <div><span className="font-medium">ID:</span> {socketInfo.id}</div>
              <div><span className="font-medium">연결 상태:</span> {socketInfo.connected ? '연결됨' : '연결 안됨'}</div>
              <div><span className="font-medium">전송 방식:</span> {socketInfo.transport || 'N/A'}</div>
              <div><span className="font-medium">URL:</span> {socketInfo.url || 'N/A'}</div>
            </div>
          </div>
        )}
      </div>
      
      {/* 로그 */}
      <div className="bg-white p-4 rounded shadow">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">로그</h2>
          <button
            onClick={clearLogs}
            className="px-2 py-1 bg-gray-200 rounded text-sm"
          >
            지우기
          </button>
        </div>
        
        <div className="h-64 overflow-y-auto border rounded p-2 text-sm font-mono">
          {logs.length === 0 ? (
            <div className="text-gray-400 text-center mt-4">로그가 없습니다</div>
          ) : (
            logs.map(log => (
              <div 
                key={log.id} 
                className={`mb-1 ${
                  log.type === 'error' ? 'text-red-600' :
                  log.type === 'warning' ? 'text-yellow-600' :
                  log.type === 'success' ? 'text-green-600' :
                  'text-gray-800'
                }`}
              >
                <span className="text-gray-500 mr-2">[{log.time}]</span>
                {log.message}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SocketTestPage;
// src/utils/socketService.js 수정 - 중복 방지 로직 제거/개선
import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.debug = true; // 디버깅 모드 활성화
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.pendingMessages = []; // 연결이 끊겼을 때 메시지 저장
    // lastEmittedMessages 중복 방지 변수 제거
  }

  // 소켓 연결
  connect(token) {
    this.log('소켓 연결 시도', { tokenExists: !!token });
    
    // 이미 연결된 소켓이 있으면 재사용
    if (this.socket && this.socket.connected) {
      this.log('이미 연결된 소켓 재사용:', this.socket.id);
      
      // 저장된 메시지 전송 시도
      this.sendPendingMessages();
      
      return this.socket;
    }

    // 이전 소켓이 있지만 연결되지 않은 경우 정리
    if (this.socket) {
      this.log('이전 소켓 정리');
      this.disconnect();
    }

    try {
      // 소켓 서버 URL 
      // 중요: .env 파일에서 가져오는 URL이 없다면 기본값 사용
      const socketUrl =  'http://localhost:5001';
      this.log('소켓 서버 URL:', socketUrl);

      // 소켓 생성 옵션
      const options = {
        auth: { token },
        transports: ['websocket', 'polling'],
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 20000,
        // 개발용 디버깅 활성화
        forceNew: true,
        debug: true
      };
      
      this.log('소켓 생성 옵션:', options);

      // 소켓 인스턴스 생성
      this.socket = io(socketUrl, options);
      this.log('소켓 인스턴스 생성됨');

      // 이벤트 리스너 등록
      this.socket.on('connect', () => {
        this.log('✅ 소켓 연결 성공:', this.socket.id);
        this.reconnectAttempts = 0;
        
        // 연결 후 저장된 메시지 전송
        this.sendPendingMessages();
      });

      this.socket.on('connect_error', (error) => {
        this.log('❌ 소켓 연결 오류:', error);
        console.error('소켓 연결 오류 상세:', {
          message: error.message,
          description: error.description,
          type: error.type,
          data: error.data
        });
        
        // 자동 재연결 시도
        this.attemptReconnect();
      });

      this.socket.io.on('error', (error) => {
        this.log('❌ 엔진 오류:', error);
      });

      this.socket.io.on('reconnect_attempt', (attempt) => {
        this.log(`재연결 시도 ${attempt}`);
      });

      this.socket.on('disconnect', (reason) => {
        this.log('소켓 연결 해제:', reason);
      });

      return this.socket;
    } catch (error) {
      this.log('❌ 소켓 생성 중 오류 발생:', error);
      this.socket = null;
      return null;
    }
  }
  
  // 자동 재연결 시도
  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      this.log(`자동 재연결 시도 ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
      
      setTimeout(() => {
        // 임시 저장된 토큰 사용
        const token = localStorage.getItem('accessToken');
        if (token) {
          this.connect(token);
        }
      }, 2000 * this.reconnectAttempts); // 점점 더 긴 간격으로 재시도
    } else {
      this.log('최대 재연결 시도 횟수 초과');
    }
  }
  
  // 대기 중인 메시지 전송
  sendPendingMessages() {
    if (this.pendingMessages.length > 0 && this.socket && this.socket.connected) {
      this.log(`대기 중인 메시지 ${this.pendingMessages.length}개 전송 시도`);
      
      const messagesToSend = [...this.pendingMessages];
      this.pendingMessages = [];
      
      messagesToSend.forEach(item => {
        this.log(`대기 메시지 전송: ${item.event}`, item.data);
        this.socket.emit(item.event, item.data);
      });
    }
  }

  // 디버그 로그
  log(message, data) {
    if (this.debug) {
      if (data) {
        console.log(`[SocketService] ${message}`, data);
      } else {
        console.log(`[SocketService] ${message}`);
      }
    }
  }

  // 이벤트 등록
  on(event, callback) {
    if (!this.socket) {
      this.log('❌ 이벤트 등록 실패: 소켓이 초기화되지 않음');
      return;
    }
    
    this.log(`이벤트 리스너 등록: ${event}`);
    this.socket.on(event, callback);
  }

  // 이벤트 제거
  off(event) {
    if (!this.socket) return;
    
    if (event) {
      this.log(`이벤트 리스너 제거: ${event}`);
      this.socket.off(event);
    } else {
      this.log('모든 이벤트 리스너 제거');
      this.socket.removeAllListeners();
    }
  }

  // 이벤트 발송 - 중복 방지 로직 제거
  emit(event, data) {
    if (!this.socket || !this.socket.connected) {
      this.log(`❌ 이벤트 발송 실패 (${event}): 소켓이 연결되지 않음`);
      
      // 메시지 저장하여 나중에 전송
      if (event === 'send_message' || event === 'join_chat' || event === 'admin_join_chat') {
        this.log(`메시지 저장 (나중에 전송): ${event}`, data);
        this.pendingMessages.push({ event, data, timestamp: Date.now() });
      }
      
      return false;
    }
    
    // 이전의 중복 방지 로직 제거
    
    this.log(`이벤트 발송: ${event}`, data);
    this.socket.emit(event, data);
    return true;
  }

  // 소켓 연결 해제
  disconnect() {
    if (this.socket) {
      this.log('소켓 연결 해제 및 정리');
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // 연결 상태 확인
  isConnected() {
    const connected = this.socket && this.socket.connected;
    this.log(`연결 상태 확인: ${connected ? '연결됨' : '연결 안됨'}`);
    return connected;
  }

  // 소켓 정보 조회
  getSocketInfo() {
    if (!this.socket) {
      return { connected: false };
    }
    
    return {
      id: this.socket.id,
      connected: this.socket.connected,
      transport: this.socket.io?.engine?.transport?.name,
      upgrades: this.socket.io?.engine?.upgrades,
      url: this.socket.io?.uri,
      readyState: this.socket.io?.engine?.readyState
    };
  }

  // 서버 연결성 테스트
  async testConnection() {
    try {
      const socketUrl =  'http://localhost:5001';
      const healthUrl = `${socketUrl}/socket-health`;
      
      this.log(`서버 연결성 테스트: ${healthUrl}`);
      
      const response = await fetch(healthUrl, { 
        mode: 'cors',
        method: 'GET'
      });
      
      if (response.ok) {
        const data = await response.json();
        this.log('서버 응답:', data);
        return true;
      }
      
      this.log('서버 응답 실패:', response.status);
      return false;
    } catch (error) {
      this.log('서버 연결성 테스트 오류:', error);
      return false;
    }
  }
}

// 싱글톤 인스턴스
const socketService = new SocketService();
export default socketService;
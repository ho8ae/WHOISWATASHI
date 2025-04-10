require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const { setupSocket } = require('./src/utils/socket');

// HTTP 서버 생성
const server = http.createServer(app);

// Socket.io 서버 설정 - 반환값 확인
const io = setupSocket(server);
if (!io) {
  console.error('Socket.io 서버 설정에 실패했습니다.');
  process.exit(1);
}

// 서버 시작
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`Socket.io 서버가 설정되었습니다. (${io.engine.clientsCount} 클라이언트 연결됨)`);
  console.log(`CORS 설정: ${io._corsOrigin || '기본값'}`);
  console.log(`개발 화이팅입니다.`);
});
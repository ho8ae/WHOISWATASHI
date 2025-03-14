require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const { setupSocket } = require('./src/utils/socket');

// HTTP 서버 생성
const server = http.createServer(app);

// Socket.io 서버 설정
const io = setupSocket(server);

// 서버 시작
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`WHOISWATHSHI 서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`웹소켓 서버가 실행되었습니다.`);
  console.log(`개발 화이팅입니다.`);
});
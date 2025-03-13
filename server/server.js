require('dotenv').config();
const app = require('./src/app');  // app.js 가져오기

// 서버 시작
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`WHOISWATHSHI 서버가 포트 ${PORT}에서 실행 중입니다.\n개발 화이팅입니다.`);
});
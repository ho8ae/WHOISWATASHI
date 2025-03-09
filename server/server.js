const dotenv = require('dotenv');
const app = require('./src/app');  // app.js 가져오기

// 환경 변수 로드
dotenv.config();

// 서버 시작
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
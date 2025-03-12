const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger 기본 정보 설정
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'WHOISWATASHI-API',
      version: '1.0.0',
      description: 'WHOISWATASHI API 문서',
      contact: {
        name: 'low(ho8ae)',
        email: 'xogh2242@gmail.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5001',
        description: '개발 서버'
      }
    ],
    // 보안 스키마 추가
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: '로그인 후 발급받은 JWT 토큰을 입력하세요. 형식: Bearer [token]'
        }
      }
    },
    // 전역 보안 설정 (선택적)
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  // API 경로를 자동으로 찾아볼 경로
  apis: [
    './src/docs/swagger/*.js',  // 모든 Swagger 문서 파일
    // './src/config/swagger-definitions.js' // 공통 스키마 정의 (필요시)
  ]
};

const specs = swaggerJsdoc(options);

// Swagger UI 옵션 설정
const swaggerUiOptions = {
  explorer: true,
  swaggerOptions: {
    persistAuthorization: true, // 페이지 새로고침 후에도 인증 유지
  }
};

module.exports = { 
  specs, 
  swaggerUi,
  swaggerUiOptions // Swagger UI 옵션 내보내기
};
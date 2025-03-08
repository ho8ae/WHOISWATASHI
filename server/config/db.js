const { Sequelize } = require('sequelize');

// 환경 변수에서 데이터베이스 설정 불러오기
const {
  DB_HOST = 'localhost',
  DB_PORT = 5432,
  DB_NAME = 'shop_db',
  DB_USER = 'postgres',
  DB_PASSWORD = 'postgres',
  NODE_ENV = 'development'
} = process.env;

// Sequelize 인스턴스 생성
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'postgres',
  logging: NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  // 타임존 설정 (한국)
  timezone: '+09:00'
});

module.exports = {
  sequelize,
  Sequelize
};
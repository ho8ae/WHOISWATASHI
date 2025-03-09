const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * 인증 미들웨어
 */
const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: '인증이 필요합니다.'
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '인증이 필요합니다.'
      });
    }
    
    // 요청 객체에 사용자 정보 추가
    req.user = user;
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: '토큰이 만료되었습니다.'
      });
    }
    
    return res.status(401).json({
      success: false,
      message: '인증이 필요합니다.'
    });
  }
};

/**
 * 관리자 권한 확인 미들웨어
 */
const isAdmin = async (req, res, next) => {
  try {
    // 먼저 인증 확인
    await isAuthenticated(req, res, () => {
      // 인증 성공 후 관리자 권한 확인
      if (req.user && req.user.role === 'admin') {
        return next();
      }
      
      return res.status(403).json({
        success: false,
        message: '관리자 권한이 필요합니다.'
      });
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다.'
    });
  }
};

module.exports = {
  isAuthenticated,
  isAdmin
};
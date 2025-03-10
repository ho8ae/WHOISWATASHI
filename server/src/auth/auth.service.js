const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const prisma = new PrismaClient();
const emailService = require('../utils/email');

/**
 * 회원가입
 */
async function register(userData) {
  const { 
    email, 
    password, 
    name, 
    phone, 
    birthYear, 
    birthMonth, 
    birthDay, 
    isSolarCalendar, 
    agreeSMS, 
    verificationCode 
  } = userData;
  
  // 이메일 중복 확인
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });
  
  if (existingUser) {
    throw new Error('이미 등록된 이메일입니다.');
  }
  
  // 전화번호 인증 확인 (테스트 환경에서는 123456 허용)
  let isVerified = false;
  
  if (process.env.NODE_ENV !== 'production' && verificationCode === "123456") {
    isVerified = true;
  } else {
    const verification = await prisma.verificationCode.findFirst({
      where: {
        phone,
        code: verificationCode,
        isVerified: false,
        expiresAt: { gt: new Date() }
      }
    });
    
    if (!verification) {
      throw new Error('유효하지 않은 인증번호입니다.');
    }
    
    isVerified = true;
    
    // 인증번호 사용 처리
    await prisma.verificationCode.update({
      where: { id: verification.id },
      data: { isVerified: true }
    });
  }
  
  if (!isVerified) {
    throw new Error('전화번호 인증이 필요합니다.');
  }
  
  // 비밀번호 해싱
  const hashedPassword = await bcrypt.hash(password, 12);
  
  // 사용자 생성
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      phone,
      birthYear: birthYear ? parseInt(birthYear) : null,
      birthMonth: birthMonth ? parseInt(birthMonth) : null,
      birthDay: birthDay ? parseInt(birthDay) : null,
      isSolarCalendar,
      agreeSMS,
      agreeTerms: true, // 필수 동의
      agreePrivacy: true, // 필수 동의
    }
  });
  
  // 토큰 생성
  const { accessToken, refreshToken } = generateTokens(user);
  
  // 리프레시 토큰 저장
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken }
  });

  try {
    // 환영 이메일 발송
    await emailService.sendWelcomeEmail(email, name);
  } catch (error) {
    console.error('환영 이메일 발송 실패:', error);
    // 이메일 발송에 실패해도 회원가입 프로세스는 계속 진행
  }
  
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    accessToken,
    refreshToken
  };
}

/**
 * 로그인
 */
async function login(email, password) {
  // 사용자 조회
  const user = await prisma.user.findUnique({
    where: { email }
  });
  
  if (!user) {
    throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
  }
  
  // 비밀번호 확인
  const isPasswordValid = await bcrypt.compare(password, user.password);
  
  if (!isPasswordValid) {
    throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
  }
  
  // 토큰 생성
  const { accessToken, refreshToken } = generateTokens(user);
  
  // 리프레시 토큰 저장
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken }
  });
  
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    accessToken,
    refreshToken
  };
}

/**
 * 토큰 갱신
 */
async function refreshAccessToken(refreshToken) {
  if (!refreshToken) {
    throw new Error('리프레시 토큰이 제공되지 않았습니다.');
  }
  
  // 토큰에서 사용자 ID 추출
  let userId;
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    userId = decoded.userId;
  } catch (error) {
    throw new Error('유효하지 않은 리프레시 토큰입니다.');
  }
  
  // 사용자 조회 및 토큰 확인
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  
  if (!user || user.refreshToken !== refreshToken) {
    throw new Error('유효하지 않은 리프레시 토큰입니다.');
  }
  
  // 새 액세스 토큰 생성
  const accessToken = generateAccessToken(user);
  
  return { accessToken };
}

/**
 * 인증번호 생성 및 발송
 */
async function sendVerificationCode(phone) {
  // 테스트용 고정 인증번호
  const code = process.env.NODE_ENV === 'production' ? 
    Math.floor(100000 + Math.random() * 900000).toString() : "123456";
  
  // 만료 시간 설정 (5분)
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 5);
  
  // 기존 인증번호가 있으면 삭제
  await prisma.verificationCode.deleteMany({
    where: { phone }
  });
  
  // 인증번호 저장
  await prisma.verificationCode.create({
    data: {
      phone,
      code,
      expiresAt
    }
  });
  
  console.log(`테스트 환경 - 전화번호: ${phone}, 인증번호: ${code}`);
  
  // TODO: 실제 SMS 발송 로직 구현
  // SMS 서비스 API를 호출하여 인증번호 발송
  
  return { success: true, message: '인증번호가 발송되었습니다.' };
}

/**
 * 인증번호 확인
 */
async function verifyCode(phone, code) {
  // 테스트 환경에서는 고정 코드 허용
  if (process.env.NODE_ENV !== 'production' && code === "123456") {
    return { success: true, message: '인증이 완료되었습니다.' };
  }
  
  const verification = await prisma.verificationCode.findFirst({
    where: {
      phone,
      code,
      isVerified: false,
      expiresAt: { gt: new Date() }
    }
  });
  
  if (!verification) {
    throw new Error('유효하지 않은 인증번호입니다.');
  }
  
  // 인증 완료 상태로 업데이트
  await prisma.verificationCode.update({
    where: { id: verification.id },
    data: { isVerified: true }
  });
  
  return { success: true, message: '인증이 완료되었습니다.' };
}

/**
 * 토큰 생성 유틸리티 함수
 */
function generateTokens(user) {
  const accessToken = generateAccessToken(user);
  
  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );
  
  return { accessToken, refreshToken };
}

/**
 * 액세스 토큰 생성
 */
function generateAccessToken(user) {
  return jwt.sign(
    { 
      userId: user.id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
  );
}


/**
 * 비밀번호 재설정 요청
 */
async function requestPasswordReset(email) {
  // 사용자 조회
  const user = await prisma.user.findUnique({
    where: { email }
  });
  
  if (!user) {
    // 보안을 위해 사용자가 없어도 성공 메시지 반환
    return { success: true, message: '비밀번호 재설정 안내가 이메일로 발송되었습니다.' };
  }
  
  // 랜덤 토큰 생성
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = await bcrypt.hash(resetToken, 12);
  
  // 만료 시간 설정 (1시간)
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1);
  
  // 기존 미사용 토큰 삭제
  await prisma.passwordReset.deleteMany({
    where: {
      userId: user.id,
      isUsed: false
    }
  });
  
  // 새 비밀번호 재설정 토큰 저장
  await prisma.passwordReset.create({
    data: {
      userId: user.id,
      token: hashedToken,
      expiresAt
    }
  });
  
  // 비밀번호 재설정 URL 생성
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}?email=${encodeURIComponent(email)}`;
  
  // 개발 환경에서는 콘솔에 로그 출력
  if (process.env.NODE_ENV !== 'production') {
    console.log('===== 비밀번호 재설정 링크 =====');
    console.log(resetUrl);
    console.log('=====================================');
    
    // 개발 환경용 치팅 토큰 저장
    if (email === 'admin@example.com' || email === 'test@example.com') {
      const cheatToken = '123456';
      const hashedCheatToken = await bcrypt.hash(cheatToken, 12);
      
      // 치팅 토큰 저장
      await prisma.passwordReset.create({
        data: {
          userId: user.id,
          token: hashedCheatToken,
          expiresAt: new Date(expiresAt.getTime() + 24 * 60 * 60 * 1000) // 24시간 유효
        }
      });
      
      console.log('===== 개발용 치팅 토큰 =====');
      console.log(`이메일: ${email}, 치팅 토큰: ${cheatToken}`);
      console.log('===========================');
    }
  }
  
  try {
    // 이메일 발송
    await emailService.sendPasswordResetEmail(email, resetUrl);
  } catch (error) {
    console.error('비밀번호 재설정 이메일 발송 실패:', error);
    // 이메일 발송에 실패해도 프로세스는 계속 진행
  }
  
  return { success: true, message: '비밀번호 재설정 안내가 이메일로 발송되었습니다.' };
}

/**
 * 비밀번호 재설정 토큰 검증
 */
async function verifyResetToken(email, token) {
  const user = await prisma.user.findUnique({
    where: { email }
  });
  
  if (!user) {
    throw new Error('유효하지 않은 요청입니다.');
  }
  
  // 개발 환경에서 치팅 토큰 확인
  if (process.env.NODE_ENV !== 'production' && (email === 'admin@example.com' || email === 'test@example.com') && token === '123456') {
    return { success: true, userId: user.id };
  }
  
  // 토큰 검증
  const resetRecord = await prisma.passwordReset.findFirst({
    where: {
      userId: user.id,
      isUsed: false,
      expiresAt: { gt: new Date() }
    },
    orderBy: { createdAt: 'desc' }
  });
  
  if (!resetRecord) {
    throw new Error('비밀번호 재설정 링크가 만료되었거나 유효하지 않습니다.');
  }
  
  const tokenValid = await bcrypt.compare(token, resetRecord.token);
  
  if (!tokenValid) {
    throw new Error('비밀번호 재설정 링크가 유효하지 않습니다.');
  }
  
  return { success: true, userId: user.id, resetId: resetRecord.id };
}

/**
 * 비밀번호 재설정
 */
async function resetPassword(userId, resetId, newPassword) {
  // 비밀번호 해싱
  const hashedPassword = await bcrypt.hash(newPassword, 12);
  
  // 트랜잭션으로 비밀번호 변경 및 토큰 사용 처리
  try {
    await prisma.$transaction([
      // 비밀번호 업데이트
      prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword }
      }),
      
      // 재설정 토큰 사용 처리 (테이블이 있는 경우에만)
      prisma.passwordReset.update({
        where: { id: resetId },
        data: { isUsed: true }
      })
    ]);
  } catch (error) {
    console.error('비밀번호 재설정 실패:', error);
    throw new Error('비밀번호 재설정에 실패했습니다.');
  }
  
  return { success: true, message: '비밀번호가 성공적으로 재설정되었습니다.' };
}
// 소셜 로그인 메서드 (추후 구현)
/*
async function kakaoLogin(kakaoId, profile) {
  // 카카오 로그인 로직
}

async function googleLogin(googleId, profile) {
  // 구글 로그인 로직
}
*/

module.exports = {
  register,
  login,
  refreshAccessToken,
  sendVerificationCode,
  verifyCode,
  requestPasswordReset,
  verifyResetToken,
  resetPassword,
  // 추후 소셜 로그인 메서드 추가
  // kakaoLogin,
  // googleLogin
};
const authService = require('./auth.service');

/**
 * 회원가입
 */
async function register(req, res, next) {
  try {
    const result = await authService.register(req.body);
    
    // 쿠키에 리프레시 토큰 저장 (httpOnly, secure)
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7일
    });
    
    res.status(201).json({
      success: true,
      data: {
        user: result.user,
        accessToken: result.accessToken
      },
      message: '회원가입이 성공적으로 완료되었습니다.'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 로그인
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    
    // 쿠키에 리프레시 토큰 저장
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7일
    });
    
    res.json({
      success: true,
      data: {
        user: result.user,
        accessToken: result.accessToken
      },
      message: '로그인에 성공했습니다.'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 로그아웃
 */
async function logout(req, res, next) {
  try {
    // 쿠키에서 리프레시 토큰 제거
    res.clearCookie('refreshToken');
    
    res.json({
      success: true,
      message: '로그아웃되었습니다.'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 토큰 갱신
 */
async function refreshToken(req, res, next) {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    const result = await authService.refreshAccessToken(refreshToken);
    
    res.json({
      success: true,
      data: {
        accessToken: result.accessToken
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 인증번호 발송
 */
async function sendVerificationCode(req, res, next) {
  try {
    const { phone } = req.body;
    const result = await authService.sendVerificationCode(phone);
    
    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 인증번호 확인
 */
async function verifyCode(req, res, next) {
  try {
    const { phone, code } = req.body;
    const result = await authService.verifyCode(phone, code);
    
    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 현재 사용자 정보 조회
 */
async function getCurrentUser(req, res, next) {
  try {
    // 인증 미들웨어를 통해 req.user에 사용자 정보가 추가됨
    res.json({
      success: true,
      data: {
        user: req.user
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 비밀번호 재설정 요청
 */
async function requestPasswordReset(req, res, next) {
  try {
    const { email } = req.body;
    const result = await authService.requestPasswordReset(email);
    
    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 비밀번호 재설정 토큰 검증
 */
async function verifyResetToken(req, res, next) {
  try {
    const { email, token } = req.body;
    const result = await authService.verifyResetToken(email, token);
    
    res.json({
      success: true,
      data: { userId: result.userId, resetId: result.resetId }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 새 비밀번호 설정
 */
async function resetPassword(req, res, next) {
  try {
    const { userId, resetId, password } = req.body;
    const result = await authService.resetPassword(userId, resetId, password);
    
    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
}

// 소셜 로그인 컨트롤러 (추후 구현)
/*
async function kakaoCallback(req, res, next) {
  // 카카오 로그인 콜백 처리
}

async function googleCallback(req, res, next) {
  // 구글 로그인 콜백 처리
}
*/

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  sendVerificationCode,
  verifyCode,
  getCurrentUser,
  requestPasswordReset,
  verifyResetToken,
  resetPassword
  // 추후 소셜 로그인 컨트롤러 추가
  // kakaoCallback,
  // googleCallback
};
const { body } = require('express-validator');
const { validationMiddleware } = require('../middleware/validation.middleware');

// 비밀번호 검증 규칙: 영문 대소문자/숫자/특수문자 중 2가지 이상 조합, 10자~16자
const passwordRegex = /^(?:(?=.*[a-z])(?=.*[A-Z])|(?=.*[a-z])(?=.*\d)|(?=.*[a-z])(?=.*[!@#$%^&*])|(?=.*[A-Z])(?=.*\d)|(?=.*[A-Z])(?=.*[!@#$%^&*])|(?=.*\d)(?=.*[!@#$%^&*])).{10,16}$/;

const registerValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('이메일을 입력해주세요.')
    .isEmail().withMessage('유효한 이메일 주소를 입력해주세요.')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('비밀번호를 입력해주세요.')
    .matches(passwordRegex).withMessage('비밀번호는 영문 대소문자/숫자/특수문자 중 2가지 이상 조합, 10자~16자로 입력해주세요.'),
  
  body('passwordConfirm')
    .notEmpty().withMessage('비밀번호 확인을 입력해주세요.')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('비밀번호가 일치하지 않습니다.');
      }
      return true;
    }),
  
  body('name')
    .trim()
    .notEmpty().withMessage('이름을 입력해주세요.')
    .isLength({ max: 50 }).withMessage('이름은 50자 이하로 입력해주세요.'),
  
  body('phone')
    .trim()
    .notEmpty().withMessage('휴대전화 번호를 입력해주세요.')
    .matches(/^01[016789]\d{7,8}$/).withMessage('유효한 휴대전화 번호를 입력해주세요.'),
  
  body('verificationCode')
    .trim()
    .notEmpty().withMessage('인증번호를 입력해주세요.'),
  
  body('birthYear')
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() }).withMessage('유효한 생년을 입력해주세요.'),
  
  body('birthMonth')
    .optional()
    .isInt({ min: 1, max: 12 }).withMessage('유효한 월을 입력해주세요.'),
  
  body('birthDay')
    .optional()
    .isInt({ min: 1, max: 31 }).withMessage('유효한 일을 입력해주세요.'),
  
  body('isSolarCalendar')
    .optional()
    .isBoolean().withMessage('양력/음력 여부를 선택해주세요.'),
  
  body('agreeTerms')
    .isBoolean().withMessage('이용약관 동의 여부를 선택해주세요.')
    .custom(value => {
      if (!value) {
        throw new Error('이용약관에 동의해주세요.');
      }
      return true;
    }),
  
  body('agreePrivacy')
    .isBoolean().withMessage('개인정보 수집 및 이용 동의 여부를 선택해주세요.')
    .custom(value => {
      if (!value) {
        throw new Error('개인정보 수집 및 이용에 동의해주세요.');
      }
      return true;
    }),
  
  body('agreeSMS')
    .optional()
    .isBoolean().withMessage('SMS 수신 동의 여부를 선택해주세요.'),
  
  validationMiddleware
];

const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('이메일을 입력해주세요.')
    .isEmail().withMessage('유효한 이메일 주소를 입력해주세요.')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('비밀번호를 입력해주세요.'),
  
  validationMiddleware
];

const sendVerificationValidation = [
  body('phone')
    .trim()
    .notEmpty().withMessage('휴대전화 번호를 입력해주세요.')
    .matches(/^01[016789]\d{7,8}$/).withMessage('유효한 휴대전화 번호를 입력해주세요.'),
  
  validationMiddleware
];

const verifyCodeValidation = [
  body('phone')
    .trim()
    .notEmpty().withMessage('휴대전화 번호를 입력해주세요.')
    .matches(/^01[016789]\d{7,8}$/).withMessage('유효한 휴대전화 번호를 입력해주세요.'),
  
  body('code')
    .trim()
    .notEmpty().withMessage('인증번호를 입력해주세요.')
    .isLength({ min: 6, max: 6 }).withMessage('6자리 인증번호를 입력해주세요.'),
  
  validationMiddleware
];

const requestResetValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('이메일을 입력해주세요.')
    .isEmail().withMessage('유효한 이메일 주소를 입력해주세요.')
    .normalizeEmail(),
  
  validationMiddleware
];

const verifyResetTokenValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('이메일을 입력해주세요.')
    .isEmail().withMessage('유효한 이메일 주소를 입력해주세요.')
    .normalizeEmail(),
  
  body('token')
    .trim()
    .notEmpty().withMessage('토큰을 입력해주세요.'),
  
  validationMiddleware
];

const resetPasswordValidation = [
  body('userId')
    .isInt().withMessage('유효하지 않은 사용자 ID입니다.'),
  
  body('resetId')
    .isInt().withMessage('유효하지 않은 재설정 ID입니다.'),
  
  body('password')
    .notEmpty().withMessage('비밀번호를 입력해주세요.')
    .matches(passwordRegex).withMessage('비밀번호는 영문 대소문자/숫자/특수문자 중 2가지 이상 조합, 10자~16자로 입력해주세요.'),
  
  validationMiddleware
];
module.exports = {
  authValidation: {
    register: registerValidation,
    login: loginValidation,
    sendVerification: sendVerificationValidation,
    verifyCode: verifyCodeValidation,
    requestReset: requestResetValidation,
    verifyResetToken: verifyResetTokenValidation,
    resetPassword: resetPasswordValidation
  }
};
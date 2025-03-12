const { body } = require('express-validator');

// 사용자 프로필 수정 유효성 검사
const updateProfileValidation = [
  body('name')
    .optional()
    .isString()
    .isLength({ min: 2, max: 50 })
    .withMessage('이름은 2-50자 사이여야 합니다.'),
  
  body('phone')
    .optional()
    .isMobilePhone('ko-KR')
    .withMessage('유효한 한국 휴대폰 번호 형식이 아닙니다.'),
  
  body('birthYear')
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage('출생년도는 1900년에서 현재 사이여야 합니다.'),
  
  body('birthMonth')
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage('출생월은 1-12 사이여야 합니다.'),
  
  body('birthDay')
    .optional()
    .isInt({ min: 1, max: 31 })
    .withMessage('출생일은 1-31 사이여야 합니다.'),
  
  body('isSolarCalendar')
    .optional()
    .isBoolean()
    .withMessage('양력 여부는 불리언 값이어야 합니다.'),
  
  body('agreeSMS')
    .optional()
    .isBoolean()
    .withMessage('SMS 수신 동의 여부는 불리언 값이어야 합니다.'),
  
  body('currentPassword')
    .optional()
    .isString()
    .withMessage('현재 비밀번호는 문자열이어야 합니다.'),
  
  body('newPassword')
    .optional()
    .isString()
    .isLength({ min: 8, max: 20 })
    .withMessage('새 비밀번호는 8-20자 사이여야 합니다.')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/)
    .withMessage('비밀번호는 최소 8자 이상, 문자와 숫자를 포함해야 합니다.'),
];

module.exports = {
  updateProfileValidation
};
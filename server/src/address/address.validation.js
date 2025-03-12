const { body, param } = require('express-validator');

// 주소 ID 파라미터 유효성 검사
const addressIdParamValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('주소 ID는 양의 정수여야 합니다.')
];

// 주소 생성 유효성 검사
const createAddressValidation = [
  body('name')
    .isString()
    .notEmpty()
    .withMessage('주소 별칭은 필수입니다.')
    .isLength({ max: 50 })
    .withMessage('주소 별칭은 최대 50자까지 가능합니다.'),
  
  body('recipient')
    .isString()
    .notEmpty()
    .withMessage('수령인은 필수입니다.')
    .isLength({ max: 50 })
    .withMessage('수령인 이름은 최대 50자까지 가능합니다.'),
  
  body('postalCode')
    .isString()
    .notEmpty()
    .withMessage('우편번호는 필수입니다.')
    .isLength({ max: 10 })
    .withMessage('우편번호는 최대 10자까지 가능합니다.'),
  
  body('address1')
    .isString()
    .notEmpty()
    .withMessage('기본 주소는 필수입니다.')
    .isLength({ max: 255 })
    .withMessage('기본 주소는 최대 255자까지 가능합니다.'),
  
  body('address2')
    .optional()
    .isString()
    .isLength({ max: 255 })
    .withMessage('상세 주소는 최대 255자까지 가능합니다.'),
  
  body('phone')
    .optional()
    .isMobilePhone('ko-KR')
    .withMessage('유효한 한국 휴대폰 번호 형식이 아닙니다.'),
  
  body('isDefault')
    .optional()
    .isBoolean()
    .withMessage('기본 주소 여부는 불리언 값이어야 합니다.')
];

// 주소 수정 유효성 검사
const updateAddressValidation = [
  ...addressIdParamValidation,
  
  body('name')
    .optional()
    .isString()
    .isLength({ max: 50 })
    .withMessage('주소 별칭은 최대 50자까지 가능합니다.'),
  
  body('recipient')
    .optional()
    .isString()
    .isLength({ max: 50 })
    .withMessage('수령인 이름은 최대 50자까지 가능합니다.'),
  
  body('postalCode')
    .optional()
    .isString()
    .isLength({ max: 10 })
    .withMessage('우편번호는 최대 10자까지 가능합니다.'),
  
  body('address1')
    .optional()
    .isString()
    .isLength({ max: 255 })
    .withMessage('기본 주소는 최대 255자까지 가능합니다.'),
  
  body('address2')
    .optional()
    .isString()
    .isLength({ max: 255 })
    .withMessage('상세 주소는 최대 255자까지 가능합니다.'),
  
  body('phone')
    .optional()
    .isMobilePhone('ko-KR')
    .withMessage('유효한 한국 휴대폰 번호 형식이 아닙니다.'),
  
  body('isDefault')
    .optional()
    .isBoolean()
    .withMessage('기본 주소 여부는 불리언 값이어야 합니다.')
];

module.exports = {
  addressIdParamValidation,
  createAddressValidation,
  updateAddressValidation
};
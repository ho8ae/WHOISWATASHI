const { body } = require('express-validator');
const { validationMiddleware } = require('../middleware/validation.middleware');

// 프로모션 알림 전송 유효성 검증
const promotionNotificationValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('제목은 필수 입력사항입니다.')
    .isLength({ max: 255 }).withMessage('제목은 최대 255자까지 입력 가능합니다.'),
  
  body('message')
    .trim()
    .notEmpty().withMessage('내용은 필수 입력사항입니다.'),
  
  body('actionUrl')
    .optional()
    .isURL().withMessage('유효한 URL을 입력해주세요.'),
  
  validationMiddleware
];

module.exports = {
  promotionNotificationValidation
};
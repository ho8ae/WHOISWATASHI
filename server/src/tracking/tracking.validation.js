const { body, param } = require('express-validator');

// 주문 ID 파라미터 유효성 검사
const orderIdParamValidation = [
  param('orderId')
    .isInt({ min: 1 })
    .withMessage('유효한 주문 ID가 필요합니다.')
];

// 주문 상태 업데이트 유효성 검사
const updateOrderStatusValidation = [
  ...orderIdParamValidation,
  
  body('status')
    .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'])
    .withMessage('유효한 주문 상태가 필요합니다.'),
  
  body('message')
    .optional()
    .isString()
    .isLength({ max: 255 })
    .withMessage('메시지는 최대 255자까지 입력 가능합니다.')
];

// 배송 추적 정보 업데이트 유효성 검사
const updateTrackingInfoValidation = [
  ...orderIdParamValidation,
  
  body('trackingNumber')
    .isString()
    .notEmpty()
    .withMessage('운송장 번호가 필요합니다.'),
  
  body('carrier')
    .optional()
    .isString()
    .withMessage('유효한 배송사 이름이 필요합니다.'),
  
  body('shippedAt')
    .optional()
    .isISO8601()
    .withMessage('유효한 날짜 형식이 필요합니다.')
];

module.exports = {
  orderIdParamValidation,
  updateOrderStatusValidation,
  updateTrackingInfoValidation
};
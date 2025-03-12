const Joi = require('joi');

// 사용자 목록 조회 쿼리 유효성 검사
const getUsersQuery = {
  query: Joi.object({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(100),
    search: Joi.string().trim(),
    role: Joi.string().valid('customer', 'admin')
  })
};

// 사용자 ID 파라미터 유효성 검사
const getUserParams = {
  params: Joi.object({
    id: Joi.number().integer().required()
  })
};

// 사용자 역할 업데이트 유효성 검사
const updateUserRole = {
  params: Joi.object({
    id: Joi.number().integer().required()
  }),
  body: Joi.object({
    role: Joi.string().valid('customer', 'admin').required()
  })
};

// 주문 목록 조회 쿼리 유효성 검사
const getOrdersQuery = {
  query: Joi.object({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(100),
    status: Joi.string().valid('pending', 'processing', 'completed', 'cancelled', 'refunded'),
    search: Joi.string().trim(),
    fromDate: Joi.date().iso(),
    toDate: Joi.date().iso().min(Joi.ref('fromDate'))
  })
};

// 주문 업데이트 유효성 검사
const updateOrder = {
  params: Joi.object({
    id: Joi.number().integer().required()
  }),
  body: Joi.object({
    status: Joi.string().valid('pending', 'processing', 'completed', 'cancelled', 'refunded'),
    trackingNumber: Joi.string().allow('', null),
    shippedAt: Joi.date().iso().allow(null),
    notes: Joi.string().allow('', null)
  }).min(1)
};

// 재고 업데이트 유효성 검사
const updateStock = {
  params: Joi.object({
    id: Joi.number().integer().required()
  }),
  body: Joi.object({
    stock: Joi.number().integer().min(0).required()
  })
};

module.exports = {
  getUsersQuery,
  getUserParams,
  updateUserRole,
  getOrdersQuery,
  updateOrder,
  updateStock
};
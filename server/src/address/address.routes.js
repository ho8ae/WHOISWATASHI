const express = require('express');
const router = express.Router();
const addressController = require('./address.controller');
const { isAuthenticated } = require('../middleware/auth.middleware');
const { validationMiddleware } = require('../middleware/validation.middleware');
const { 
  addressIdParamValidation, 
  createAddressValidation, 
  updateAddressValidation 
} = require('./address.validation');

// 모든 경로에 인증 미들웨어 적용
router.use(isAuthenticated);

// 사용자 주소 목록 조회
router.get('/', addressController.getUserAddresses);

// 주소 상세 조회
router.get('/:id', addressIdParamValidation, validationMiddleware, addressController.getAddressById);

// 주소 생성
router.post('/', createAddressValidation, validationMiddleware, addressController.createAddress);

// 주소 수정
router.put('/:id', updateAddressValidation, validationMiddleware, addressController.updateAddress);

// 주소 삭제
router.delete('/:id', addressIdParamValidation, validationMiddleware, addressController.deleteAddress);

// 기본 주소 설정
router.patch('/:id/default', addressIdParamValidation, validationMiddleware, addressController.setDefaultAddress);

module.exports = router;
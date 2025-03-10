const express = require('express');
const router = express.Router();
const optionTypeController = require('./optionType.controller');
const authMiddleware = require('../middleware/auth.middleware');

// 옵션 타입 관련 라우트
router.get('/', optionTypeController.getAllOptionTypes);
router.get('/:id', optionTypeController.getOptionTypeById);
router.post('/', authMiddleware.isAdmin, optionTypeController.createOptionType);
router.put('/:id', authMiddleware.isAdmin, optionTypeController.updateOptionType);
router.delete('/:id', authMiddleware.isAdmin, optionTypeController.deleteOptionType);

// 옵션 값 관련 라우트
router.post('/:optionTypeId/values', authMiddleware.isAdmin, optionTypeController.createOptionValue);
router.put('/values/:valueId', authMiddleware.isAdmin, optionTypeController.updateOptionValue);
router.delete('/values/:valueId', authMiddleware.isAdmin, optionTypeController.deleteOptionValue);

module.exports = router;
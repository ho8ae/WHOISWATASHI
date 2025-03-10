const optionTypeService = require('./optionType.service');

/**
 * 모든 옵션 타입 조회
 */
async function getAllOptionTypes(req, res, next) {
  try {
    const optionTypes = await optionTypeService.getAllOptionTypes();
    res.json({
      success: true,
      data: optionTypes
    });
  } catch (error) {
    next(error);
  }
}

/**
 * ID로 옵션 타입 조회
 */
async function getOptionTypeById(req, res, next) {
  try {
    const { id } = req.params;
    const optionType = await optionTypeService.getOptionTypeById(id);
    
    if (!optionType) {
      return res.status(404).json({
        success: false,
        message: '옵션 타입을 찾을 수 없습니다.'
      });
    }
    
    res.json({
      success: true,
      data: optionType
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 옵션 타입 생성
 */
async function createOptionType(req, res, next) {
  try {
    const optionType = await optionTypeService.createOptionType(req.body);
    
    res.status(201).json({
      success: true,
      data: optionType,
      message: '옵션 타입이 생성되었습니다.'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 옵션 타입 수정
 */
async function updateOptionType(req, res, next) {
  try {
    const { id } = req.params;
    const optionType = await optionTypeService.updateOptionType(id, req.body);
    
    res.json({
      success: true,
      data: optionType,
      message: '옵션 타입이 수정되었습니다.'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 옵션 타입 삭제
 */
async function deleteOptionType(req, res, next) {
  try {
    const { id } = req.params;
    await optionTypeService.deleteOptionType(id);
    
    res.json({
      success: true,
      message: '옵션 타입이 삭제되었습니다.'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 옵션 값 생성
 */
async function createOptionValue(req, res, next) {
  try {
    const { optionTypeId } = req.params;
    const optionValue = await optionTypeService.createOptionValue(optionTypeId, req.body);
    
    res.status(201).json({
      success: true,
      data: optionValue,
      message: '옵션 값이 생성되었습니다.'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 옵션 값 수정
 */
async function updateOptionValue(req, res, next) {
  try {
    const { valueId } = req.params;
    const optionValue = await optionTypeService.updateOptionValue(valueId, req.body);
    
    res.json({
      success: true,
      data: optionValue,
      message: '옵션 값이 수정되었습니다.'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 옵션 값 삭제
 */
async function deleteOptionValue(req, res, next) {
  try {
    const { valueId } = req.params;
    await optionTypeService.deleteOptionValue(valueId);
    
    res.json({
      success: true,
      message: '옵션 값이 삭제되었습니다.'
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllOptionTypes,
  getOptionTypeById,
  createOptionType,
  updateOptionType,
  deleteOptionType,
  createOptionValue,
  updateOptionValue,
  deleteOptionValue
};
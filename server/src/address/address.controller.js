const addressService = require('./address.service');

/**
 * 사용자 주소 목록 조회
 */
async function getUserAddresses(req, res, next) {
  try {
    const userId = req.user.id;
    const addresses = await addressService.getUserAddresses(userId);

    res.json({
      success: true,
      data: addresses
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 주소 상세 조회
 */
async function getAddressById(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const address = await addressService.getAddressById(id, userId);

    res.json({
      success: true,
      data: address
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 주소 생성
 */
async function createAddress(req, res, next) {
  try {
    const userId = req.user.id;
    const address = await addressService.createAddress(userId, req.body);

    res.status(201).json({
      success: true,
      data: address,
      message: '배송지가 성공적으로 추가되었습니다.'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 주소 수정
 */
async function updateAddress(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const address = await addressService.updateAddress(id, userId, req.body);

    res.json({
      success: true,
      data: address,
      message: '배송지가 성공적으로 수정되었습니다.'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 주소 삭제
 */
async function deleteAddress(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    await addressService.deleteAddress(id, userId);

    res.json({
      success: true,
      message: '배송지가 삭제되었습니다.'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 기본 주소 설정
 */
async function setDefaultAddress(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const address = await addressService.setDefaultAddress(id, userId);

    res.json({
      success: true,
      data: address,
      message: '기본 배송지로 설정되었습니다.'
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getUserAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
};
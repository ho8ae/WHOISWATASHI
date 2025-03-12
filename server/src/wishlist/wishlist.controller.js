const wishlistService = require('./wishlist.service');

/**
 * 위시리스트 조회
 */
async function getWishlist(req, res, next) {
  try {
    const userId = req.user.id;
    const result = await wishlistService.getWishlist(userId, req.query);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 상품이 위시리스트에 있는지 확인
 */
async function checkWishlistItem(req, res, next) {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    
    const isInWishlist = await wishlistService.isProductInWishlist(userId, productId);
    
    res.json({
      success: true,
      data: { isInWishlist }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 위시리스트에 상품 추가
 */
async function addToWishlist(req, res, next) {
  try {
    const userId = req.user.id;
    const { productId } = req.body;
    
    await wishlistService.addToWishlist(userId, productId);
    
    res.status(201).json({
      success: true,
      message: '상품이 위시리스트에 추가되었습니다.'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 위시리스트에서 상품 제거
 */
async function removeFromWishlist(req, res, next) {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    
    await wishlistService.removeFromWishlist(userId, productId);
    
    res.json({
      success: true,
      message: '상품이 위시리스트에서 제거되었습니다.'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 위시리스트 항목 삭제
 */
async function deleteWishlistItem(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    await wishlistService.deleteWishlistItem(id, userId);
    
    res.json({
      success: true,
      message: '위시리스트 항목이 삭제되었습니다.'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 위시리스트 비우기
 */
async function clearWishlist(req, res, next) {
  try {
    const userId = req.user.id;
    
    await wishlistService.clearWishlist(userId);
    
    res.json({
      success: true,
      message: '위시리스트가 비워졌습니다.'
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getWishlist,
  checkWishlistItem,
  addToWishlist,
  removeFromWishlist,
  deleteWishlistItem,
  clearWishlist
};
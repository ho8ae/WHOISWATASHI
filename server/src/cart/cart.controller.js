const cartService = require('./cart.service');
const { v4: uuidv4 } = require('uuid');

/**
 * 장바구니 조회
 */
async function getCart(req, res, next) {
  try {
    // 사용자 ID 또는 세션 ID 확인
    const userId = req.user?.id;
    const sessionId = req.cookies.cartSessionId || (userId ? null : uuidv4());
    
    // 장바구니가 없으면 생성
    const cart = await cartService.getOrCreateCart(userId, sessionId);
    
    // 세션 ID 쿠키 설정 (비로그인 사용자)
    if (!userId && !req.cookies.cartSessionId) {
      res.cookie('cartSessionId', sessionId, {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30일
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
      });
    }
    
    // 장바구니 상세 정보 조회
    const cartDetails = await cartService.getCartDetails(cart.id);
    
    res.json({
      success: true,
      data: cartDetails
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 장바구니에 상품 추가
 */
async function addToCart(req, res, next) {
  try {
    const { productVariantId, quantity = 1 } = req.body;
    
    // 사용자 ID 또는 세션 ID 확인
    const userId = req.user?.id;
    const sessionId = req.cookies.cartSessionId || (userId ? null : uuidv4());
    
    // 장바구니 조회 또는 생성
    const cart = await cartService.getOrCreateCart(userId, sessionId);
    
    // 세션 ID 쿠키 설정 (비로그인 사용자)
    if (!userId && !req.cookies.cartSessionId) {
      res.cookie('cartSessionId', sessionId, {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30일
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
      });
    }
    
    // 장바구니에 상품 추가
    await cartService.addToCart(cart.id, productVariantId, quantity);
    
    // 업데이트된 장바구니 정보 조회
    const cartDetails = await cartService.getCartDetails(cart.id);
    
    res.json({
      success: true,
      data: cartDetails,
      message: '상품이 장바구니에 추가되었습니다.'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 장바구니 아이템 수량 변경
 */
async function updateCartItem(req, res, next) {
  try {
    const { cartItemId } = req.params;
    const { quantity } = req.body;
    
    // 수량 검증
    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: '수량은 1 이상이어야 합니다.'
      });
    }
    
    // 카트 아이템 수량 업데이트
    await cartService.updateCartItemQuantity(cartItemId, quantity);
    
    // 사용자 ID 또는 세션 ID 확인
    const userId = req.user?.id;
    const sessionId = req.cookies.cartSessionId;
    
    // 장바구니 조회
    const cart = await cartService.getOrCreateCart(userId, sessionId);
    
    // 업데이트된 장바구니 정보 조회
    const cartDetails = await cartService.getCartDetails(cart.id);
    
    res.json({
      success: true,
      data: cartDetails,
      message: '장바구니가 업데이트되었습니다.'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 장바구니 아이템 삭제
 */
async function removeCartItem(req, res, next) {
  try {
    const { cartItemId } = req.params;
    
    // 카트 아이템 삭제
    await cartService.removeCartItem(cartItemId);
    
    // 사용자 ID 또는 세션 ID 확인
    const userId = req.user?.id;
    const sessionId = req.cookies.cartSessionId;
    
    // 장바구니 조회
    const cart = await cartService.getOrCreateCart(userId, sessionId);
    
    // 업데이트된 장바구니 정보 조회
    const cartDetails = await cartService.getCartDetails(cart.id);
    
    res.json({
      success: true,
      data: cartDetails,
      message: '상품이 장바구니에서 삭제되었습니다.'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 장바구니 비우기
 */
async function clearCart(req, res, next) {
  try {
    // 사용자 ID 또는 세션 ID 확인
    const userId = req.user?.id;
    const sessionId = req.cookies.cartSessionId;
    
    // 장바구니 조회
    const cart = await cartService.getOrCreateCart(userId, sessionId);
    
    // 장바구니 비우기
    await cartService.clearCart(cart.id);
    
    res.json({
      success: true,
      data: {
        id: cart.id,
        items: [],
        itemCount: 0,
        subtotal: 0
      },
      message: '장바구니가 비워졌습니다.'
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart
};
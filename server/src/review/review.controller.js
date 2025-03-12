const reviewService = require('./review.service');

/**
 * 상품 리뷰 목록 조회
 */
async function getProductReviews(req, res, next) {
  try {
    const { productId } = req.params;
    const result = await reviewService.getProductReviews(productId, req.query);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 사용자 리뷰 목록 조회
 */
async function getUserReviews(req, res, next) {
  try {
    const userId = req.user.id;
    const result = await reviewService.getUserReviews(userId, req.query);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 리뷰 상세 조회
 */
async function getReviewById(req, res, next) {
  try {
    const { id } = req.params;
    const review = await reviewService.getReviewById(id);
    
    res.json({
      success: true,
      data: review
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 리뷰 작성
 */
async function createReview(req, res, next) {
  try {
    const userId = req.user.id;
    const review = await reviewService.createReview(userId, req.body);
    
    res.status(201).json({
      success: true,
      data: review,
      message: '리뷰가 성공적으로 등록되었습니다.'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 리뷰 수정
 */
async function updateReview(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const review = await reviewService.updateReview(id, userId, req.body);
    
    res.json({
      success: true,
      data: review,
      message: '리뷰가 성공적으로 수정되었습니다.'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 리뷰 삭제
 */
async function deleteReview(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.role === 'admin' ? 'admin' : req.user.id;
    await reviewService.deleteReview(id, userId);
    
    res.json({
      success: true,
      message: '리뷰가 삭제되었습니다.'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 작성 가능한 리뷰 목록
 */
async function getReviewableOrders(req, res, next) {
  try {
    const userId = req.user.id;
    const items = await reviewService.getReviewableOrders(userId);
    
    res.json({
      success: true,
      data: items
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProductReviews,
  getUserReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  getReviewableOrders
};
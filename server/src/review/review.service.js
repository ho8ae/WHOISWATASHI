const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * 상품 리뷰 목록 조회
 */
async function getProductReviews(productId, options = {}) {
  const { page = 1, limit = 10, sort = 'latest' } = options;
  const skip = (page - 1) * limit;
  
  // 정렬 옵션 설정
  let orderBy = {};
  switch (sort) {
    case 'highest':
      orderBy = { rating: 'desc' };
      break;
    case 'lowest':
      orderBy = { rating: 'asc' };
      break;
    case 'oldest':
      orderBy = { createdAt: 'asc' };
      break;
    case 'latest':
    default:
      orderBy = { createdAt: 'desc' };
      break;
  }
  
  // 리뷰 및 총 개수 조회
  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: { productId: Number(productId) },
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy,
      skip,
      take: Number(limit)
    }),
    prisma.review.count({
      where: { productId: Number(productId) }
    })
  ]);
  
  // 상품 평균 평점 계산
  const avgRating = await prisma.review.aggregate({
    where: { productId: Number(productId) },
    _avg: { rating: true }
  });
  
  // 평점별 개수 조회
  const ratingCounts = await prisma.review.groupBy({
    by: ['rating'],
    where: { productId: Number(productId) },
    _count: true
  });
  
  // 평점 통계 포맷팅
  const ratingStats = {
    average: avgRating._avg.rating || 0,
    total,
    distribution: {}
  };
  
  // 5점 만점 기준 분포 초기화
  for (let i = 1; i <= 5; i++) {
    ratingStats.distribution[i] = 0;
  }
  
  // 실제 분포 반영
  ratingCounts.forEach((item) => {
    ratingStats.distribution[item.rating] = item._count;
  });
  
  return {
    reviews,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit)
    },
    ratingStats
  };
}

/**
 * 사용자 리뷰 목록 조회
 */
async function getUserReviews(userId, options = {}) {
  const { page = 1, limit = 10 } = options;
  const skip = (page - 1) * limit;
  
  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: { userId: Number(userId) },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            images: {
              where: { isPrimary: true },
              take: 1
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit)
    }),
    prisma.review.count({
      where: { userId: Number(userId) }
    })
  ]);
  
  return {
    reviews: reviews.map(review => ({
      ...review,
      product: {
        ...review.product,
        image: review.product.images[0]?.imageUrl || null
      }
    })),
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit)
    }
  };
}

/**
 * 리뷰 상세 조회
 */
async function getReviewById(reviewId) {
  const review = await prisma.review.findUnique({
    where: { id: Number(reviewId) },
    include: {
      user: {
        select: {
          id: true,
          name: true
        }
      },
      product: {
        select: {
          id: true,
          name: true,
          slug: true
        }
      }
    }
  });
  
  if (!review) {
    throw new Error('리뷰를 찾을 수 없습니다.');
  }
  
  return review;
}

/**
 * 리뷰 작성
 */
async function createReview(userId, reviewData) {
  const { productId, orderId, rating, title, content, images = [] } = reviewData;
  
  // 상품 존재 확인
  const product = await prisma.product.findUnique({
    where: { id: Number(productId) }
  });
  
  if (!product) {
    throw new Error('상품을 찾을 수 없습니다.');
  }
  
  // 주문 확인 (옵션)
  if (orderId) {
    const order = await prisma.order.findUnique({
      where: { 
        id: Number(orderId),
        userId: Number(userId)
      }
    });
    
    if (!order) {
      throw new Error('주문을 찾을 수 없습니다.');
    }
    
    // 주문 상품 확인 (선택적)
    const orderItem = await prisma.orderItem.findFirst({
      where: {
        orderId: Number(orderId),
        productId: Number(productId)
      }
    });
    
    if (!orderItem) {
      throw new Error('주문에 해당 상품이 포함되어 있지 않습니다.');
    }
    
    // 이미 리뷰를 작성했는지 확인
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: Number(userId),
        productId: Number(productId),
        orderId: Number(orderId)
      }
    });
    
    if (existingReview) {
      throw new Error('이미 이 주문에 대한 리뷰를 작성하셨습니다.');
    }
  }
  
  // 리뷰 생성
  return await prisma.review.create({
    data: {
      userId: Number(userId),
      productId: Number(productId),
      orderId: orderId ? Number(orderId) : null,
      rating,
      title,
      content,
      images,
      isVerified: !!orderId // 주문 기반 리뷰인 경우 검증됨으로 표시
    },
    include: {
      user: {
        select: {
          id: true,
          name: true
        }
      },
      product: {
        select: {
          id: true,
          name: true,
          slug: true
        }
      }
    }
  });
}

/**
 * 리뷰 수정
 */
async function updateReview(reviewId, userId, reviewData) {
  // 리뷰 존재 및 소유권 확인
  const review = await prisma.review.findUnique({
    where: { id: Number(reviewId) }
  });
  
  if (!review) {
    throw new Error('리뷰를 찾을 수 없습니다.');
  }
  
  if (review.userId !== Number(userId)) {
    throw new Error('이 리뷰를 수정할 권한이 없습니다.');
  }
  
  // 수정 가능한 필드만 추출
  const { rating, title, content, images } = reviewData;
  const updateData = {};
  
  if (rating !== undefined) updateData.rating = rating;
  if (title !== undefined) updateData.title = title;
  if (content !== undefined) updateData.content = content;
  if (images !== undefined) updateData.images = images;
  
  // 리뷰 업데이트
  return await prisma.review.update({
    where: { id: Number(reviewId) },
    data: updateData,
    include: {
      user: {
        select: {
          id: true,
          name: true
        }
      },
      product: {
        select: {
          id: true,
          name: true,
          slug: true
        }
      }
    }
  });
}

/**
 * 리뷰 삭제
 */
async function deleteReview(reviewId, userId) {
  // 리뷰 존재 및 소유권 확인
  const review = await prisma.review.findUnique({
    where: { id: Number(reviewId) }
  });
  
  if (!review) {
    throw new Error('리뷰를 찾을 수 없습니다.');
  }
  
  if (review.userId !== Number(userId) && userId !== 'admin') {
    throw new Error('이 리뷰를 삭제할 권한이 없습니다.');
  }
  
  // 리뷰 삭제
  return await prisma.review.delete({
    where: { id: Number(reviewId) }
  });
}

/**
 * 주문 기반 작성 가능한 리뷰 목록
 */
async function getReviewableOrders(userId) {
  // 완료된 주문 중 리뷰를 작성하지 않은 상품 목록
  
  // 1. 완료된 주문 조회
  const completedOrders = await prisma.order.findMany({
    where: {
      userId: Number(userId),
      status: 'completed'
    },
    include: {
      items: {
        include: {
          productVariant: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  images: {
                    where: { isPrimary: true },
                    take: 1
                  }
                }
              }
            }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
  
  // 2. 사용자가 작성한 리뷰 조회
  const userReviews = await prisma.review.findMany({
    where: { userId: Number(userId) },
    select: {
      productId: true,
      orderId: true
    }
  });
  
  // 리뷰 작성 여부 확인을 위한 맵 생성
  const reviewedMap = {};
  userReviews.forEach(review => {
    if (review.orderId) {
      const key = `${review.orderId}_${review.productId}`;
      reviewedMap[key] = true;
    }
  });
  
  // 3. 리뷰 작성 가능한 주문 상품 필터링
  const reviewableItems = [];
  
  completedOrders.forEach(order => {
    order.items.forEach(item => {
      const productId = item.productVariant.product.id;
      const key = `${order.id}_${productId}`;
      
      if (!reviewedMap[key]) {
        reviewableItems.push({
          orderId: order.id,
          orderNumber: order.orderNumber,
          orderDate: order.createdAt,
          product: {
            id: productId,
            name: item.productName,
            slug: item.productVariant.product.slug,
            image: item.productVariant.product.images[0]?.imageUrl || null
          }
        });
      }
    });
  });
  
  return reviewableItems;
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
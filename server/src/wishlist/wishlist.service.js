const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * 위시리스트 조회
 */
async function getWishlist(userId, options = {}) {
  const { page = 1, limit = 10 } = options;
  const skip = (page - 1) * limit;
  
  const [wishlistItems, total] = await Promise.all([
    prisma.wishlist.findMany({
      where: { userId: Number(userId) },
      include: {
        product: {
          include: {
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
    prisma.wishlist.count({
      where: { userId: Number(userId) }
    })
  ]);
  
  // 데이터 형식 가공
  const formattedItems = wishlistItems.map(item => ({
    id: item.id,
    productId: item.productId,
    product: {
      id: item.product.id,
      name: item.product.name,
      slug: item.product.slug,
      price: item.product.price,
      salePrice: item.product.salePrice,
      image: item.product.images[0]?.imageUrl || null
    },
    createdAt: item.createdAt
  }));
  
  return {
    items: formattedItems,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit)
    }
  };
}

/**
 * 상품이 위시리스트에 있는지 확인
 */
async function isProductInWishlist(userId, productId) {
  const wishlistItem = await prisma.wishlist.findUnique({
    where: {
      userId_productId: {
        userId: Number(userId),
        productId: Number(productId)
      }
    }
  });
  
  return !!wishlistItem;
}

/**
 * 위시리스트에 상품 추가
 */
async function addToWishlist(userId, productId) {
  // 상품 존재 확인
  const product = await prisma.product.findUnique({
    where: { id: Number(productId) }
  });
  
  if (!product) {
    throw new Error('상품을 찾을 수 없습니다.');
  }
  
  // 이미 위시리스트에 있는지 확인
  const existingItem = await prisma.wishlist.findUnique({
    where: {
      userId_productId: {
        userId: Number(userId),
        productId: Number(productId)
      }
    }
  });
  
  if (existingItem) {
    return existingItem; // 이미 존재하면 기존 항목 반환
  }
  
  // 위시리스트에 추가
  return await prisma.wishlist.create({
    data: {
      userId: Number(userId),
      productId: Number(productId)
    }
  });
}

/**
 * 위시리스트에서 상품 제거
 */
async function removeFromWishlist(userId, productId) {
  return await prisma.wishlist.deleteMany({
    where: {
      userId: Number(userId),
      productId: Number(productId)
    }
  });
}

/**
 * 위시리스트 항목 삭제
 */
async function deleteWishlistItem(id, userId) {
  const wishlistItem = await prisma.wishlist.findUnique({
    where: { id: Number(id) }
  });
  
  if (!wishlistItem) {
    throw new Error('위시리스트 항목을 찾을 수 없습니다.');
  }
  
  if (wishlistItem.userId !== Number(userId)) {
    throw new Error('이 위시리스트 항목을 삭제할 권한이 없습니다.');
  }
  
  return await prisma.wishlist.delete({
    where: { id: Number(id) }
  });
}

/**
 * 위시리스트 비우기
 */
async function clearWishlist(userId) {
  return await prisma.wishlist.deleteMany({
    where: { userId: Number(userId) }
  });
}

module.exports = {
  getWishlist,
  isProductInWishlist,
  addToWishlist,
  removeFromWishlist,
  deleteWishlistItem,
  clearWishlist
};
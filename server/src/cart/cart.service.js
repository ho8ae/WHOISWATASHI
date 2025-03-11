const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * 장바구니 조회 또는 생성
 */
async function getOrCreateCart(userId, sessionId) {
  let cart;
  
  if (userId) {
    // 로그인 사용자: 사용자 ID로 장바구니 조회
    cart = await prisma.cart.findFirst({
      where: { userId: Number(userId) }
    });
    
    if (cart && sessionId) {
      // 로그인 시 세션 장바구니가 있었다면 병합
      await mergeSessionCart(sessionId, userId);
      
      // 세션 ID로 장바구니 제거
      await prisma.cart.deleteMany({
        where: { sessionId, userId: null }
      });
    }
    
    // 장바구니가 없으면 새로 생성
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: Number(userId) }
      });
    }
  } else if (sessionId) {
    // 비로그인 사용자: 세션 ID로 장바구니 조회
    cart = await prisma.cart.findFirst({
      where: { sessionId }
    });
    
    // 장바구니가 없으면 새로 생성
    if (!cart) {
      cart = await prisma.cart.create({
        data: { sessionId }
      });
    }
  } else {
    throw new Error('사용자 ID 또는 세션 ID가 필요합니다.');
  }
  
  return cart;
}

/**
 * 세션 장바구니를 사용자 장바구니로 병합
 */
async function mergeSessionCart(sessionId, userId) {
  const sessionCart = await prisma.cart.findFirst({
    where: { sessionId, userId: null },
    include: { items: true }
  });
  
  if (!sessionCart || sessionCart.items.length === 0) {
    return; // 세션 장바구니가 없거나 비어있으면 병합 불필요
  }
  
  const userCart = await prisma.cart.findFirst({
    where: { userId: Number(userId) },
    include: { items: true }
  });
  
  if (!userCart) {
    // 사용자 장바구니가 없으면 세션 장바구니를 사용자에게 연결
    await prisma.cart.update({
      where: { id: sessionCart.id },
      data: { userId: Number(userId), sessionId: null }
    });
    return;
  }
  
  // 사용자 장바구니에 세션 장바구니 아이템 추가
  for (const item of sessionCart.items) {
    const existingItem = userCart.items.find(
      i => i.productVariantId === item.productVariantId
    );
    
    if (existingItem) {
      // 이미 있는 상품이면 수량 합산
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + item.quantity }
      });
    } else {
      // 없는 상품이면 새로 추가
      await prisma.cartItem.create({
        data: {
          cartId: userCart.id,
          productVariantId: item.productVariantId,
          quantity: item.quantity
        }
      });
    }
  }
}

/**
 * 장바구니 상세 조회
 */
async function getCartDetails(cartId) {
  const cart = await prisma.cart.findUnique({
    where: { id: Number(cartId) },
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
              },
              options: {
                include: {
                  optionValue: {
                    include: {
                      optionType: true
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  });
  
  if (!cart) {
    throw new Error('장바구니를 찾을 수 없습니다.');
  }
  
  // 응답 형식 가공
  const formattedItems = cart.items.map(item => {
    // 상품 옵션 정보 가공
    const options = item.productVariant.options.map(option => ({
      type: option.optionValue.optionType.name,
      value: option.optionValue.value
    }));
    
    // 가격 계산
    const price = item.productVariant.price;
    const salePrice = item.productVariant.salePrice || price;
    const totalPrice = salePrice * item.quantity;
    
    return {
      id: item.id,
      productId: item.productVariant.product.id,
      productName: item.productVariant.product.name,
      productSlug: item.productVariant.product.slug,
      productImage: item.productVariant.product.images[0]?.imageUrl || item.productVariant.imageUrl || null,
      variantId: item.productVariantId,
      options,
      price,
      salePrice,
      quantity: item.quantity,
      totalPrice,
      stock: item.productVariant.stock
    };
  });
  
  // 장바구니 합계 계산
  const subtotal = formattedItems.reduce((sum, item) => sum + item.totalPrice, 0);
  
  return {
    id: cart.id,
    items: formattedItems,
    itemCount: formattedItems.length,
    subtotal
  };
}

/**
 * 장바구니에 상품 추가
 */
async function addToCart(cartId, productVariantId, quantity) {
  // 상품 변형 존재 확인
  const variant = await prisma.productVariant.findUnique({
    where: { id: Number(productVariantId) }
  });
  
  if (!variant) {
    throw new Error('상품을 찾을 수 없습니다.');
  }
  
  if (variant.stock < quantity) {
    throw new Error('재고가 부족합니다.');
  }
  
  // 장바구니에 같은 상품이 있는지 확인
  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId: Number(cartId),
      productVariantId: Number(productVariantId)
    }
  });
  
  if (existingItem) {
    // 이미 있으면 수량 증가
    const newQuantity = existingItem.quantity + quantity;
    
    if (variant.stock < newQuantity) {
      throw new Error('재고가 부족합니다.');
    }
    
    return await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: newQuantity }
    });
  } else {
    // 없으면 새로 추가
    return await prisma.cartItem.create({
      data: {
        cartId: Number(cartId),
        productVariantId: Number(productVariantId),
        quantity
      }
    });
  }
}

/**
 * 장바구니 아이템 수량 변경
 */
async function updateCartItemQuantity(cartItemId, quantity) {
  const cartItem = await prisma.cartItem.findUnique({
    where: { id: Number(cartItemId) },
    include: {
      productVariant: true
    }
  });
  
  if (!cartItem) {
    throw new Error('장바구니 아이템을 찾을 수 없습니다.');
  }
  
  if (cartItem.productVariant.stock < quantity) {
    throw new Error('재고가 부족합니다.');
  }
  
  return await prisma.cartItem.update({
    where: { id: Number(cartItemId) },
    data: { quantity }
  });
}

/**
 * 장바구니 아이템 삭제
 */
async function removeCartItem(cartItemId) {
  return await prisma.cartItem.delete({
    where: { id: Number(cartItemId) }
  });
}

/**
 * 장바구니 비우기
 */
async function clearCart(cartId) {
  return await prisma.cartItem.deleteMany({
    where: { cartId: Number(cartId) }
  });
}

module.exports = {
  getOrCreateCart,
  mergeSessionCart,
  getCartDetails,
  addToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart
};
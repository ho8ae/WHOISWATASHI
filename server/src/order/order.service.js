const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const prisma = new PrismaClient();

/**
 * 주문 생성
 */
async function createOrder(orderData) {
  const { 
    userId, 
    cartId, 
    email, 
    phone,
    recipientName, 
    recipientPhone, 
    postalCode, 
    address1, 
    address2, 
    notes, 
    paymentMethod,
    guestPassword // 비회원 주문 시 사용
  } = orderData;
  
  // 장바구니 조회
  const cart = await prisma.cart.findUnique({
    where: { id: Number(cartId) },
    include: {
      items: {
        include: {
          productVariant: {
            include: {
              product: true,
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
  
  if (!cart || cart.items.length === 0) {
    throw new Error('장바구니가 비어있습니다.');
  }
  
  // 상품 재고 확인
  for (const item of cart.items) {
    if (item.quantity > item.productVariant.stock) {
      throw new Error(`${item.productVariant.product.name}의 재고가 부족합니다.`);
    }
  }
  
  // 주문 번호 생성
  const orderNumber = generateOrderNumber();
  
  // 주문 금액 계산
  const orderItems = cart.items.map(item => {
    const variant = item.productVariant;
    const product = variant.product;
    const price = variant.price || product.price;
    const salePrice = variant.salePrice || product.salePrice || price;
    
    // 변형 정보 저장
    const variantInfo = {
      options: variant.options.map(opt => ({
        type: opt.optionValue.optionType.name,
        value: opt.optionValue.value
      })),
      sku: variant.sku
    };
    
    return {
      productVariantId: variant.id,
      productId: product.id,
      productName: product.name,
      variantInfo,
      quantity: item.quantity,
      unitPrice: salePrice,
      totalPrice: salePrice * item.quantity
    };
  });
  
  const totalAmount = orderItems.reduce((sum, item) => sum + Number(item.totalPrice), 0);
  
  // 배송비 (실제 로직에 맞게 수정)
  const shippingFee = totalAmount >= 50000 ? 0 : 3000;
  
  // 비회원 비밀번호 해싱 (있을 경우)
  let hashedPassword = null;
  if (guestPassword) {
    hashedPassword = await bcrypt.hash(guestPassword, 10);
  }
  
  // 트랜잭션으로 주문 생성 및 관련 처리
  return await prisma.$transaction(async (tx) => {
    // 1. 주문 생성
    const order = await tx.order.create({
      data: {
        orderNumber,
        userId: userId ? Number(userId) : null,
        email,
        phone,
        recipientName,
        recipientPhone,
        postalCode,
        address1,
        address2,
        notes,
        totalAmount,
        shippingFee,
        paymentMethod,
        guestPassword: hashedPassword,
        items: {
          create: orderItems
        }
      },
      include: {
        items: true
      }
    });
    
    // 2. 상품 재고 감소
    for (const item of cart.items) {
      await tx.productVariant.update({
        where: { id: item.productVariantId },
        data: {
          stock: {
            decrement: item.quantity
          }
        }
      });
    }
    
    // 3. 장바구니 비우기
    await tx.cartItem.deleteMany({
      where: { cartId }
    });
    
    return order;
  });
}

/**
 * 주문 번호 생성
 */
function generateOrderNumber() {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;
  
  // 랜덤 6자리 숫자
  const randomNum = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  
  return `${dateStr}-${randomNum}`;
}

/**
 * 주문 조회
 */
async function getOrderById(id) {
  return await prisma.order.findUnique({
    where: { id: Number(id) },
    include: {
      items: true,
      payments: true
    }
  });
}

/**
 * 주문 번호로 조회
 */
async function getOrderByNumber(orderNumber) {
  return await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: true,
      payments: true
    }
  });
}

/**
 * 비회원 주문 조회
 */
async function getGuestOrder(orderNumber, password) {
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: true,
      payments: true
    }
  });
  
  if (!order) {
    throw new Error('주문을 찾을 수 없습니다.');
  }
  
  if (!order.guestPassword) {
    throw new Error('비회원 주문이 아닙니다.');
  }
  
  const isPasswordValid = await bcrypt.compare(password, order.guestPassword);
  
  if (!isPasswordValid) {
    throw new Error('비밀번호가 일치하지 않습니다.');
  }
  
  return order;
}

/**
 * 사용자 주문 목록 조회
 */
async function getUserOrders(userId, options = {}) {
  const { page = 1, limit = 10, status } = options;
  const skip = (page - 1) * limit;
  
  const where = { userId: Number(userId) };
  
  // 주문 상태 필터링
  if (status) {
    where.status = status;
  }
  
  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        items: {
          select: {
            id: true,
            productName: true,
            variantInfo: true,
            quantity: true,
            unitPrice: true,
            totalPrice: true
          }
        },
        payments: {
          select: {
            id: true,
            amount: true,
            provider: true,
            status: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: Number(limit)
    }),
    prisma.order.count({ where })
  ]);
  
  return {
    orders,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit)
    }
  };
}

/**
 * 주문 상태 업데이트
 */
async function updateOrderStatus(orderId, status) {
  return await prisma.order.update({
    where: { id: Number(orderId) },
    data: { status }
  });
}

/**
 * 결제 생성
 */
async function createPayment(paymentData) {
  const { 
    orderId, 
    amount, 
    provider, 
    paymentKey, 
    paymentData: paymentDetails, 
    status 
  } = paymentData;
  
  // 주문 조회
  const order = await prisma.order.findUnique({
    where: { id: Number(orderId) }
  });
  
  if (!order) {
    throw new Error('주문을 찾을 수 없습니다.');
  }
  
  // 결제 금액과 주문 금액 검증
  if (Number(amount) !== Number(order.totalAmount) + Number(order.shippingFee) - Number(order.discountAmount)) {
    throw new Error('결제 금액이 일치하지 않습니다.');
  }
  
  // 트랜잭션으로 결제 처리
  return await prisma.$transaction(async (tx) => {
    // 결제 생성
    const payment = await tx.payment.create({
      data: {
        orderId: Number(orderId),
        amount,
        provider,
        paymentKey,
        paymentData: paymentDetails,
        status
      }
    });
    
    // 결제 상태에 따라 주문 상태 업데이트
    if (status === 'completed') {
      await tx.order.update({
        where: { id: Number(orderId) },
        data: {
          paymentStatus: 'paid',
          status: 'processing'
        }
      });
    } else if (status === 'failed') {
      await tx.order.update({
        where: { id: Number(orderId) },
        data: {
          paymentStatus: 'failed'
        }
      });
    }
    
    return payment;
  });
}

/**
 * 주문 취소
 */
async function cancelOrder(orderId) {
  const order = await prisma.order.findUnique({
    where: { id: Number(orderId) },
    include: {
      items: {
        include: {
          productVariant: true
        }
      },
      payments: true
    }
  });
  
  if (!order) {
    throw new Error('주문을 찾을 수 없습니다.');
  }
  
  if (order.status !== 'pending' && order.status !== 'processing') {
    throw new Error('이미 처리된 주문은 취소할 수 없습니다.');
  }
  
  if (order.paymentStatus === 'paid') {
    // 결제된 주문은 환불 처리 필요
    // 실제 환불 처리 로직은 결제 서비스와 연동 필요
    throw new Error('이미 결제된 주문은 고객센터를 통해 취소해주세요.');
  }
  
  // 트랜잭션으로 취소 처리
  return await prisma.$transaction(async (tx) => {
    // 1. 주문 상태 업데이트
    await tx.order.update({
      where: { id: Number(orderId) },
      data: {
        status: 'cancelled'
      }
    });
    
    // 2. 상품 재고 복원
    for (const item of order.items) {
      if (item.productVariant) {
        await tx.productVariant.update({
          where: { id: item.productVariant.id },
          data: {
            stock: {
              increment: item.quantity
            }
          }
        });
      }
    }
    
    return order;
  });
}

module.exports = {
  createOrder,
  getOrderById,
  getOrderByNumber,
  getGuestOrder,
  getUserOrders,
  updateOrderStatus,
  createPayment,
  cancelOrder
};
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * 모든 사용자 조회
 */
async function getAllUsers(options = {}) {
  const { page = 1, limit = 10, search, role } = options;
  const skip = (page - 1) * limit;
  
  // 필터링 조건 구성
  let where = {};
  
  // 검색어 필터링
  if (search) {
    where.OR = [
      { email: { contains: search, mode: 'insensitive' } },
      { name: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search, mode: 'insensitive' } }
    ];
  }
  
  // 역할 필터링
  if (role) {
    where.role = role;
  }
  
  // 사용자 조회
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            orders: true
          }
        }
      },
      skip,
      take: Number(limit),
      orderBy: {
        createdAt: 'desc'
      }
    }),
    prisma.user.count({ where })
  ]);
  
  return {
    users: users.map(user => ({
      ...user,
      orderCount: user._count.orders
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
 * 사용자 상세 정보 조회
 */
async function getUserDetails(userId) {
  const user = await prisma.user.findUnique({
    where: { id: Number(userId) },
    include: {
      addresses: true,
      orders: {
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          items: true
        }
      },
      _count: {
        select: {
          orders: true
        }
      }
    }
  });
  
  if (!user) {
    throw new Error('사용자를 찾을 수 없습니다.');
  }
  
  // 민감한 정보 제외
  delete user.password;
  delete user.refreshToken;
  
  return {
    ...user,
    orderCount: user._count.orders
  };
}

/**
 * 사용자 역할 변경
 */
async function updateUserRole(userId, role) {
  // 유효한 역할인지 확인
  if (!['customer', 'admin'].includes(role)) {
    throw new Error('유효하지 않은 역할입니다.');
  }
  
  return await prisma.user.update({
    where: { id: Number(userId) },
    data: { role },
    select: {
      id: true,
      email: true,
      name: true,
      role: true
    }
  });
}

/**
 * 대시보드 통계 조회
 */
async function getDashboardStats() {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
  
  // 병렬로 각종 통계 조회
  const [
    totalUsers,
    newUsersToday,
    totalProducts,
    lowStockProducts,
    totalOrders,
    pendingOrders,
    totalSalesThisMonth,
    totalSalesLastMonth,
    recentOrders
  ] = await Promise.all([
    // 총 사용자 수
    prisma.user.count(),
    
    // 오늘 가입한 사용자 수
    prisma.user.count({
      where: {
        createdAt: { gte: startOfToday }
      }
    }),
    
    // 총 상품 수
    prisma.product.count({
      where: { isActive: true }
    }),
    
    // 재고 부족 상품 수
    prisma.productVariant.count({
      where: {
        isActive: true,
        stock: { lte: 5 }
      }
    }),
    
    // 총 주문 수
    prisma.order.count(),
    
    // 대기 중인 주문 수
    prisma.order.count({
      where: { status: 'pending' }
    }),
    
    // 이번 달 총 매출
    prisma.payment.aggregate({
      where: {
        status: 'completed',
        createdAt: { gte: startOfThisMonth }
      },
      _sum: { amount: true }
    }),
    
    // 지난 달 총 매출
    prisma.payment.aggregate({
      where: {
        status: 'completed',
        createdAt: {
          gte: startOfLastMonth,
          lt: endOfLastMonth
        }
      },
      _sum: { amount: true }
    }),
    
    // 최근 주문 5개
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        items: {
          select: {
            productName: true,
            quantity: true,
            totalPrice: true
          }
        },
        payments: {
          select: {
            status: true,
            amount: true
          }
        }
      }
    })
  ]);
  
  // 주간 매출 데이터 조회
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - 6); // 7일간의 데이터
  
  const dailySales = await prisma.$queryRaw`
    SELECT 
      DATE(p.created_at) as date,
      SUM(p.amount) as total
    FROM 
      payments p
    WHERE 
      p.status = 'completed'
      AND p.created_at >= ${startOfWeek}
    GROUP BY 
      DATE(p.created_at)
    ORDER BY 
      date ASC
  `;
  
  return {
    userStats: {
      totalUsers,
      newUsersToday
    },
    productStats: {
      totalProducts,
      lowStockProducts
    },
    orderStats: {
      totalOrders,
      pendingOrders
    },
    salesStats: {
      thisMonth: totalSalesThisMonth._sum.amount || 0,
      lastMonth: totalSalesLastMonth._sum.amount || 0,
      dailySales
    },
    recentOrders
  };
}

/**
 * 모든 주문 조회 (관리자용)
 */
async function getAllOrders(options = {}) {
  const { page = 1, limit = 10, status, search, fromDate, toDate } = options;
  const skip = (page - 1) * limit;
  
  // 필터링 조건 구성
  let where = {};
  
  // 주문 상태 필터링
  if (status) {
    where.status = status;
  }
  
  // 검색어 필터링 (주문번호, 사용자 이메일, 수령인 이름 등)
  if (search) {
    where.OR = [
      { orderNumber: { contains: search } },
      { email: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search } },
      { recipientName: { contains: search, mode: 'insensitive' } }
    ];
  }
  
  // 날짜 범위 필터링
  if (fromDate) {
    where.createdAt = { ...where.createdAt, gte: new Date(fromDate) };
  }
  
  if (toDate) {
    // toDate에 하루를 더해 해당 날짜의 23:59:59까지 포함
    const endDate = new Date(toDate);
    endDate.setDate(endDate.getDate() + 1);
    where.createdAt = { ...where.createdAt, lt: endDate };
  }
  
  // 주문 조회
  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        items: {
          select: {
            id: true,
            productName: true,
            quantity: true,
            totalPrice: true
          }
        },
        payments: {
          select: {
            id: true,
            status: true,
            amount: true,
            provider: true
          }
        }
      },
      skip,
      take: Number(limit),
      orderBy: {
        createdAt: 'desc'
      }
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
 * 주문 상태 및 배송 정보 업데이트 (관리자용)
 */
async function updateOrderAdmin(orderId, updateData) {
  const { status, trackingNumber, shippedAt, notes } = updateData;
  
  const order = await prisma.order.findUnique({
    where: { id: Number(orderId) }
  });
  
  if (!order) {
    throw new Error('주문을 찾을 수 없습니다.');
  }
  
  // 주문 업데이트 데이터
  const updateOrderData = {};
  
  // 상태 업데이트
  if (status) {
    updateOrderData.status = status;
    
    // 배송 완료 상태로 변경될 때 배송 완료 시간 자동 설정
    if (status === 'completed' && !updateData.deliveredAt) {
      updateOrderData.deliveredAt = new Date();
    }
  }
  
  // 운송장 번호 업데이트
  if (trackingNumber !== undefined) {
    updateOrderData.trackingNumber = trackingNumber;
  }
  
  // 배송 시작 일시 업데이트
  if (shippedAt) {
    updateOrderData.shippedAt = new Date(shippedAt);
  }
  
  // 주문 메모 업데이트
  if (notes !== undefined) {
    updateOrderData.notes = notes;
  }
  
  // 주문 업데이트
  return await prisma.order.update({
    where: { id: Number(orderId) },
    data: updateOrderData,
    include: {
      items: true,
      payments: true
    }
  });
}

/**
 * 품절 상품 목록 조회
 */
async function getOutOfStockProducts() {
  return await prisma.productVariant.findMany({
    where: {
      isActive: true,
      stock: 0
    },
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
  });
}

/**
 * 제품 재고 업데이트
 */
async function updateProductStock(variantId, stock) {
  if (stock < 0) {
    throw new Error('재고는 0 이상이어야 합니다.');
  }
  
  return await prisma.productVariant.update({
    where: { id: Number(variantId) },
    data: { stock: Number(stock) },
    include: {
      product: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });
}

module.exports = {
  getAllUsers,
  getUserDetails,
  updateUserRole,
  getDashboardStats,
  getAllOrders,
  updateOrderAdmin,
  getOutOfStockProducts,
  updateProductStock
};
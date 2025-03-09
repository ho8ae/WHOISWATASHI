const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * 모든 상품 조회
 */
async function getAllProducts(options = {}) {
  const { 
    page = 1, 
    limit = 10, 
    categoryId,
    search,
    minPrice,
    maxPrice,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = options;

  const skip = (page - 1) * limit;
  
  // 필터링 조건 구성
  let where = { isActive: true };
  
  // 카테고리 필터링
  if (categoryId) {
    where.categories = {
      some: {
        categoryId: Number(categoryId)
      }
    };
  }
  
  // 검색어 필터링
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ];
  }
  
  // 가격 범위 필터링
  if (minPrice !== undefined) {
    where.price = { ...where.price, gte: Number(minPrice) };
  }
  
  if (maxPrice !== undefined) {
    where.price = { ...where.price, lte: Number(maxPrice) };
  }
  
  // 정렬 설정
  const orderBy = {};
  orderBy[sortBy] = sortOrder;
  
  // 상품 조회
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: {
          where: { isPrimary: true },
          take: 1
        },
        categories: {
          include: {
            category: true
          }
        }
      },
      skip,
      take: Number(limit),
      orderBy
    }),
    prisma.product.count({ where })
  ]);

  // 응답 데이터 포맷팅
  const formattedProducts = products.map(product => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    salePrice: product.salePrice,
    primaryImage: product.images[0]?.imageUrl || null,
    categories: product.categories.map(pc => ({
      id: pc.category.id,
      name: pc.category.name,
      slug: pc.category.slug
    }))
  }));
  
  return {
    products: formattedProducts,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit)
    }
  };
}

/**
 * ID로 상품 상세 조회
 */
async function getProductById(id) {
  return await prisma.product.findUnique({
    where: { id: Number(id) },
    include: {
      images: {
        orderBy: {
          displayOrder: 'asc'
        }
      },
      categories: {
        include: {
          category: true
        }
      }
    }
  });
}

/**
 * Slug로 상품 상세 조회
 */
async function getProductBySlug(slug) {
  return await prisma.product.findUnique({
    where: { slug },
    include: {
      images: {
        orderBy: {
          displayOrder: 'asc'
        }
      },
      categories: {
        include: {
          category: true
        }
      }
    }
  });
}

/**
 * 상품 생성
 */
async function createProduct(productData) {
  const { categories = [], images = [], ...data } = productData;
  
  return await prisma.$transaction(async (tx) => {
    // 1. 상품 생성
    const product = await tx.product.create({
      data
    });
    
    // 2. 카테고리 연결
    if (categories.length > 0) {
      await tx.productCategory.createMany({
        data: categories.map(categoryId => ({
          productId: product.id,
          categoryId: Number(categoryId)
        }))
      });
    }
    
    // 3. 이미지 생성
    if (images.length > 0) {
      await tx.productImage.createMany({
        data: images.map((image, index) => ({
          productId: product.id,
          imageUrl: image.imageUrl,
          altText: image.altText || product.name,
          isPrimary: index === 0, // 첫 번째 이미지를 대표 이미지로 설정
          displayOrder: index
        }))
      });
    }
    
    // 4. 생성된 상품 조회 (관계 데이터 포함)
    return await tx.product.findUnique({
      where: { id: product.id },
      include: {
        images: true,
        categories: {
          include: {
            category: true
          }
        }
      }
    });
  });
}

/**
 * 상품 수정
 */
async function updateProduct(id, productData) {
  const { categories, images, ...data } = productData;
  
  return await prisma.$transaction(async (tx) => {
    // 1. 상품 기본 정보 업데이트
    const product = await tx.product.update({
      where: { id: Number(id) },
      data
    });
    
    // 2. 카테고리 업데이트 (있는 경우)
    if (categories) {
      // 기존 카테고리 연결 삭제
      await tx.productCategory.deleteMany({
        where: { productId: product.id }
      });
      
      // 새 카테고리 연결 생성
      if (categories.length > 0) {
        await tx.productCategory.createMany({
          data: categories.map(categoryId => ({
            productId: product.id,
            categoryId: Number(categoryId)
          }))
        });
      }
    }
    
    // 3. 이미지 업데이트 (있는 경우)
    if (images) {
      // 기존 이미지 삭제
      await tx.productImage.deleteMany({
        where: { productId: product.id }
      });
      
      // 새 이미지 생성
      if (images.length > 0) {
        await tx.productImage.createMany({
          data: images.map((image, index) => ({
            productId: product.id,
            imageUrl: image.imageUrl,
            altText: image.altText || product.name,
            isPrimary: index === 0,
            displayOrder: index
          }))
        });
      }
    }
    
    // 4. 업데이트된 상품 조회
    return await tx.product.findUnique({
      where: { id: product.id },
      include: {
        images: {
          orderBy: {
            displayOrder: 'asc'
          }
        },
        categories: {
          include: {
            category: true
          }
        }
      }
    });
  });
}

/**
 * 상품 삭제 (소프트 삭제)
 */
async function deleteProduct(id) {
  return await prisma.product.update({
    where: { id: Number(id) },
    data: { isActive: false }
  });
}

/**
 * 카테고리별 상품 조회
 */
async function getProductsByCategory(categoryId, options = {}) {
  const { 
    page = 1, 
    limit = 10, 
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = options;

  const skip = (page - 1) * limit;
  
  // 카테고리 및 하위 카테고리 ID 가져오기
  const categoryIds = await getCategoryAndSubcategoryIds(Number(categoryId));
  
  // 조회 조건
  const where = {
    isActive: true,
    categories: {
      some: {
        categoryId: {
          in: categoryIds
        }
      }
    }
  };
  
  // 정렬 설정
  const orderBy = {};
  orderBy[sortBy] = sortOrder;
  
  // 상품 조회
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: {
          where: { isPrimary: true },
          take: 1
        },
        categories: {
          include: {
            category: true
          }
        }
      },
      skip,
      take: Number(limit),
      orderBy
    }),
    prisma.product.count({ where })
  ]);

  // 응답 데이터 포맷팅
  const formattedProducts = products.map(product => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    salePrice: product.salePrice,
    primaryImage: product.images[0]?.imageUrl || null,
    categories: product.categories.map(pc => ({
      id: pc.category.id,
      name: pc.category.name,
      slug: pc.category.slug
    }))
  }));
  
  return {
    products: formattedProducts,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit)
    }
  };
}

/**
 * 카테고리 및 하위 카테고리 ID 가져오기
 */
async function getCategoryAndSubcategoryIds(categoryId) {
  // 지정된 카테고리 ID 추가
  const categoryIds = [categoryId];
  
  // 하위 카테고리 가져오기
  const subcategories = await prisma.category.findMany({
    where: { parentId: categoryId }
  });
  
  // 재귀적으로 하위 카테고리 ID 수집
  for (const subcategory of subcategories) {
    const subcategoryIds = await getCategoryAndSubcategoryIds(subcategory.id);
    categoryIds.push(...subcategoryIds);
  }
  
  return categoryIds;
}

module.exports = {
  getAllProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory
};
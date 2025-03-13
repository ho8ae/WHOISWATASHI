const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * 상품 검색 및 필터링
 */
async function searchProducts(searchParams) {
  const { 
    keyword, 
    categoryId, 
    minPrice, 
    maxPrice, 
    attributes = {},
    sortBy = 'relevance', 
    sortOrder = 'desc',
    page = 1, 
    limit = 20 
  } = searchParams;
  
  const skip = (page - 1) * limit;
  
  // 기본 검색 조건
  let where = { isActive: true };
  
  // 키워드 검색
  if (keyword) {
    where.OR = [
      { name: { contains: keyword, mode: 'insensitive' } },
      { description: { contains: keyword, mode: 'insensitive' } },
      { metaTitle: { contains: keyword, mode: 'insensitive' } },
      { metaDescription: { contains: keyword, mode: 'insensitive' } }
    ];
  }
  
  // 카테고리 필터링
  if (categoryId) {
    const categoryIds = await getCategoryAndSubcategoryIds(Number(categoryId));
    where.categories = {
      some: {
        categoryId: {
          in: categoryIds
        }
      }
    };
  }
  
  // 가격 범위 필터링
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.OR = [
      // 일반 가격
      {
        price: {
          ...(minPrice !== undefined && { gte: Number(minPrice) }),
          ...(maxPrice !== undefined && { lte: Number(maxPrice) })
        },
        salePrice: null
      },
      // 할인 가격
      {
        salePrice: {
          ...(minPrice !== undefined && { gte: Number(minPrice) }),
          ...(maxPrice !== undefined && { lte: Number(maxPrice) })
        }
      }
    ];
  }
  
  // 속성 필터링 (상품 변형에 기반한 필터링)
  const variantWhereConditions = [];
  
  // 속성 필터 객체를 순회하며 조건 추가
  Object.entries(attributes).forEach(([attrType, values]) => {
    if (Array.isArray(values) && values.length > 0) {
      variantWhereConditions.push({
        variants: {
          some: {
            options: {
              some: {
                optionValue: {
                  optionType: {
                    name: attrType
                  },
                  value: {
                    in: values
                  }
                }
              }
            }
          }
        }
      });
    }
  });
  
  // 속성 필터 조건을 where 절에 추가
  if (variantWhereConditions.length > 0) {
    where.AND = variantWhereConditions;
  }
  
  // 정렬 설정
  let orderBy = {};
  
  switch (sortBy) {
    case 'price':
      // 가격 정렬 (할인 가격 있으면 할인 가격, 없으면 원래 가격)
      orderBy = {
        salePrice: { sort: sortOrder, nulls: 'last' }
      };
      break;
    case 'name':
      orderBy = { name: sortOrder };
      break;
    case 'newest':
      orderBy = { createdAt: sortOrder };
      break;
    case 'popularity':
      // 인기도 정렬 (판매량 또는 조회수 기준, 필요 시 구현)
      orderBy = { isFeatured: 'desc' }; // 임시로 featured 상품 우선
      break;
    case 'relevance':
    default:
      // 관련성 정렬 (키워드 검색 시 유용)
      if (keyword) {
        // 이름에 키워드가 포함된 상품 우선
        orderBy = { name: { similarity: keyword, sort: 'desc' } };
      } else {
        // 기본은 최신순
        orderBy = { createdAt: 'desc' };
      }
      break;
  }
  
  // 상품 조회 및 총 개수 계산
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
            category: {
              select: {
                id: true,
                name: true,
                slug: true
              }
            }
          }
        },
        variants: {
          take: 1,
          include: {
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
      },
      orderBy,
      skip,
      take: Number(limit)
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
    description: product.description,
    image: product.images[0]?.imageUrl || null,
    categories: product.categories.map(pc => ({
      id: pc.category.id,
      name: pc.category.name,
      slug: pc.category.slug
    })),
    hasVariants: product.variants.length > 0
  }));
  
  // 검색 필터 옵션 가져오기
  const filterOptions = await getFilterOptions(where);
  
  return {
    products: formattedProducts,
    filters: filterOptions,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit)
    }
  };
}

/**
 * 검색어 자동완성 제안
 */
async function getSearchSuggestions(keyword, limit = 10) {
  if (!keyword || keyword.length < 2) {
    return [];
  }
  
  // 상품명 및 설명에서 검색어를 포함하는 상품 조회
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      OR: [
        { name: { contains: keyword, mode: 'insensitive' } },
        { description: { contains: keyword, mode: 'insensitive' } }
      ]
    },
    select: {
      name: true,
      slug: true
    },
    orderBy: {
      name: 'asc'
    },
    take: Number(limit)
  });
  
  // 카테고리 이름에서 검색어를 포함하는 카테고리 조회
  const categories = await prisma.category.findMany({
    where: {
      isActive: true,
      name: { contains: keyword, mode: 'insensitive' }
    },
    select: {
      name: true,
      slug: true
    },
    orderBy: {
      name: 'asc'
    },
    take: 5 // 카테고리는 적은 수만 추천
  });
  
  // 상품명 기반 제안
  const productSuggestions = products.map(product => ({
    type: 'product',
    name: product.name,
    slug: product.slug
  }));
  
  // 카테고리 기반 제안
  const categorySuggestions = categories.map(category => ({
    type: 'category',
    name: category.name,
    slug: category.slug
  }));
  
  // 제안 결합 및 제한
  return [...productSuggestions, ...categorySuggestions].slice(0, Number(limit));
}

/**
 * 인기 검색어 목록
 */
async function getPopularSearchTerms(limit = 10) {
  // 실제 구현 시, 검색 이력을 저장하는 테이블이 필요함
  // 여기서는 더미 데이터 반환
  return [
    { term: '티셔츠', count: 120 },
    { term: '청바지', count: 98 },
    { term: '원피스', count: 87 },
    { term: '자켓', count: 65 },
    { term: '스니커즈', count: 52 }
  ].slice(0, Number(limit));
}

/**
 * 특정 검색에 대한 필터 옵션 가져오기
 */
async function getFilterOptions(baseWhere) {
  // 카테고리 옵션
  const categories = await prisma.category.findMany({
    where: {
      isActive: true,
      products: {
        some: {
            product: baseWhere
        }
      }
    },
    select: {
      id: true,
      name: true,
      slug: true,
      _count: {
        select: {
          products: true
        }
      }
    },
    orderBy: {
      displayOrder: 'asc'
    }
  });
  
  // 가격 범위 계산
  const priceStats = await prisma.product.aggregate({
    where: baseWhere,
    _min: {
      price: true,
      salePrice: true
    },
    _max: {
      price: true,
      salePrice: true
    }
  });
  
  // 최소/최대 가격 결정 (할인 가격과 원래 가격 중 더 낮은/높은 값)
  const minPrice = Math.min(
    priceStats._min.price || Infinity,
    priceStats._min.salePrice || Infinity
  );
  
  const maxPrice = Math.max(
    priceStats._max.price || 0,
    priceStats._max.salePrice || 0
  );
  
  // 속성 옵션 (색상, 사이즈 등)
  const optionTypes = await prisma.optionType.findMany({
    include: {
      values: {
        where: {
          variants: {
            some: {
              variant: {
                product: {
                  is: baseWhere
                }
              }
            }
          }
        }
      }
    }
  });
  
  // 속성 옵션 포맷팅
  const attributes = optionTypes.map(type => ({
    name: type.name,
    values: type.values.map(value => ({
      id: value.id,
      value: value.value
    }))
  })).filter(type => type.values.length > 0);
  
  return {
    categories: categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      count: cat._count.products
    })),
    price: {
      min: minPrice === Infinity ? 0 : minPrice,
      max: maxPrice
    },
    attributes
  };
}

/**
 * 카테고리 및 모든 하위 카테고리 ID 가져오기
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
  searchProducts,
  getSearchSuggestions,
  getPopularSearchTerms
};
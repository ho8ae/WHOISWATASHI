/**
 * @swagger
 * tags:
 *   name: Products
 *   description: 상품 관리 API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductImage:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 이미지 ID
 *         productId:
 *           type: integer
 *           description: 상품 ID
 *         imageUrl:
 *           type: string
 *           description: 이미지 URL
 *         altText:
 *           type: string
 *           description: 대체 텍스트
 *         isPrimary:
 *           type: boolean
 *           description: 대표 이미지 여부
 *         displayOrder:
 *           type: integer
 *           description: 표시 순서
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 생성 일시
 *       example:
 *         id: 1
 *         productId: 1
 *         imageUrl: https://example.com/images/product1.jpg
 *         altText: 상품 이미지
 *         isPrimary: true
 *         displayOrder: 0
 *         createdAt: '2025-03-09T08:30:00.000Z'
 *     
 *     ProductCategory:
 *       type: object
 *       properties:
 *         productId:
 *           type: integer
 *           description: 상품 ID
 *         categoryId:
 *           type: integer
 *           description: 카테고리 ID
 *         category:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               description: 카테고리 ID
 *             name:
 *               type: string
 *               description: 카테고리 이름
 *             slug:
 *               type: string
 *               description: 카테고리 슬러그
 *             description:
 *               type: string
 *               description: 카테고리 설명
 *       example:
 *         productId: 1
 *         categoryId: 1
 *         category:
 *           id: 1
 *           name: 패션의류
 *           slug: clothing
 *           description: 다양한 스타일의 패션 의류 제품
 *     
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - slug
 *         - price
 *       properties:
 *         id:
 *           type: integer
 *           description: 상품 ID
 *         name:
 *           type: string
 *           description: 상품명
 *         slug:
 *           type: string
 *           description: 상품 슬러그
 *         description:
 *           type: string
 *           description: 상품 설명
 *         price:
 *           type: number
 *           format: decimal
 *           description: 가격
 *         salePrice:
 *           type: number
 *           format: decimal
 *           description: 할인 가격
 *           nullable: true
 *         stock:
 *           type: integer
 *           description: 재고 수량
 *         sku:
 *           type: string
 *           description: 제품 고유 코드
 *           nullable: true
 *         isActive:
 *           type: boolean
 *           description: 활성화 여부
 *         isFeatured:
 *           type: boolean
 *           description: 특별 상품 여부
 *         metaTitle:
 *           type: string
 *           description: SEO 메타 제목
 *           nullable: true
 *         metaDescription:
 *           type: string
 *           description: SEO 메타 설명
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 생성 일시
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: 수정 일시
 *         images:
 *           type: array
 *           description: 상품 이미지 목록
 *           items:
 *             $ref: '#/components/schemas/ProductImage'
 *         categories:
 *           type: array
 *           description: 상품 카테고리 목록
 *           items:
 *             $ref: '#/components/schemas/ProductCategory'
 *       example:
 *         id: 1
 *         name: 프리미엄 티셔츠
 *         slug: premium-tshirt
 *         description: 고품질 면 100% 프리미엄 티셔츠입니다.
 *         price: 29900
 *         salePrice: 24900
 *         stock: 100
 *         sku: TS-001
 *         isActive: true
 *         isFeatured: true
 *         metaTitle: 프리미엄 티셔츠 | 쇼핑몰
 *         metaDescription: 고품질 면 100% 프리미엄 티셔츠를 구매하세요.
 *         createdAt: '2025-03-09T08:30:00.000Z'
 *         updatedAt: '2025-03-09T08:30:00.000Z'
 *     
 *     ProductSummary:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 상품 ID
 *         name:
 *           type: string
 *           description: 상품명
 *         slug:
 *           type: string
 *           description: 상품 슬러그
 *         price:
 *           type: number
 *           format: decimal
 *           description: 가격
 *         salePrice:
 *           type: number
 *           format: decimal
 *           description: 할인 가격
 *           nullable: true
 *         primaryImage:
 *           type: string
 *           description: 대표 이미지 URL
 *           nullable: true
 *         categories:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *       example:
 *         id: 1
 *         name: 프리미엄 티셔츠
 *         slug: premium-tshirt
 *         price: 29900
 *         salePrice: 24900
 *         primaryImage: https://example.com/images/product1.jpg
 *         categories:
 *           - id: 1
 *             name: 패션의류
 *             slug: clothing
 *     
 *     ProductsResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductSummary'
 *         pagination:
 *           type: object
 *           properties:
 *             total:
 *               type: integer
 *               description: 전체 상품 수
 *               example: 100
 *             page:
 *               type: integer
 *               description: 현재 페이지
 *               example: 1
 *             limit:
 *               type: integer
 *               description: 페이지당 항목 수
 *               example: 10
 *             totalPages:
 *               type: integer
 *               description: 전체 페이지 수
 *               example: 10
 *     
 *     ProductResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/Product'
 *     
 *     ProductCreateInput:
 *       type: object
 *       required:
 *         - name
 *         - slug
 *         - price
 *       properties:
 *         name:
 *           type: string
 *           description: 상품명
 *           example: 남성용 캐주얼 셔츠
 *         slug:
 *           type: string
 *           description: 상품 슬러그
 *           example: mens-casual-shirt
 *         description:
 *           type: string
 *           description: 상품 설명
 *           example: 편안한 착용감의 남성용 캐주얼 셔츠입니다.
 *         price:
 *           type: number
 *           description: 가격
 *           example: 39900
 *         salePrice:
 *           type: number
 *           description: 할인 가격
 *           example: 29900
 *         stock:
 *           type: integer
 *           description: 재고 수량
 *           example: 50
 *         sku:
 *           type: string
 *           description: 제품 고유 코드
 *           example: MS-001
 *         isActive:
 *           type: boolean
 *           description: 활성화 여부
 *           example: true
 *         isFeatured:
 *           type: boolean
 *           description: 특별 상품 여부
 *           example: false
 *         metaTitle:
 *           type: string
 *           description: SEO 메타 제목
 *           example: 남성용 캐주얼 셔츠 | 쇼핑몰
 *         metaDescription:
 *           type: string
 *           description: SEO 메타 설명
 *           example: 편안한 착용감의 남성용 캐주얼 셔츠를 구매하세요.
 *         categories:
 *           type: array
 *           description: 카테고리 ID 목록
 *           items:
 *             type: integer
 *           example: [1]
 *         images:
 *           type: array
 *           description: 상품 이미지 목록
 *           items:
 *             type: object
 *             properties:
 *               imageUrl:
 *                 type: string
 *                 description: 이미지 URL
 *               altText:
 *                 type: string
 *                 description: 대체 텍스트
 *           example:
 *             - imageUrl: https://example.com/images/shirt1.jpg
 *               altText: 셔츠 앞면
 *             - imageUrl: https://example.com/images/shirt2.jpg
 *               altText: 셔츠 상세
 *     
 *     ProductUpdateInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: 상품명
 *           example: 업데이트된 남성용 셔츠
 *         description:
 *           type: string
 *           description: 상품 설명
 *           example: 업데이트된 상품 설명입니다.
 *         price:
 *           type: number
 *           description: 가격
 *           example: 45000
 *         salePrice:
 *           type: number
 *           description: 할인 가격
 *           example: 38000
 *         stock:
 *           type: integer
 *           description: 재고 수량
 *           example: 75
 *         isActive:
 *           type: boolean
 *           description: 활성화 여부
 *           example: true
 *         isFeatured:
 *           type: boolean
 *           description: 특별 상품 여부
 *           example: true
 *         categories:
 *           type: array
 *           description: 카테고리 ID 목록
 *           items:
 *             type: integer
 *           example: [1, 2]
 *         images:
 *           type: array
 *           description: 상품 이미지 목록
 *           items:
 *             type: object
 *             properties:
 *               imageUrl:
 *                 type: string
 *                 description: 이미지 URL
 *               altText:
 *                 type: string
 *                 description: 대체 텍스트
 *           example:
 *             - imageUrl: https://example.com/images/updated-image1.jpg
 *               altText: 수정된 이미지 1
 *             - imageUrl: https://example.com/images/updated-image2.jpg
 *               altText: 수정된 이미지 2
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: 모든 상품 조회
 *     description: 상품 목록을 조회합니다. 다양한 필터링, 검색, 정렬 옵션을 제공합니다.
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 페이지 번호
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 페이지당 항목 수
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *         description: 카테고리 ID로 필터링
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: 상품명 또는 설명으로 검색
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: 최소 가격
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: 최대 가격
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, price, name]
 *           default: createdAt
 *         description: 정렬 기준
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: 정렬 순서
 *     responses:
 *       200:
 *         description: 상품 목록 반환 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductsResponse'
 *   post:
 *     summary: 상품 생성
 *     description: 새로운 상품을 생성합니다. 관리자 권한이 필요합니다.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductCreateInput'
 *     responses:
 *       201:
 *         description: 상품 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *                 message:
 *                   type: string
 *                   example: 상품이 성공적으로 생성되었습니다.
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: 인증 실패
 */

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: ID로 상품 조회
 *     description: 상품 ID로 상세 정보를 조회합니다.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 상품 ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 상품 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       404:
 *         description: 상품을 찾을 수 없음
 *   put:
 *     summary: 상품 수정
 *     description: 기존 상품 정보를 수정합니다. 관리자 권한이 필요합니다.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 상품 ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductUpdateInput'
 *     responses:
 *       200:
 *         description: 상품 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *                 message:
 *                   type: string
 *                   example: 상품이 성공적으로 수정되었습니다.
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 상품을 찾을 수 없음
 *   delete:
 *     summary: 상품 삭제
 *     description: 상품을 삭제합니다(소프트 삭제). 관리자 권한이 필요합니다.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 상품 ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 상품 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 상품이 성공적으로 삭제되었습니다.
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 상품을 찾을 수 없음
 */

/**
 * @swagger
 * /api/products/slug/{slug}:
 *   get:
 *     summary: Slug로 상품 조회
 *     description: 상품 슬러그로 상세 정보를 조회합니다.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         description: 상품 슬러그
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 상품 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       404:
 *         description: 상품을 찾을 수 없음
 */

/**
 * @swagger
 * /api/products/category/{categoryId}:
 *   get:
 *     summary: 카테고리별 상품 조회
 *     description: 특정 카테고리에 속한 상품 목록을 조회합니다. 해당 카테고리의 모든 하위 카테고리에 속한 상품도 포함됩니다.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         description: 카테고리 ID
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 페이지 번호
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 페이지당 항목 수
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, price, name]
 *           default: createdAt
 *         description: 정렬 기준
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: 정렬 순서
 *     responses:
 *       200:
 *         description: 카테고리별 상품 목록 반환 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductsResponse'
 *       404:
 *         description: 카테고리를 찾을 수 없음
 */
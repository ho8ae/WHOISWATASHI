/**
 * @swagger
 * tags:
 *   name: Search
 *   description: 상품 검색 및 필터링 API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SearchProduct:
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
 *         description:
 *           type: string
 *           description: 상품 설명
 *           nullable: true
 *         image:
 *           type: string
 *           description: 상품 이미지 URL
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
 *         hasVariants:
 *           type: boolean
 *           description: 변형 상품 존재 여부
 *       example:
 *         id: 1
 *         name: 프리미엄 티셔츠
 *         slug: premium-tshirt
 *         price: 35000
 *         salePrice: 29500
 *         description: 고품질 면 100% 소재의 티셔츠입니다.
 *         image: https://example.com/images/products/tshirt.jpg
 *         categories:
 *           - id: 1
 *             name: 의류
 *             slug: clothing
 *           - id: 2
 *             name: 티셔츠
 *             slug: t-shirts
 *         hasVariants: true
 *
 *     SearchFilter:
 *       type: object
 *       properties:
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
 *               count:
 *                 type: integer
 *         price:
 *           type: object
 *           properties:
 *             min:
 *               type: number
 *             max:
 *               type: number
 *         attributes:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               values:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     value:
 *                       type: string
 *       example:
 *         categories:
 *           - id: 1
 *             name: 의류
 *             slug: clothing
 *             count: 120
 *           - id: 2
 *             name: 신발
 *             slug: shoes
 *             count: 45
 *         price:
 *           min: 5000
 *           max: 150000
 *         attributes:
 *           - name: 색상
 *             values:
 *               - id: 1
 *                 value: 블랙
 *               - id: 2
 *                 value: 화이트
 *           - name: 사이즈
 *             values:
 *               - id: 3
 *                 value: S
 *               - id: 4
 *                 value: M
 *               - id: 5
 *                 value: L
 *
 *     SearchSuggestion:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           enum: [product, category]
 *           description: 제안 유형
 *         name:
 *           type: string
 *           description: 제안 텍스트
 *         slug:
 *           type: string
 *           description: 연결 슬러그
 *       example:
 *         type: product
 *         name: 프리미엄 티셔츠
 *         slug: premium-tshirt
 *
 *     PopularSearchTerm:
 *       type: object
 *       properties:
 *         term:
 *           type: string
 *           description: 검색어
 *         count:
 *           type: integer
 *           description: 검색 횟수
 *       example:
 *         term: 티셔츠
 *         count: 120
 *
 *     SearchResponse:
 *       type: object
 *       properties:
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SearchProduct'
 *         filters:
 *           $ref: '#/components/schemas/SearchFilter'
 *         pagination:
 *           type: object
 *           properties:
 *             total:
 *               type: integer
 *               description: 전체 결과 수
 *             page:
 *               type: integer
 *               description: 현재 페이지
 *             limit:
 *               type: integer
 *               description: 페이지당 항목 수
 *             totalPages:
 *               type: integer
 *               description: 전체 페이지 수
 */

/**
 * @swagger
 * /api/search/products:
 *   get:
 *     summary: 상품 검색 및 필터링
 *     description: 다양한 조건으로 상품을 검색하고 필터링합니다.
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: 검색어
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *         description: 카테고리 ID
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: integer
 *         description: 최소 가격
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: integer
 *         description: 최대 가격
 *       - in: query
 *         name: attributes[color]
 *         schema:
 *           type: string
 *         description: 색상 필터
 *         example: red,blue
 *       - in: query
 *         name: attributes[size]
 *         schema:
 *           type: string
 *         description: 사이즈 필터
 *         example: S,M,L
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [relevance, price, name, newest, popularity]
 *           default: relevance
 *         description: 정렬 기준
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: 정렬 순서
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
 *           default: 20
 *         description: 페이지당 항목 수
 *     responses:
 *       200:
 *         description: 검색 결과
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/SearchResponse'
 *       400:
 *         description: 잘못된 요청
 */

/**
 * @swagger
 * /api/search/suggestions:
 *   get:
 *     summary: 검색어 자동완성 제안
 *     description: 입력된 검색어에 기반하여 자동완성 제안을 제공합니다.
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         required: true
 *         schema:
 *           type: string
 *         description: 검색어 (최소 1자)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 제안 수
 *     responses:
 *       200:
 *         description: 제안 목록
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SearchSuggestion'
 *       400:
 *         description: 잘못된 요청
 */

/**
 * @swagger
 * /api/search/popular:
 *   get:
 *     summary: 인기 검색어 목록
 *     description: 가장 많이 검색된 검색어 목록을 제공합니다.
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 목록 수
 *     responses:
 *       200:
 *         description: 인기 검색어 목록
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PopularSearchTerm'
 */

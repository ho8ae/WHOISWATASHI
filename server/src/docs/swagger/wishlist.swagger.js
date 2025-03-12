/**
 * @swagger
 * tags:
 *   name: Wishlist
 *   description: 위시리스트(찜) 관리 API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     WishlistItem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 위시리스트 항목 ID
 *         productId:
 *           type: integer
 *           description: 상품 ID
 *         product:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               description: 상품 ID
 *             name:
 *               type: string
 *               description: 상품명
 *             slug:
 *               type: string
 *               description: 상품 슬러그
 *             price:
 *               type: number
 *               format: decimal
 *               description: 가격
 *             salePrice:
 *               type: number
 *               format: decimal
 *               description: 할인 가격
 *               nullable: true
 *             image:
 *               type: string
 *               description: 상품 이미지 URL
 *               nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 추가 일시
 *       example:
 *         id: 1
 *         productId: 1
 *         product:
 *           id: 1
 *           name: 프리미엄 티셔츠
 *           slug: premium-tshirt
 *           price: 35000
 *           salePrice: 29500
 *           image: https://example.com/images/tshirt.jpg
 *         createdAt: 2025-03-10T12:00:00Z
 *
 *     WishlistResponse:
 *       type: object
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/WishlistItem'
 *         pagination:
 *           type: object
 *           properties:
 *             total:
 *               type: integer
 *               description: 전체 항목 수
 *             page:
 *               type: integer
 *               description: 현재 페이지
 *             limit:
 *               type: integer
 *               description: 페이지당 항목 수
 *             totalPages:
 *               type: integer
 *               description: 전체 페이지 수
 *       example:
 *         items:
 *           - id: 1
 *             productId: 1
 *             product:
 *               id: 1
 *               name: 프리미엄 티셔츠
 *               slug: premium-tshirt
 *               price: 35000
 *               salePrice: 29500
 *               image: https://example.com/images/tshirt.jpg
 *             createdAt: 2025-03-10T12:00:00Z
 *         pagination:
 *           total: 5
 *           page: 1
 *           limit: 10
 *           totalPages: 1
 *
 *     AddToWishlistInput:
 *       type: object
 *       required:
 *         - productId
 *       properties:
 *         productId:
 *           type: integer
 *           description: 추가할 상품 ID
 *       example:
 *         productId: 1
 *
 *     WishlistCheckResponse:
 *       type: object
 *       properties:
 *         isInWishlist:
 *           type: boolean
 *           description: 위시리스트 포함 여부
 *       example:
 *         isInWishlist: true
 */

/**
 * @swagger
 * /api/wishlist:
 *   get:
 *     summary: 위시리스트 조회
 *     description: 현재 사용자의 위시리스트 항목을 조회합니다.
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
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
 *     responses:
 *       200:
 *         description: 위시리스트 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/WishlistResponse'
 *       401:
 *         description: 인증 실패
 *
 *   post:
 *     summary: 위시리스트에 상품 추가
 *     description: 위시리스트에 상품을 추가합니다.
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddToWishlistInput'
 *     responses:
 *       201:
 *         description: 위시리스트 추가 성공
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
 *                   example: 상품이 위시리스트에 추가되었습니다.
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 상품을 찾을 수 없음
 *
 *   delete:
 *     summary: 위시리스트 비우기
 *     description: 위시리스트의 모든 항목을 삭제합니다.
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 위시리스트 비우기 성공
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
 *                   example: 위시리스트가 비워졌습니다.
 *       401:
 *         description: 인증 실패
 */

/**
 * @swagger
 * /api/wishlist/check/{productId}:
 *   get:
 *     summary: 상품 위시리스트 여부 확인
 *     description: 특정 상품이 현재 사용자의 위시리스트에 있는지 확인합니다.
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 상품 ID
 *     responses:
 *       200:
 *         description: 확인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/WishlistCheckResponse'
 *       401:
 *         description: 인증 실패
 */

/**
 * @swagger
 * /api/wishlist/product/{productId}:
 *   delete:
 *     summary: 위시리스트에서 특정 상품 제거
 *     description: 현재 사용자의 위시리스트에서 특정 상품을 제거합니다.
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 상품 ID
 *     responses:
 *       200:
 *         description: 제거 성공
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
 *                   example: 상품이 위시리스트에서 제거되었습니다.
 *       401:
 *         description: 인증 실패
 */

/**
 * @swagger
 * /api/wishlist/{id}:
 *   delete:
 *     summary: 위시리스트 항목 삭제
 *     description: 특정 위시리스트 항목을 삭제합니다.
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 위시리스트 항목 ID
 *     responses:
 *       200:
 *         description: 삭제 성공
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
 *                   example: 위시리스트 항목이 삭제되었습니다.
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 위시리스트 항목을 찾을 수 없음
 */

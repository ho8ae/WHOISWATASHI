/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: 장바구니 관련 API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CartItem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 장바구니 아이템 ID
 *         productId:
 *           type: integer
 *           description: 상품 ID
 *         productName:
 *           type: string
 *           description: 상품명
 *         productSlug:
 *           type: string
 *           description: 상품 슬러그
 *         productImage:
 *           type: string
 *           description: 상품 이미지 URL
 *           nullable: true
 *         variantId:
 *           type: integer
 *           description: 상품 변형 ID
 *         options:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 description: 옵션 유형
 *                 example: 색상, 사이즈
 *               value:
 *                 type: string
 *                 description: 옵션 값
 *                 example: 블랙, L
 *         price:
 *           type: number
 *           format: decimal
 *           description: 상품 가격
 *         salePrice:
 *           type: number
 *           format: decimal
 *           description: 할인 가격
 *         quantity:
 *           type: integer
 *           description: 수량
 *         totalPrice:
 *           type: number
 *           format: decimal
 *           description: 총 가격(판매가격 × 수량)
 *         stock:
 *           type: integer
 *           description: 재고 수량
 *       example:
 *         id: 1
 *         productId: 101
 *         productName: 프리미엄 티셔츠
 *         productSlug: premium-tshirt
 *         productImage: https://example.com/images/products/tshirt.jpg
 *         variantId: 201
 *         options:
 *           - type: 색상
 *             value: 블랙
 *           - type: 사이즈
 *             value: L
 *         price: 35000
 *         salePrice: 32500
 *         quantity: 2
 *         totalPrice: 65000
 *         stock: 50
 *     
 *     Cart:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 장바구니 ID
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CartItem'
 *         itemCount:
 *           type: integer
 *           description: 장바구니 상품 개수
 *         subtotal:
 *           type: number
 *           format: decimal
 *           description: 장바구니 총액
 *       example:
 *         id: 1
 *         items:
 *           - id: 1
 *             productId: 101
 *             productName: 프리미엄 티셔츠
 *             productSlug: premium-tshirt
 *             productImage: https://example.com/images/products/tshirt.jpg
 *             variantId: 201
 *             options:
 *               - type: 색상
 *                 value: 블랙
 *               - type: 사이즈
 *                 value: L
 *             price: 35000
 *             salePrice: 32500
 *             quantity: 2
 *             totalPrice: 65000
 *             stock: 50
 *         itemCount: 1
 *         subtotal: 65000
 *     
 *     CartItemInput:
 *       type: object
 *       required:
 *         - productVariantId
 *         - quantity
 *       properties:
 *         productVariantId:
 *           type: integer
 *           description: 상품 변형 ID
 *         quantity:
 *           type: integer
 *           description: 수량
 *       example:
 *         productVariantId: 201
 *         quantity: 1
 *
 *     CartUpdateInput:
 *       type: object
 *       required:
 *         - quantity
 *       properties:
 *         quantity:
 *           type: integer
 *           description: 변경할 수량
 *       example:
 *         quantity: 3
 *
 *     CartResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/Cart'
 *         message:
 *           type: string
 *           example: 장바구니 조회 성공
 *
 *     Error:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: 에러 메시지
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: 장바구니 정보 조회
 *     description: 현재 사용자의 장바구니 정보를 조회합니다. 회원은 토큰, 비회원은 장바구니 세션 ID로 식별합니다.
 *     tags: [Cart]
 *     parameters:
 *       - in: cookie
 *         name: cartSessionId
 *         schema:
 *           type: string
 *         description: 비회원 장바구니 세션 ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 장바구니 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartResponse'
 *       400:
 *         description: 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /cart/add:
 *   post:
 *     summary: 장바구니에 상품 추가
 *     description: 장바구니에 상품을 추가합니다. 이미 동일한 상품이 있을 경우 수량을 증가시킵니다.
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CartItemInput'
 *     parameters:
 *       - in: cookie
 *         name: cartSessionId
 *         schema:
 *           type: string
 *         description: 비회원 장바구니 세션 ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 장바구니 추가 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *                 message:
 *                   type: string
 *                   example: 장바구니에 상품이 추가되었습니다.
 *       400:
 *         description: 재고 부족 또는 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /cart/items/{id}:
 *   put:
 *     summary: 장바구니 아이템 수량 변경
 *     description: 장바구니에 있는 상품의 수량을 변경합니다.
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 장바구니 아이템 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CartUpdateInput'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 수량 변경 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *                 message:
 *                   type: string
 *                   example: 장바구니가 업데이트되었습니다.
 *       400:
 *         description: 재고 부족 또는 잘못된 요청
 *       404:
 *         description: 장바구니 아이템을 찾을 수 없음
 *
 *   delete:
 *     summary: 장바구니 아이템 삭제
 *     description: 장바구니에서 특정 상품을 삭제합니다.
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 장바구니 아이템 ID
 *     security:
 *       - bearerAuth: []
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
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *                 message:
 *                   type: string
 *                   example: 장바구니에서 상품이 삭제되었습니다.
 *       404:
 *         description: 장바구니 아이템을 찾을 수 없음
 */

/**
 * @swagger
 * /cart/clear:
 *   delete:
 *     summary: 장바구니 비우기
 *     description: 장바구니의 모든 상품을 삭제합니다.
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 장바구니 비우기 성공
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
 *                   example: 장바구니가 비워졌습니다.
 */
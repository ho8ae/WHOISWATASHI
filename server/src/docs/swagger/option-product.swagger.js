/**
 * @swagger
 * tags:
 *   name: OptionTypes
 *   description: 상품 옵션 타입 관리 API
 */

/**
 * @swagger
 * tags:
 *   name: ProductVariants
 *   description: 상품 변형(옵션 조합) 관리 API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     OptionType:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 옵션 타입 ID
 *         name:
 *           type: string
 *           description: 옵션 타입 이름 (예: 사이즈, 색상)
 *         displayOrder:
 *           type: integer
 *           description: 표시 순서
 *         values:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OptionValue'
 *           description: 옵션 값 목록
 *       example:
 *         id: 1
 *         name: 사이즈
 *         displayOrder: 1
 *         values:
 *           - id: 1
 *             optionTypeId: 1
 *             value: S
 *             displayOrder: 1
 *           - id: 2
 *             optionTypeId: 1
 *             value: M
 *             displayOrder: 2
 *           - id: 3
 *             optionTypeId: 1
 *             value: L
 *             displayOrder: 3
 *     
 *     OptionValue:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 옵션 값 ID
 *         optionTypeId:
 *           type: integer
 *           description: 연결된 옵션 타입 ID
 *         value:
 *           type: string
 *           description: 옵션 값 (예: S, M, L, 빨강, 파랑)
 *         displayOrder:
 *           type: integer
 *           description: 표시 순서
 *       example:
 *         id: 1
 *         optionTypeId: 1
 *         value: S
 *         displayOrder: 1
 *     
 *     OptionTypeInput:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: 옵션 타입 이름
 *         displayOrder:
 *           type: integer
 *           description: 표시 순서
 *       example:
 *         name: 사이즈
 *         displayOrder: 1
 *     
 *     OptionValueInput:
 *       type: object
 *       required:
 *         - value
 *       properties:
 *         value:
 *           type: string
 *           description: 옵션 값
 *         displayOrder:
 *           type: integer
 *           description: 표시 순서
 *       example:
 *         value: S
 *         displayOrder: 1
 *     
 *     ProductVariant:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 변형 ID
 *         productId:
 *           type: integer
 *           description: 연결된 상품 ID
 *         sku:
 *           type: string
 *           description: 재고 관리 단위 (Stock Keeping Unit)
 *         price:
 *           type: number
 *           description: 가격
 *         salePrice:
 *           type: number
 *           description: 할인 가격
 *         stock:
 *           type: integer
 *           description: 재고 수량
 *         isActive:
 *           type: boolean
 *           description: 활성화 여부
 *         imageUrl:
 *           type: string
 *           description: 변형 이미지 URL
 *         options:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               optionValue:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   value:
 *                     type: string
 *                   optionType:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *       example:
 *         id: 1
 *         productId: 13
 *         sku: SHIRT-M-BLUE
 *         price: 39900
 *         salePrice: 29900
 *         stock: 10
 *         isActive: true
 *         imageUrl: https://example.com/images/shirt-m-blue.jpg
 *         options:
 *           - optionValue:
 *               id: 2
 *               value: M
 *               optionType:
 *                 id: 1
 *                 name: 사이즈
 *           - optionValue:
 *               id: 5
 *               value: 파랑
 *               optionType:
 *                 id: 2
 *                 name: 색상
 *     
 *     ProductVariantInput:
 *       type: object
 *       required:
 *         - price
 *       properties:
 *         sku:
 *           type: string
 *           description: 재고 관리 단위
 *         price:
 *           type: number
 *           description: 가격
 *         salePrice:
 *           type: number
 *           description: 할인 가격
 *         stock:
 *           type: integer
 *           description: 재고 수량
 *         isActive:
 *           type: boolean
 *           description: 활성화 여부
 *         imageUrl:
 *           type: string
 *           description: 변형 이미지 URL
 *         optionValues:
 *           type: array
 *           items:
 *             type: integer
 *           description: 옵션 값 ID 목록
 *       example:
 *         sku: SHIRT-M-BLUE
 *         price: 39900
 *         salePrice: 29900
 *         stock: 10
 *         isActive: true
 *         imageUrl: https://example.com/images/shirt-m-blue.jpg
 *         optionValues: [2, 5]
 */

/**
 * @swagger
 * /api/option-types:
 *   get:
 *     summary: 모든 옵션 타입 조회
 *     tags: [OptionTypes]
 *     responses:
 *       200:
 *         description: 옵션 타입 목록 조회 성공
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
 *                     $ref: '#/components/schemas/OptionType'
 *   post:
 *     summary: 새 옵션 타입 생성
 *     tags: [OptionTypes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OptionTypeInput'
 *     responses:
 *       201:
 *         description: 옵션 타입 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/OptionType'
 *                 message:
 *                   type: string
 *                   example: 옵션 타입이 생성되었습니다.
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 없음
 */

/**
 * @swagger
 * /api/option-types/{id}:
 *   get:
 *     summary: ID로 옵션 타입 조회
 *     tags: [OptionTypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 옵션 타입 ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 옵션 타입 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/OptionType'
 *       404:
 *         description: 옵션 타입을 찾을 수 없음
 *   put:
 *     summary: 옵션 타입 수정
 *     tags: [OptionTypes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 옵션 타입 ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OptionTypeInput'
 *     responses:
 *       200:
 *         description: 옵션 타입 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/OptionType'
 *                 message:
 *                   type: string
 *                   example: 옵션 타입이 수정되었습니다.
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 옵션 타입을 찾을 수 없음
 *   delete:
 *     summary: 옵션 타입 삭제
 *     tags: [OptionTypes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 옵션 타입 ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 옵션 타입 삭제 성공
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
 *                   example: 옵션 타입이 삭제되었습니다.
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 옵션 타입을 찾을 수 없음
 */

/**
 * @swagger
 * /api/option-types/{optionTypeId}/values:
 *   post:
 *     summary: 옵션 값 생성
 *     tags: [OptionTypes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: optionTypeId
 *         required: true
 *         description: 옵션 타입 ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OptionValueInput'
 *     responses:
 *       201:
 *         description: 옵션 값 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/OptionValue'
 *                 message:
 *                   type: string
 *                   example: 옵션 값이 생성되었습니다.
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 옵션 타입을 찾을 수 없음
 */

/**
 * @swagger
 * /api/option-types/values/{valueId}:
 *   put:
 *     summary: 옵션 값 수정
 *     tags: [OptionTypes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: valueId
 *         required: true
 *         description: 옵션 값 ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OptionValueInput'
 *     responses:
 *       200:
 *         description: 옵션 값 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/OptionValue'
 *                 message:
 *                   type: string
 *                   example: 옵션 값이 수정되었습니다.
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 옵션 값을 찾을 수 없음
 *   delete:
 *     summary: 옵션 값 삭제
 *     tags: [OptionTypes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: valueId
 *         required: true
 *         description: 옵션 값 ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 옵션 값 삭제 성공
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
 *                   example: 옵션 값이 삭제되었습니다.
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 옵션 값을 찾을 수 없음
 */

/**
 * @swagger
 * /api/products/{productId}/variants:
 *   get:
 *     summary: 상품의 모든 변형 조회
 *     tags: [ProductVariants]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: 상품 ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 상품 변형 목록 조회 성공
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
 *                     $ref: '#/components/schemas/ProductVariant'
 *       404:
 *         description: 상품을 찾을 수 없음
 *   post:
 *     summary: 상품 변형 생성
 *     tags: [ProductVariants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: 상품 ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductVariantInput'
 *     responses:
 *       201:
 *         description: 상품 변형 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/ProductVariant'
 *                 message:
 *                   type: string
 *                   example: 상품 변형이 생성되었습니다.
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 상품을 찾을 수 없음
 */

/**
 * @swagger
 * /api/products/variants/{variantId}:
 *   get:
 *     summary: 변형 ID로 상품 변형 조회
 *     tags: [ProductVariants]
 *     parameters:
 *       - in: path
 *         name: variantId
 *         required: true
 *         description: 변형 ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 상품 변형 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/ProductVariant'
 *       404:
 *         description: 상품 변형을 찾을 수 없음
 *   put:
 *     summary: 상품 변형 수정
 *     tags: [ProductVariants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: variantId
 *         required: true
 *         description: 변형 ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductVariantInput'
 *     responses:
 *       200:
 *         description: 상품 변형 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/ProductVariant'
 *                 message:
 *                   type: string
 *                   example: 상품 변형이 수정되었습니다.
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 상품 변형을 찾을 수 없음
 *   delete:
 *     summary: 상품 변형 삭제
 *     tags: [ProductVariants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: variantId
 *         required: true
 *         description: 변형 ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 상품 변형 삭제 성공
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
 *                   example: 상품 변형이 삭제되었습니다.
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 상품 변형을 찾을 수 없음
 */
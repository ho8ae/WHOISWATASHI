/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: 카테고리 관리 API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - name
 *         - slug
 *       properties:
 *         id:
 *           type: integer
 *           description: 카테고리 ID
 *         name:
 *           type: string
 *           description: 카테고리 이름
 *         slug:
 *           type: string
 *           description: 카테고리 슬러그
 *         description:
 *           type: string
 *           description: 카테고리 설명
 *         parentId:
 *           type: integer
 *           nullable: true
 *           description: 부모 카테고리 ID
 *         imageUrl:
 *           type: string
 *           nullable: true
 *           description: 카테고리 이미지 URL
 *         isActive:
 *           type: boolean
 *           description: 카테고리 활성화 여부
 *         displayOrder:
 *           type: integer
 *           description: 표시 순서
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 생성 일시
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: 수정 일시
 *       example:
 *         id: 1
 *         name: 패션의류
 *         slug: clothing
 *         description: 다양한 스타일의 패션 의류 제품
 *         parentId: null
 *         imageUrl: null
 *         isActive: true
 *         displayOrder: 1
 *         createdAt: '2025-03-09T06:47:35.923Z'
 *         updatedAt: '2025-03-09T06:55:36.967Z'
 *     
 *     CategoryResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/Category'
 *     
 *     CategoriesResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Category'
 *     
 *     CategoryCreateInput:
 *       type: object
 *       required:
 *         - name
 *         - slug
 *       properties:
 *         name:
 *           type: string
 *           description: 카테고리 이름
 *           example: 신발
 *         slug:
 *           type: string
 *           description: 카테고리 슬러그
 *           example: shoes
 *         description:
 *           type: string
 *           description: 카테고리 설명
 *           example: 다양한 종류의 신발 제품
 *         parentId:
 *           type: integer
 *           description: 부모 카테고리 ID
 *           example: 1
 *         imageUrl:
 *           type: string
 *           description: 카테고리 이미지 URL
 *           example: https://example.com/images/shoes.jpg
 *         isActive:
 *           type: boolean
 *           description: 카테고리 활성화 여부
 *           example: true
 *         displayOrder:
 *           type: integer
 *           description: 표시 순서
 *           example: 2
 *     
 *     CategoryUpdateInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: 카테고리 이름
 *           example: 패션 신발
 *         description:
 *           type: string
 *           description: 카테고리 설명
 *           example: 트렌디한 패션 신발 제품
 *         parentId:
 *           type: integer
 *           description: 부모 카테고리 ID
 *           example: 1
 *         imageUrl:
 *           type: string
 *           description: 카테고리 이미지 URL
 *           example: https://example.com/images/fashion-shoes.jpg
 *         isActive:
 *           type: boolean
 *           description: 카테고리 활성화 여부
 *           example: true
 *         displayOrder:
 *           type: integer
 *           description: 표시 순서
 *           example: 3
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: 모든 카테고리 조회
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: 카테고리 목록 반환 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoriesResponse'
 *   post:
 *     summary: 카테고리 생성
 *     description: 새로운 카테고리를 생성합니다. 관리자 권한이 필요합니다.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryCreateInput'
 *     responses:
 *       201:
 *         description: 카테고리 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *                 message:
 *                   type: string
 *                   example: 카테고리가 성공적으로 생성되었습니다.
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: 인증 실패
 */

/**
 * @swagger
 * /api/categories/tree:
 *   get:
 *     summary: 카테고리 계층 구조 조회
 *     description: 계층 구조로 정리된 카테고리 트리를 반환합니다.
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: 카테고리 트리 반환 성공
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
 *                     type: object
 *                     allOf:
 *                       - $ref: '#/components/schemas/Category'
 *                       - type: object
 *                         properties:
 *                           children:
 *                             type: array
 *                             items:
 *                               $ref: '#/components/schemas/Category'
 */

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: ID로 카테고리 조회
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 카테고리 ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 카테고리 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryResponse'
 *       404:
 *         description: 카테고리를 찾을 수 없음
 *   put:
 *     summary: 카테고리 수정
 *     description: 기존 카테고리 정보를 수정합니다. 관리자 권한이 필요합니다.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 카테고리 ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryUpdateInput'
 *     responses:
 *       200:
 *         description: 카테고리 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *                 message:
 *                   type: string
 *                   example: 카테고리가 성공적으로 수정되었습니다.
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 카테고리를 찾을 수 없음
 *   delete:
 *     summary: 카테고리 삭제
 *     description: 카테고리를 삭제합니다(소프트 삭제). 관리자 권한이 필요합니다.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 카테고리 ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 카테고리 삭제 성공
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
 *                   example: 카테고리가 성공적으로 삭제되었습니다.
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 카테고리를 찾을 수 없음
 */

/**
 * @swagger
 * /api/categories/slug/{slug}:
 *   get:
 *     summary: Slug로 카테고리 조회
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         description: 카테고리 슬러그
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 카테고리 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryResponse'
 *       404:
 *         description: 카테고리를 찾을 수 없음
 */

/**
 * @swagger
 * /api/categories/{id}/subcategories:
 *   get:
 *     summary: 하위 카테고리 조회
 *     description: 특정 카테고리의 직속 하위 카테고리를 조회합니다.
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 부모 카테고리 ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 하위 카테고리 목록 반환 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoriesResponse'
 */
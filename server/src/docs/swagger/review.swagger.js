/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: 상품 리뷰 관리 API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ReviewSummary:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 리뷰 ID
 *         rating:
 *           type: integer
 *           description: 평점 (1-5)
 *         title:
 *           type: string
 *           description: 리뷰 제목
 *         content:
 *           type: string
 *           description: 리뷰 내용
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: 리뷰 이미지 URL 목록
 *         isVerified:
 *           type: boolean
 *           description: 구매 검증 여부
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 작성 일시
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 *       example:
 *         id: 1
 *         rating: 5
 *         title: "정말 좋은 상품입니다!"
 *         content: "배송도 빠르고 품질도 좋습니다. 다음에도 구매하고 싶어요."
 *         images: ["https://example.com/review1.jpg"]
 *         isVerified: true
 *         createdAt: "2025-03-10T12:00:00Z"
 *         user:
 *           id: 1
 *           name: "홍길동"
 *     
 *     Review:
 *       allOf:
 *         - $ref: '#/components/schemas/ReviewSummary'
 *         - type: object
 *           properties:
 *             productId:
 *               type: integer
 *               description: 상품 ID
 *             orderId:
 *               type: integer
 *               description: 주문 ID
 *               nullable: true
 *             updatedAt:
 *               type: string
 *               format: date-time
 *               description: 수정 일시
 *             product:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 slug:
 *                   type: string
 *           example:
 *             productId: 1
 *             orderId: 1
 *             updatedAt: "2025-03-10T12:00:00Z"
 *             product:
 *               id: 1
 *               name: "프리미엄 티셔츠"
 *               slug: "premium-tshirt"
 *     
 *     UserReview:
 *       allOf:
 *         - $ref: '#/components/schemas/ReviewSummary'
 *         - type: object
 *           properties:
 *             product:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 slug:
 *                   type: string
 *                 image:
 *                   type: string
 *                   nullable: true
 *           example:
 *             product:
 *               id: 1
 *               name: "프리미엄 티셔츠"
 *               slug: "premium-tshirt"
 *               image: "https://example.com/tshirt.jpg"
 *     
 *     ReviewInput:
 *       type: object
 *       required:
 *         - productId
 *         - rating
 *         - title
 *         - content
 *       properties:
 *         productId:
 *           type: integer
 *           description: 상품 ID
 *         orderId:
 *           type: integer
 *           description: 주문 ID
 *         rating:
 *           type: integer
 *           description: 평점 (1-5)
 *           minimum: 1
 *           maximum: 5
 *         title:
 *           type: string
 *           description: 리뷰 제목
 *           maxLength: 100
 *         content:
 *           type: string
 *           description: 리뷰 내용
 *           minLength: 10
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: 리뷰 이미지 URL 목록
 *           maxItems: 5
 *       example:
 *         productId: 1
 *         orderId: 1
 *         rating: 5
 *         title: "정말 좋은 상품입니다!"
 *         content: "배송도 빠르고 품질도 좋습니다. 다음에도 구매하고 싶어요."
 *         images: ["https://example.com/review1.jpg"]
 *     
 *     ReviewUpdateInput:
 *       type: object
 *       properties:
 *         rating:
 *           type: integer
 *           description: 평점 (1-5)
 *           minimum: 1
 *           maximum: 5
 *         title:
 *           type: string
 *           description: 리뷰 제목
 *           maxLength: 100
 *         content:
 *           type: string
 *           description: 리뷰 내용
 *           minLength: 10
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: 리뷰 이미지 URL 목록
 *           maxItems: 5
 *       example:
 *         rating: 4
 *         title: "좋은 상품이에요!"
 *         content: "처음에는 5점을 줬지만, 사용해보니 4점 정도가 적당한 것 같습니다."
 *         images: ["https://example.com/review1_updated.jpg"]
 *     
 *     ReviewableItem:
 *       type: object
 *       properties:
 *         orderId:
 *           type: integer
 *           description: 주문 ID
 *         orderNumber:
 *           type: string
 *           description: 주문 번호
 *         orderDate:
 *           type: string
 *           format: date-time
 *           description: 주문 일시
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
 *             image:
 *               type: string
 *               description: 상품 이미지
 *               nullable: true
 *       example:
 *         orderId: 1
 *         orderNumber: "230805-123456"
 *         orderDate: "2025-03-01T12:00:00Z"
 *         product:
 *           id: 1
 *           name: "프리미엄 티셔츠"
 *           slug: "premium-tshirt"
 *           image: "https://example.com/tshirt.jpg"
 *     
 *     RatingStats:
 *       type: object
 *       properties:
 *         average:
 *           type: number
 *           description: 평균 평점
 *           format: float
 *         total:
 *           type: integer
 *           description: 총 리뷰 수
 *         distribution:
 *           type: object
 *           description: 평점별 리뷰 수
 *           additionalProperties:
 *             type: integer
 *       example:
 *         average: 4.5
 *         total: 120
 *         distribution:
 *           "5": 80
 *           "4": 30
 *           "3": 5
 *           "2": 3
 *           "1": 2
 */

/**
 * @swagger
 * /reviews/products/{productId}:
 *   get:
 *     summary: 상품별 리뷰 목록 조회
 *     description: 특정 상품에 작성된 리뷰 목록을 조회합니다. 평점 통계 정보도 함께 제공합니다.
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 상품 ID
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
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [latest, oldest, highest, lowest]
 *           default: latest
 *         description: 정렬 기준 (최신순, 오래된순, 높은평점순, 낮은평점순)
 *     responses:
 *       200:
 *         description: 리뷰 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     reviews:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/ReviewSummary'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                           example: 25
 *                         page:
 *                           type: integer
 *                           example: 1
 *                         limit:
 *                           type: integer
 *                           example: 10
 *                         totalPages:
 *                           type: integer
 *                           example: 3
 *                     ratingStats:
 *                       $ref: '#/components/schemas/RatingStats'
 *       400:
 *         description: 잘못된 요청
 */

/**
 * @swagger
 * /reviews/{id}:
 *   get:
 *     summary: 리뷰 상세 조회
 *     description: 특정 리뷰의 상세 정보를 조회합니다.
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 리뷰 ID
 *     responses:
 *       200:
 *         description: 리뷰 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Review'
 *       404:
 *         description: 리뷰를 찾을 수 없음
 */

/**
 * @swagger
 * /reviews/my-reviews:
 *   get:
 *     summary: 내 리뷰 목록 조회
 *     description: 현재 로그인한 사용자가 작성한 리뷰 목록을 조회합니다.
 *     tags: [Reviews]
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
 *         description: 리뷰 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     reviews:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/UserReview'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                           example: 5
 *                         page:
 *                           type: integer
 *                           example: 1
 *                         limit:
 *                           type: integer
 *                           example: 10
 *                         totalPages:
 *                           type: integer
 *                           example: 1
 *       401:
 *         description: 인증 실패
 */

/**
 * @swagger
 * /reviews/reviewable:
 *   get:
 *     summary: 작성 가능한 리뷰 목록 조회
 *     description: 사용자가 구매한 상품 중 아직 리뷰를 작성하지 않은 상품 목록을 조회합니다.
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 작성 가능한 리뷰 목록 조회 성공
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
 *                     $ref: '#/components/schemas/ReviewableItem'
 *       401:
 *         description: 인증 실패
 */

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: 리뷰 작성
 *     description: 상품에 대한 리뷰를 작성합니다. 주문 ID를 포함하면 구매 검증 리뷰로 표시됩니다.
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReviewInput'
 *     responses:
 *       201:
 *         description: 리뷰 작성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Review'
 *                 message:
 *                   type: string
 *                   example: 리뷰가 성공적으로 등록되었습니다.
 *       400:
 *         description: 잘못된 요청 (유효성 검사 실패)
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 상품 또는 주문을 찾을 수 없음
 *       409:
 *         description: 이미 리뷰가 존재함
 */

/**
 * @swagger
 * /reviews/{id}:
 *   put:
 *     summary: 리뷰 수정
 *     description: 작성한 리뷰를 수정합니다.
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 리뷰 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReviewUpdateInput'
 *     responses:
 *       200:
 *         description: 리뷰 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Review'
 *                 message:
 *                   type: string
 *                   example: 리뷰가 성공적으로 수정되었습니다.
 *       400:
 *         description: 잘못된 요청 (유효성 검사 실패)
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 없음 (다른 사용자의 리뷰)
 *       404:
 *         description: 리뷰를 찾을 수 없음
 *
 *   delete:
 *     summary: 리뷰 삭제
 *     description: 작성한 리뷰를 삭제합니다. 관리자는 모든 리뷰를 삭제할 수 있습니다.
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 리뷰 ID
 *     responses:
 *       200:
 *         description: 리뷰 삭제 성공
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
 *                   example: 리뷰가 삭제되었습니다.
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 없음 (다른 사용자의 리뷰)
 *       404:
 *         description: 리뷰를 찾을 수 없음
 */
/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: 관리자 전용 API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserSummary:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 사용자 ID
 *         email:
 *           type: string
 *           description: 이메일
 *         name:
 *           type: string
 *           description: 이름
 *         phone:
 *           type: string
 *           description: 연락처
 *         role:
 *           type: string
 *           enum: [customer, admin]
 *           description: 사용자 역할
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 가입 일시
 *         orderCount:
 *           type: integer
 *           description: 주문 건수
 *       example:
 *         id: 1
 *         email: user@example.com
 *         name: 홍길동
 *         phone: 01012345678
 *         role: customer
 *         createdAt: '2025-03-09T08:30:00.000Z'
 *         orderCount: 5
 *
 *     UserDetail:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 사용자 ID
 *         email:
 *           type: string
 *           description: 이메일
 *         name:
 *           type: string
 *           description: 이름
 *         phone:
 *           type: string
 *           description: 연락처
 *         role:
 *           type: string
 *           enum: [customer, admin]
 *           description: 사용자 역할
 *         birthYear:
 *           type: integer
 *           description: 출생년도
 *           nullable: true
 *         birthMonth:
 *           type: integer
 *           description: 출생월
 *           nullable: true
 *         birthDay:
 *           type: integer
 *           description: 출생일
 *           nullable: true
 *         isSolarCalendar:
 *           type: boolean
 *           description: 양력 여부
 *         agreeSMS:
 *           type: boolean
 *           description: SMS 수신 동의 여부
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 가입 일시
 *         addresses:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Address'
 *         orders:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderSummary'
 *         orderCount:
 *           type: integer
 *           description: 총 주문 건수
 *
 *     Address:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 주소 ID
 *         name:
 *           type: string
 *           description: 주소 별칭
 *         recipient:
 *           type: string
 *           description: 수령인
 *         postalCode:
 *           type: string
 *           description: 우편번호
 *         address1:
 *           type: string
 *           description: 기본 주소
 *         address2:
 *           type: string
 *           description: 상세 주소
 *         phone:
 *           type: string
 *           description: 연락처
 *         isDefault:
 *           type: boolean
 *           description: 기본 주소 여부
 *
 *     DashboardStats:
 *       type: object
 *       properties:
 *         userStats:
 *           type: object
 *           properties:
 *             totalUsers:
 *               type: integer
 *               description: 총 사용자 수
 *             newUsersToday:
 *               type: integer
 *               description: 오늘 가입한 사용자 수
 *         productStats:
 *           type: object
 *           properties:
 *             totalProducts:
 *               type: integer
 *               description: 총 상품 수
 *             lowStockProducts:
 *               type: integer
 *               description: 재고 부족 상품 수
 *         orderStats:
 *           type: object
 *           properties:
 *             totalOrders:
 *               type: integer
 *               description: 총 주문 수
 *             pendingOrders:
 *               type: integer
 *               description: 대기 중인 주문 수
 *         salesStats:
 *           type: object
 *           properties:
 *             thisMonth:
 *               type: number
 *               description: 이번 달 총 매출
 *             lastMonth:
 *               type: number
 *               description: 지난 달 총 매출
 *             dailySales:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   date:
 *                     type: string
 *                     format: date
 *                   total:
 *                     type: number
 *         recentOrders:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderSummary'
 *
 *     OutOfStockProduct:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 상품 변형 ID
 *         product:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 *             slug:
 *               type: string
 *             images:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   imageUrl:
 *                     type: string
 *         options:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               optionValue:
 *                 type: object
 *                 properties:
 *                   value:
 *                     type: string
 *                   optionType:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *
 *     StockUpdateInput:
 *       type: object
 *       required:
 *         - stock
 *       properties:
 *         stock:
 *           type: integer
 *           minimum: 0
 *           description: 업데이트할 재고 수량
 *       example:
 *         stock: 10
 *
 *     RoleUpdateInput:
 *       type: object
 *       required:
 *         - role
 *       properties:
 *         role:
 *           type: string
 *           enum: [customer, admin]
 *           description: 변경할 역할
 *       example:
 *         role: admin
 *
 *     OrderUpdateInput:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [pending, processing, completed, cancelled, refunded]
 *           description: 주문 상태
 *         trackingNumber:
 *           type: string
 *           description: 운송장 번호
 *         shippedAt:
 *           type: string
 *           format: date-time
 *           description: 배송 시작 일시
 *         notes:
 *           type: string
 *           description: 주문 메모
 *       example:
 *         status: processing
 *         trackingNumber: 1234567890
 *         shippedAt: '2025-03-12T10:00:00Z'
 *         notes: 고객에게 배송 시작 안내 발송 완료
 *
 *     Pagination:
 *       type: object
 *       properties:
 *         total:
 *           type: integer
 *           description: 전체 항목 수
 *         page:
 *           type: integer
 *           description: 현재 페이지
 *         limit:
 *           type: integer
 *           description: 페이지당 항목 수
 *         totalPages:
 *           type: integer
 *           description: 전체 페이지 수
 *       example:
 *         total: 25
 *         page: 1
 *         limit: 10
 *         totalPages: 3
 */

/**
 * @swagger
 * /admin/dashboard:
 *   get:
 *     summary: 대시보드 통계 조회
 *     description: 관리자 대시보드에 필요한 주요 통계 데이터를 제공합니다. 사용자, 상품, 주문, 매출 관련 통계와 최근 주문 목록이 포함됩니다.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 대시보드 통계 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/DashboardStats'
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 없음 (관리자 아님)
 */

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: 사용자 목록 조회
 *     description: 시스템에 등록된 모든 사용자 목록을 조회합니다. 페이지네이션, 검색, 역할 필터링을 지원합니다.
 *     tags: [Admin]
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
 *         name: search
 *         schema:
 *           type: string
 *         description: 이름, 이메일 또는 전화번호로 검색
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [customer, admin]
 *         description: 역할로 필터링
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 사용자 목록 조회 성공
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
 *                     users:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/UserSummary'
 *                     pagination:
 *                       $ref: '#/components/schemas/Pagination'
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 없음 (관리자 아님)
 */

/**
 * @swagger
 * /admin/users/{id}:
 *   get:
 *     summary: 사용자 상세 정보 조회
 *     description: 특정 사용자의 상세 정보를 조회합니다. 주소, 최근 주문 정보 등이 포함됩니다.
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 사용자 ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 사용자 상세 정보 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/UserDetail'
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 없음 (관리자 아님)
 *       404:
 *         description: 사용자를 찾을 수 없음
 */

/**
 * @swagger
 * /admin/users/{id}/role:
 *   patch:
 *     summary: 사용자 역할 변경
 *     description: 사용자의 역할을 고객 또는 관리자로 변경합니다.
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 사용자 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RoleUpdateInput'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 사용자 역할 변경 성공
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
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *                     role:
 *                       type: string
 *                 message:
 *                   type: string
 *                   example: 사용자 역할이 변경되었습니다.
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 없음 (관리자 아님)
 *       404:
 *         description: 사용자를 찾을 수 없음
 */

/**
 * @swagger
 * /admin/orders:
 *   get:
 *     summary: 모든 주문 조회
 *     description: 시스템의 모든 주문을 조회합니다. 상태, 날짜, 검색어 등으로 필터링할 수 있습니다.
 *     tags: [Admin]
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
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, processing, completed, cancelled, refunded]
 *         description: 주문 상태로 필터링
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: 주문번호, 이메일, 전화번호 등으로 검색
 *       - in: query
 *         name: fromDate
 *         schema:
 *           type: string
 *           format: date
 *         description: 조회 시작 날짜
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *           format: date
 *         description: 조회 종료 날짜
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 주문 목록 조회 성공
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
 *                     orders:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Order'
 *                     pagination:
 *                       $ref: '#/components/schemas/Pagination'
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 없음 (관리자 아님)
 */

/**
 * @swagger
 * /admin/orders/{id}:
 *   patch:
 *     summary: 주문 상태 및 배송 정보 업데이트
 *     description: 주문의 상태를 변경하고 배송 정보를 업데이트합니다.
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 주문 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderUpdateInput'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 주문 업데이트 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *                 message:
 *                   type: string
 *                   example: 주문이 업데이트되었습니다.
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 없음 (관리자 아님)
 *       404:
 *         description: 주문을 찾을 수 없음
 */

/**
 * @swagger
 * /admin/products/out-of-stock:
 *   get:
 *     summary: 품절 상품 목록 조회
 *     description: 재고가 0인 모든 상품 변형(variants) 목록을 조회합니다.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 품절 상품 목록 조회 성공
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
 *                     $ref: '#/components/schemas/OutOfStockProduct'
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 없음 (관리자 아님)
 */

/**
 * @swagger
 * /admin/products/variants/{id}/stock:
 *   patch:
 *     summary: 제품 재고 업데이트
 *     description: 상품 변형(variant)의 재고 수량을 업데이트합니다.
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 상품 변형 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StockUpdateInput'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 재고 업데이트 성공
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
 *                     id:
 *                       type: integer
 *                     stock:
 *                       type: integer
 *                     product:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         name:
 *                           type: string
 *                 message:
 *                   type: string
 *                   example: 재고가 업데이트되었습니다.
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 없음 (관리자 아님)
 *       404:
 *         description: 상품 변형을 찾을 수 없음
 */
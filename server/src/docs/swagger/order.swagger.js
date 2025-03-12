/**
 * @swagger
 * tags:
 *   name: Order
 *   description: 주문 관련 API
 *
 * 
 *   
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 주문 아이템 ID
 *         productId:
 *           type: integer
 *           description: 상품 ID
 *         productVariantId:
 *           type: integer
 *           description: 상품 변형 ID
 *           nullable: true
 *         productName:
 *           type: string
 *           description: 상품명
 *         variantInfo:
 *           type: object
 *           properties:
 *             options:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     description: 옵션 유형
 *                   value:
 *                     type: string
 *                     description: 옵션 값
 *             sku:
 *               type: string
 *               description: 상품 코드
 *         quantity:
 *           type: integer
 *           description: 수량
 *         unitPrice:
 *           type: number
 *           format: decimal
 *           description: 단가
 *         totalPrice:
 *           type: number
 *           format: decimal
 *           description: 총액
 *       example:
 *         id: 1
 *         productId: 101
 *         productVariantId: 201
 *         productName: 프리미엄 티셔츠
 *         variantInfo:
 *           options:
 *             - type: 색상
 *               value: 블랙
 *             - type: 사이즈
 *               value: L
 *           sku: TS-BLK-L
 *         quantity: 2
 *         unitPrice: 32500
 *         totalPrice: 65000
 *
 *     OrderItemSummary:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 주문 아이템 ID
 *         productName:
 *           type: string
 *           description: 상품명
 *         variantInfo:
 *           type: object
 *           properties:
 *             options:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                   value:
 *                     type: string
 *         quantity:
 *           type: integer
 *           description: 수량
 *         unitPrice:
 *           type: number
 *           format: decimal
 *           description: 단가
 *         totalPrice:
 *           type: number
 *           format: decimal
 *           description: 총액
 *       example:
 *         id: 1
 *         productName: 프리미엄 티셔츠
 *         variantInfo:
 *           options:
 *             - type: 색상
 *               value: 블랙
 *             - type: 사이즈
 *               value: L
 *         quantity: 2
 *         unitPrice: 32500
 *         totalPrice: 65000
 *
 *     Payment:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 결제 ID
 *         orderId:
 *           type: integer
 *           description: 주문 ID
 *         amount:
 *           type: number
 *           format: decimal
 *           description: 결제 금액
 *         provider:
 *           type: string
 *           description: 결제 제공업체 (portone, toss 등)
 *         status:
 *           type: string
 *           enum: [pending, completed, failed, refunded]
 *           description: 결제 상태
 *         paymentKey:
 *           type: string
 *           description: 결제 고유 키
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 결제 생성 시간
 *       example:
 *         id: 1
 *         orderId: 1
 *         amount: 68000
 *         provider: portone
 *         status: completed
 *         paymentKey: imp_123456789
 *         createdAt: 2023-08-05T12:34:56Z
 *
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 주문 ID
 *         orderNumber:
 *           type: string
 *           description: 주문 번호
 *         userId:
 *           type: integer
 *           description: 사용자 ID
 *           nullable: true
 *         email:
 *           type: string
 *           description: 이메일
 *         phone:
 *           type: string
 *           description: 연락처
 *         status:
 *           type: string
 *           enum: [pending, processing, completed, cancelled, refunded]
 *           description: 주문 상태
 *         totalAmount:
 *           type: number
 *           format: decimal
 *           description: 총 주문 금액
 *         shippingFee:
 *           type: number
 *           format: decimal
 *           description: 배송비
 *         discountAmount:
 *           type: number
 *           format: decimal
 *           description: 할인 금액
 *         paymentMethod:
 *           type: string
 *           description: 결제 방법
 *         paymentStatus:
 *           type: string
 *           enum: [pending, paid, failed]
 *           description: 결제 상태
 *         recipientName:
 *           type: string
 *           description: 수령인 이름
 *         recipientPhone:
 *           type: string
 *           description: 수령인 연락처
 *         postalCode:
 *           type: string
 *           description: 우편번호
 *         address1:
 *           type: string
 *           description: 기본 주소
 *         address2:
 *           type: string
 *           description: 상세 주소
 *           nullable: true
 *         notes:
 *           type: string
 *           description: 배송 메모
 *           nullable: true
 *         shippedAt:
 *           type: string
 *           format: date-time
 *           description: 발송 일시
 *           nullable: true
 *         deliveredAt:
 *           type: string
 *           format: date-time
 *           description: 배송 완료 일시
 *           nullable: true
 *         trackingNumber:
 *           type: string
 *           description: 운송장 번호
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 주문 생성 일시
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: 주문 수정 일시
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         payments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Payment'
 *       example:
 *         id: 1
 *         orderNumber: 230805-123456
 *         userId: 101
 *         email: user@example.com
 *         phone: 01012345678
 *         status: processing
 *         totalAmount: 65000
 *         shippingFee: 3000
 *         discountAmount: 0
 *         paymentMethod: card
 *         paymentStatus: paid
 *         recipientName: 홍길동
 *         recipientPhone: 01012345678
 *         postalCode: 12345
 *         address1: 서울시 강남구 테헤란로 123
 *         address2: 456호
 *         notes: 부재시 경비실에 맡겨주세요
 *         shippedAt: null
 *         deliveredAt: null
 *         trackingNumber: null
 *         createdAt: 2023-08-05T12:34:56Z
 *         updatedAt: 2023-08-05T12:34:56Z
 *         items:
 *           - id: 1
 *             productId: 101
 *             productVariantId: 201
 *             productName: 프리미엄 티셔츠
 *             variantInfo:
 *               options:
 *                 - type: 색상
 *                   value: 블랙
 *                 - type: 사이즈
 *                   value: L
 *               sku: TS-BLK-L
 *             quantity: 2
 *             unitPrice: 32500
 *             totalPrice: 65000
 *         payments:
 *           - id: 1
 *             orderId: 1
 *             amount: 68000
 *             provider: portone
 *             status: completed
 *             paymentKey: imp_123456789
 *             createdAt: 2023-08-05T12:34:56Z
 *
 *     OrderSummary:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 주문 ID
 *         orderNumber:
 *           type: string
 *           description: 주문 번호
 *         status:
 *           type: string
 *           enum: [pending, processing, completed, cancelled, refunded]
 *           description: 주문 상태
 *         totalAmount:
 *           type: number
 *           format: decimal
 *           description: 총 주문 금액
 *         paymentStatus:
 *           type: string
 *           enum: [pending, paid, failed]
 *           description: 결제 상태
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 주문 생성 일시
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItemSummary'
 *       example:
 *         id: 1
 *         orderNumber: 230805-123456
 *         status: processing
 *         totalAmount: 68000
 *         paymentStatus: paid
 *         createdAt: 2023-08-05T12:34:56Z
 *         items:
 *           - id: 1
 *             productName: 프리미엄 티셔츠
 *             variantInfo:
 *               options:
 *                 - type: 색상
 *                   value: 블랙
 *                 - type: 사이즈
 *                   value: L
 *             quantity: 2
 *             unitPrice: 32500
 *             totalPrice: 65000
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
 *
 *     OrderCreateInput:
 *       type: object
 *       required:
 *         - email
 *         - phone
 *         - recipientName
 *         - recipientPhone
 *         - postalCode
 *         - address1
 *         - paymentMethod
 *       properties:
 *         userId:
 *           type: integer
 *           description: 사용자 ID
 *         email:
 *           type: string
 *           description: 이메일
 *         phone:
 *           type: string
 *           description: 연락처
 *         recipientName:
 *           type: string
 *           description: 수령인 이름
 *         recipientPhone:
 *           type: string
 *           description: 수령인 연락처
 *         postalCode:
 *           type: string
 *           description: 우편번호
 *         address1:
 *           type: string
 *           description: 기본 주소
 *         address2:
 *           type: string
 *           description: 상세 주소
 *         notes:
 *           type: string
 *           description: 배송 메모
 *         paymentMethod:
 *           type: string
 *           enum: [card, vbank, phone]
 *           description: 결제 방법
 *         guestPassword:
 *           type: string
 *           description: 비회원 주문 비밀번호 (비회원 주문 시 필수)
 *       example:
 *         userId: 4
 *         email: user@example.com
 *         phone: 01012345678
 *         recipientName: 홍길동
 *         recipientPhone: 01012345678
 *         postalCode: 12345
 *         address1: 서울시 강남구 테헤란로 123
 *         address2: 456호
 *         notes: 부재시 경비실에 맡겨주세요
 *         paymentMethod: card
 *         guestPassword: password123 // 비회원 주문 시 필수
 *
 *     GuestOrderInput:
 *       type: object
 *       required:
 *         - orderNumber
 *         - password
 *       properties:
 *         orderNumber:
 *           type: string
 *           description: 주문 번호
 *         password:
 *           type: string
 *           description: 비회원 주문 비밀번호
 *       example:
 *         orderNumber: 230805-123456
 *         password: password123
 *
 *     PortOnePaymentInput:
 *       type: object
 *       required:
 *         - impUid
 *         - orderId
 *         - amount
 *       properties:
 *         impUid:
 *           type: string
 *           description: PortOne 결제 고유 ID
 *         orderId:
 *           type: integer
 *           description: 주문 ID
 *         amount:
 *           type: number
 *           format: decimal
 *           description: 결제 금액
 *       example:
 *         impUid: imp_123456789
 *         orderId: 1
 *         amount: 68000
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
 * /orders:
 *   post:
 *     summary: 주문 생성
 *     description: 장바구니의 상품으로 새로운 주문을 생성합니다.
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderCreateInput'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: 주문 생성 성공
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
 *                     orderId:
 *                       type: integer
 *                       example: 1
 *                     orderNumber:
 *                       type: string
 *                       example: 230805-123456
 *                     totalAmount:
 *                       type: number
 *                       example: 65000
 *                     shippingFee:
 *                       type: number
 *                       example: 3000
 *                 message:
 *                   type: string
 *                   example: 주문이 생성되었습니다.
 *       400:
 *         description: 잘못된 요청 또는 장바구니가 비어있음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *   get:
 *     summary: 사용자 주문 목록 조회
 *     description: 로그인한 사용자의 주문 목록을 조회합니다.
 *     tags: [Order]
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
 *         description: 주문 상태 필터
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
 *                 orders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/OrderSummary'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       401:
 *         description: 인증 실패
 */
/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: 주문 상세 조회
 *     description: 주문 ID로 상세 정보를 조회합니다. 본인의 주문이거나 관리자만 조회할 수 있습니다.
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 주문 ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 주문 조회 성공
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
 *       403:
 *         description: 접근 권한 없음
 *       404:
 *         description: 주문을 찾을 수 없음
 *
 *   delete:
 *     summary: 주문 취소
 *     description: 주문을 취소합니다. 결제 전 상태의 주문만 취소할 수 있습니다.
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 주문 ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 주문 취소 성공
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
 *                   example: 주문이 취소되었습니다.
 *       400:
 *         description: 이미 처리된 주문은 취소할 수 없음
 *       403:
 *         description: 접근 권한 없음
 *       404:
 *         description: 주문을 찾을 수 없음
 */

/**
 * @swagger
 * /orders/guest:
 *   post:
 *     summary: 비회원 주문 조회
 *     description: 주문 번호와 비밀번호로 비회원 주문을 조회합니다.
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GuestOrderInput'
 *     responses:
 *       200:
 *         description: 주문 조회 성공
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
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: 비밀번호가 일치하지 않음
 *       404:
 *         description: 주문을 찾을 수 없음
 */

/**
 * @swagger
 * /payments/portone/verify:
 *   post:
 *     summary: PortOne 결제 검증 (개발 중)
 *     description: PortOne 결제 후 검증을 수행합니다. 이 API는 현재 개발 중이며 프론트엔드 연동이 필요합니다.
 *     tags: [Payment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PortOnePaymentInput'
 *     responses:
 *       200:
 *         description: 결제 검증 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Payment'
 *                 message:
 *                   type: string
 *                   example: 결제가 완료되었습니다.
 *       400:
 *         description: 결제 검증 실패 (금액 불일치 등)
 *       404:
 *         description: 주문 또는 결제 정보를 찾을 수 없음
 */

/**
 * @swagger
 * tags:
 *   name: Tracking
 *   description: 주문 추적 및 배송 상태 관리 API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     TrackingInfo:
 *       type: object
 *       properties:
 *         orderNumber:
 *           type: string
 *           description: 주문 번호
 *         orderDate:
 *           type: string
 *           format: date-time
 *           description: 주문 일시
 *         currentStatus:
 *           type: string
 *           description: 현재 주문 상태
 *         paymentStatus:
 *           type: string
 *           description: 결제 상태
 *         shippingDetails:
 *           type: object
 *           properties:
 *             carrier:
 *               type: string
 *               description: 배송사
 *             trackingNumber:
 *               type: string
 *               description: 운송장 번호
 *             shippedAt:
 *               type: string
 *               format: date-time
 *               description: 발송 시간
 *             deliveredAt:
 *               type: string
 *               format: date-time
 *               description: 배송 완료 시간
 *             estimatedDelivery:
 *               type: string
 *               format: date-time
 *               description: 예상 배송 완료일
 *         statusHistory:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderStatusHistory'
 *         externalTrackingUrl:
 *           type: string
 *           description: 외부 배송 추적 URL
 *         externalTrackingDetails:
 *           type: object
 *           properties:
 *             carrier:
 *               type: string
 *             status:
 *               type: string
 *             trackingDetails:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: string
 *                   location:
 *                     type: string
 *                   timestamp:
 *                     type: string
 *                     format: date-time
 *       example:
 *         orderNumber: 230805-123456
 *         orderDate: 2025-03-10T12:00:00Z
 *         currentStatus: shipped
 *         paymentStatus: paid
 *         shippingDetails:
 *           carrier: 대한통운
 *           trackingNumber: 123456789012
 *           shippedAt: 2025-03-12T09:00:00Z
 *           deliveredAt: null
 *           estimatedDelivery: 2025-03-15T09:00:00Z
 *         statusHistory:
 *           - status: pending
 *             message: 주문이 접수되었습니다.
 *             timestamp: 2025-03-10T12:00:00Z
 *             displayStatus: 주문 접수
 *           - status: processing
 *             message: 주문 처리 중입니다.
 *             timestamp: 2025-03-11T10:30:00Z
 *             displayStatus: 상품 준비 중
 *           - status: shipped
 *             message: 상품이 발송되었습니다.
 *             timestamp: 2025-03-12T09:00:00Z
 *             displayStatus: 배송 중
 *         externalTrackingUrl: https://www.doortodoor.co.kr/parcel/doortodoor.do?fsp_action=PARC_ACT_002&fsp_cmd=retrieveInvNoACT&invc_no=123456789012
 *         externalTrackingDetails:
 *           carrier: 대한통운
 *           status: 배송 중
 *           trackingDetails:
 *             - status: 상품 인수
 *               location: 집화점
 *               timestamp: 2025-03-10T15:00:00Z
 *             - status: 상품 이동 중
 *               location: 물류센터
 *               timestamp: 2025-03-11T12:00:00Z
 *             - status: 배송 출발
 *               location: 배송점
 *               timestamp: 2025-03-12T09:00:00Z
 *     
 *     OrderStatusHistory:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           description: 주문 상태 코드
 *         message:
 *           type: string
 *           description: 상태 설명
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: 상태 변경 시간
 *         displayStatus:
 *           type: string
 *           description: 표시용 상태 텍스트
 *       example:
 *         status: shipped
 *         message: 상품이 발송되었습니다.
 *         timestamp: 2025-03-12T09:00:00Z
 *         displayStatus: 배송 중
 *     
 *     StatusUpdateInput:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [pending, processing, shipped, delivered, cancelled, refunded]
 *           description: 변경할 주문 상태
 *         message:
 *           type: string
 *           description: 상태 변경 메시지
 *       example:
 *         status: shipped
 *         message: 주문하신 상품이 발송되었습니다. 배송 조회를 통해 배송 상황을 확인하실 수 있습니다.
 *     
 *     TrackingUpdateInput:
 *       type: object
 *       required:
 *         - trackingNumber
 *       properties:
 *         trackingNumber:
 *           type: string
 *           description: 운송장 번호
 *         carrier:
 *           type: string
 *           description: 배송사
 *         shippedAt:
 *           type: string
 *           format: date-time
 *           description: 발송 시간
 *       example:
 *         trackingNumber: 123456789012
 *         carrier: 대한통운
 *         shippedAt: 2025-03-12T09:00:00Z
 */

/**
 * @swagger
 * /tracking/orders/{orderId}:
 *   get:
 *     summary: 주문 배송 상태 조회
 *     description: 특정 주문의 배송 상태 및 추적 정보를 조회합니다.
 *     tags: [Tracking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 주문 ID
 *     responses:
 *       200:
 *         description: 배송 추적 정보 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/TrackingInfo'
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 주문을 찾을 수 없음
 */

/**
 * @swagger
 * /tracking/orders/{orderId}/history:
 *   get:
 *     summary: 주문 상태 변경 내역 조회
 *     description: 특정 주문의 상태 변경 내역을 조회합니다.
 *     tags: [Tracking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 주문 ID
 *     responses:
 *       200:
 *         description: 상태 변경 내역 조회 성공
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
 *                     $ref: '#/components/schemas/OrderStatusHistory'
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 주문을 찾을 수 없음
 */

/**
 * @swagger
 * /tracking/orders/{orderId}/status:
 *   patch:
 *     summary: 주문 상태 변경 (관리자 전용)
 *     description: 특정 주문의 상태를 변경하고 변경 내역을 기록합니다.
 *     tags: [Tracking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 주문 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StatusUpdateInput'
 *     responses:
 *       200:
 *         description: 주문 상태 변경 성공
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
 *                     order:
 *                       type: object
 *                     history:
 *                       $ref: '#/components/schemas/OrderStatusHistory'
 *                 message:
 *                   type: string
 *                   example: 주문 상태가 업데이트되었습니다.
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
 * /tracking/orders/{orderId}/tracking:
 *   patch:
 *     summary: 배송 추적 정보 업데이트 (관리자 전용)
 *     description: 특정 주문의 배송 추적 정보(운송장 번호 등)를 업데이트합니다.
 *     tags: [Tracking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 주문 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TrackingUpdateInput'
 *     responses:
 *       200:
 *         description: 배송 추적 정보 업데이트 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/TrackingInfo'
 *                 message:
 *                   type: string
 *                   example: 배송 추적 정보가 업데이트되었습니다.
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 없음 (관리자 아님)
 *       404:
 *         description: 주문을 찾을 수 없음
 */
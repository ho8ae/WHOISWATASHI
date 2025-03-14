/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: 사용자 알림 관리 API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 알림 ID
 *         userId:
 *           type: integer
 *           description: 수신자 ID
 *         type:
 *           type: string
 *           enum: [order_status, shipping_update, delivery_complete, inquiry_answer, product_restock, promotion, system]
 *           description: 알림 유형
 *         title:
 *           type: string
 *           description: 알림 제목
 *         message:
 *           type: string
 *           description: 알림 내용
 *         isRead:
 *           type: boolean
 *           description: 읽음 여부
 *         targetId:
 *           type: integer
 *           description: 관련 객체 ID (주문, 상품 등)
 *           nullable: true
 *         targetType:
 *           type: string
 *           enum: [order, product, inquiry, promotion, none]
 *           description: 관련 객체 유형
 *           nullable: true
 *         actionUrl:
 *           type: string
 *           description: 알림 클릭 시 이동할 URL
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 알림 생성 시간
 *       example:
 *         id: 1
 *         userId: 123
 *         type: order_status
 *         title: 주문 처리 중
 *         message: 주문(23080512345)이 처리 중입니다.
 *         isRead: false
 *         targetId: 45
 *         targetType: order
 *         actionUrl: /mypage/orders/45
 *         createdAt: 2023-03-15T09:30:00Z
 *
 *     PromotionNotificationRequest:
 *       type: object
 *       required:
 *         - title
 *         - message
 *       properties:
 *         title:
 *           type: string
 *           description: 알림 제목 (255자 이내)
 *         message:
 *           type: string
 *           description: 알림 내용
 *         actionUrl:
 *           type: string
 *           description: 알림 클릭 시 이동할 URL
 *       example:
 *         title: 신상품 출시 안내
 *         message: 봄맞이 신상품이 출시되었습니다. 지금 바로 확인해보세요!
 *         actionUrl: /promotions/spring-new
 */

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: 내 알림 목록 조회
 *     description: 사용자의 알림 목록을 조회합니다.
 *     tags: [Notifications]
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
 *           default: 20
 *         description: 페이지당 항목 수
 *     responses:
 *       200:
 *         description: 알림 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 notifications:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notification'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 25
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 20
 *                     pages:
 *                       type: integer
 *                       example: 2
 *       401:
 *         description: 인증 실패
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /notifications/count:
 *   get:
 *     summary: 읽지 않은 알림 수 조회
 *     description: 사용자의 읽지 않은 알림 개수를 조회합니다.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 알림 개수 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 5
 *       401:
 *         description: 인증 실패
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /notifications/{id}/read:
 *   patch:
 *     summary: 알림 읽음 처리
 *     description: 특정 알림을 읽음 상태로 변경합니다.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 알림 ID
 *     responses:
 *       200:
 *         description: 알림 읽음 처리 성공
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
 *                   example: 알림이 읽음 처리되었습니다.
 *                 unreadCount:
 *                   type: integer
 *                   example: 4
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 알림을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /notifications/read-all:
 *   patch:
 *     summary: 모든 알림 읽음 처리
 *     description: 사용자의 모든 알림을 읽음 상태로 변경합니다.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 모든 알림 읽음 처리 성공
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
 *                   example: 모든 알림이 읽음 처리되었습니다.
 *                 unreadCount:
 *                   type: integer
 *                   example: 0
 *       401:
 *         description: 인증 실패
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /notifications/{id}:
 *   delete:
 *     summary: 알림 삭제
 *     description: 특정 알림을 삭제합니다.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 알림 ID
 *     responses:
 *       200:
 *         description: 알림 삭제 성공
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
 *                   example: 알림이 삭제되었습니다.
 *                 unreadCount:
 *                   type: integer
 *                   example: 4
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 알림을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /notifications/admin/promotion:
 *   post:
 *     summary: 프로모션 알림 전송 (관리자 전용)
 *     description: 모든 사용자 또는 지정된 사용자 그룹에게 프로모션 알림을 전송합니다.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PromotionNotificationRequest'
 *     responses:
 *       200:
 *         description: 알림 전송 성공
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
 *                   example: 512명의 사용자에게 프로모션 알림이 발송되었습니다.
 *                 sentCount:
 *                   type: integer
 *                   example: 512
 *       400:
 *         description: 유효하지 않은 요청 데이터
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 없음 (관리자가 아님)
 *       500:
 *         description: 서버 오류
 */
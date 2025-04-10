/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: 채팅 관련 API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ChatSummary:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 채팅 ID
 *         subject:
 *           type: string
 *           description: 채팅 제목
 *         status:
 *           type: string
 *           enum: [pending, in_progress, closed]
 *           description: 채팅 상태
 *         userId:
 *           type: integer
 *           description: 사용자 ID
 *         adminId:
 *           type: integer
 *           description: 담당 관리자 ID
 *           nullable: true
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 *             email:
 *               type: string
 *         admin:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 채팅 생성 일시
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: 채팅 업데이트 일시
 *         messages:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ChatMessage'
 *           description: 최근 메시지 (1개)
 *         unreadCount:
 *           type: integer
 *           description: 읽지 않은 메시지 수
 *       example:
 *         id: 1
 *         subject: '주문 관련 문의'
 *         status: 'pending'
 *         userId: 42
 *         adminId: 5
 *         user:
 *           id: 42
 *           name: '홍길동'
 *           email: 'user@example.com'
 *         admin:
 *           id: 5
 *           name: '관리자'
 *         createdAt: '2025-03-10T09:15:00.000Z'
 *         updatedAt: '2025-03-10T09:30:00.000Z'
 *         messages:
 *           - id: 123
 *             message: '상품 배송이 언제 되나요?'
 *             senderId: 42
 *             isRead: true
 *             createdAt: '2025-03-10T09:30:00.000Z'
 *         unreadCount: 0
 *
 *     ChatDetail:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 채팅 ID
 *         subject:
 *           type: string
 *           description: 채팅 제목
 *         status:
 *           type: string
 *           enum: [pending, in_progress, closed]
 *           description: 채팅 상태
 *         userId:
 *           type: integer
 *           description: 사용자 ID
 *         adminId:
 *           type: integer
 *           description: 담당 관리자 ID
 *           nullable: true
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 *             email:
 *               type: string
 *         admin:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 채팅 생성 일시
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: 채팅 업데이트 일시
 *         totalMessages:
 *           type: integer
 *           description: 총 메시지 수
 *       example:
 *         id: 1
 *         subject: '주문 관련 문의'
 *         status: 'in_progress'
 *         userId: 42
 *         adminId: 5
 *         user:
 *           id: 42
 *           name: '홍길동'
 *           email: 'user@example.com'
 *         admin:
 *           id: 5
 *           name: '관리자'
 *         createdAt: '2025-03-10T09:15:00.000Z'
 *         updatedAt: '2025-03-10T09:30:00.000Z'
 *         totalMessages: 5
 *
 *     ChatMessage:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 메시지 ID
 *         chatId:
 *           type: integer
 *           description: 채팅 ID
 *         message:
 *           type: string
 *           description: 메시지 내용
 *         senderId:
 *           type: integer
 *           description: 발신자 ID
 *         sender:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 *             role:
 *               type: string
 *               enum: [customer, admin]
 *         isSystem:
 *           type: boolean
 *           description: 시스템 메시지 여부
 *         isRead:
 *           type: boolean
 *           description: 읽음 여부
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 메시지 생성 시간
 *       example:
 *         id: 123
 *         chatId: 1
 *         message: '안녕하세요, 주문 관련 문의 드립니다.'
 *         senderId: 42
 *         sender:
 *           id: 42
 *           name: '홍길동'
 *           role: 'customer'
 *         isSystem: false
 *         isRead: false
 *         createdAt: '2025-03-10T09:15:00.000Z'
 *     
 *     CreateChatInput:
 *       type: object
 *       required:
 *         - subject
 *         - initialMessage
 *       properties:
 *         subject:
 *           type: string
 *           description: 채팅 제목
 *         initialMessage:
 *           type: string
 *           description: 첫 메시지 내용
 *       example:
 *         subject: '상품 배송 문의'
 *         initialMessage: '주문한 상품의 배송이 언제 되는지 궁금합니다.'
 *
 *     SendMessageInput:
 *       type: object
 *       required:
 *         - content
 *       properties:
 *         content:
 *           type: string
 *           description: 메시지 내용
 *       example:
 *         content: '안녕하세요, 언제 배송되나요?'
 *
 *     UpdateChatStatusInput:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [pending, in_progress, closed]
 *           description: 채팅 상태
 *       example:
 *         status: 'closed'
 *
 *     AssignChatInput:
 *       type: object
 *       required:
 *         - adminId
 *       properties:
 *         adminId:
 *           type: integer
 *           description: 배정할 관리자 ID
 *       example:
 *         adminId: 5
 *
 *     ChatSocketEvents:
 *       type: object
 *       properties:
 *         event:
 *           type: string
 *           description: 소켓 이벤트 이름
 *         description:
 *           type: string
 *           description: 이벤트 설명
 *         payload:
 *           type: object
 *           description: 이벤트 데이터 형식
 *       example:
 *         event: 'join_chat'
 *         description: '채팅방 참여 이벤트'
 *         payload: { chatId: 1 }
 */

/**
 * @swagger
 * /chats/my:
 *   get:
 *     summary: 내 채팅 목록 조회
 *     description: 로그인한 사용자의 채팅 목록을 조회합니다.
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 채팅 목록 조회 성공
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
 *                     $ref: '#/components/schemas/ChatSummary'
 *       401:
 *         description: 인증 실패
 */

/**
 * @swagger
 * /chats/admin:
 *   get:
 *     summary: 모든 채팅 목록 조회 (관리자용)
 *     description: 모든 사용자의 채팅 목록을 조회합니다. 상태로 필터링 가능합니다.
 *     tags: [Chat]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, in_progress, closed]
 *         description: 채팅 상태로 필터링
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 채팅 목록 조회 성공
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
 *                     $ref: '#/components/schemas/ChatSummary'
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 없음 (관리자 아님)
 */

/**
 * @swagger
 * /chats/{id}:
 *   get:
 *     summary: 채팅 상세 조회
 *     description: 채팅의 상세 정보를 조회합니다.
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 채팅 ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 채팅 상세 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/ChatDetail'
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 채팅을 찾을 수 없음
 */

/**
 * @swagger
 * /chats/{id}/messages:
 *   get:
 *     summary: 채팅 메시지 목록 조회
 *     description: 특정 채팅의 메시지 목록을 조회합니다.
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 채팅 ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 메시지 목록 조회 성공
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
 *                     $ref: '#/components/schemas/ChatMessage'
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 채팅을 찾을 수 없음
 */

/**
 * @swagger
 * /chats:
 *   post:
 *     summary: 새 채팅 생성
 *     description: 새로운 채팅을 생성합니다.
 *     tags: [Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateChatInput'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: 채팅 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/ChatDetail'
 *                 message:
 *                   type: string
 *                   example: '채팅이 생성되었습니다.'
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: 인증 실패
 */

/**
 * @swagger
 * /chats/{id}/messages:
 *   post:
 *     summary: 메시지 전송
 *     description: 채팅에 새 메시지를 전송합니다.
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 채팅 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SendMessageInput'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: 메시지 전송 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/ChatMessage'
 *                 message:
 *                   type: string
 *                   example: '메시지가 전송되었습니다.'
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 채팅을 찾을 수 없음
 */

/**
 * @swagger
 * /chats/{id}/status:
 *   patch:
 *     summary: 채팅 상태 변경
 *     description: 채팅의 상태를 변경합니다.
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 채팅 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateChatStatusInput'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 채팅 상태 변경 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/ChatDetail'
 *                 message:
 *                   type: string
 *                   example: '채팅 상태가 변경되었습니다.'
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 채팅을 찾을 수 없음
 */

/**
 * @swagger
 * /chats/{id}/assign:
 *   patch:
 *     summary: 관리자 배정 (관리자용)
 *     description: 채팅에 담당 관리자를 배정합니다.
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 채팅 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssignChatInput'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 관리자 배정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/ChatDetail'
 *                 message:
 *                   type: string
 *                   example: '관리자가 배정되었습니다.'
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 없음 (관리자 아님)
 *       404:
 *         description: 채팅을 찾을 수 없음
 */

/**
 * @swagger
 * /chats/cleanup:
 *   post:
 *     summary: 오래된 채팅 정리 (관리자용)
 *     description: 30일 이상 지난 종료된 채팅을 정리합니다.
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 채팅 정리 성공
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
 *                     cleanedCount:
 *                       type: integer
 *                       example: 5
 *                 message:
 *                   type: string
 *                   example: '5개의 오래된 채팅이 정리되었습니다.'
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 없음 (관리자 아님)
 */

/**
 * @swagger
 * /chats/unread-count:
 *   get:
 *     summary: 읽지 않은 메시지 수 조회
 *     description: 현재 사용자의 읽지 않은 메시지 수를 조회합니다.
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 읽지 않은 메시지 수 조회 성공
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
 *                     unreadCount:
 *                       type: integer
 *                       example: 3
 *       401:
 *         description: 인증 실패
 */

/**
 * @swagger
 * /chats/socket-events:
 *   get:
 *     summary: 소켓 이벤트 목록
 *     description: 채팅 소켓 이벤트 목록과 설명을 조회합니다. 실제 API 엔드포인트는 아닙니다.
 *     tags: [Chat]
 *     responses:
 *       200:
 *         description: 소켓 이벤트 목록
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 clientToServer:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ChatSocketEvents'
 *                   example:
 *                     - event: 'join_chat'
 *                       description: '채팅방 참여'
 *                       payload: { chatId: 1 }
 *                     - event: 'send_message'
 *                       description: '메시지 전송'
 *                       payload: { chatId: 1, message: '안녕하세요?' }
 *                     - event: 'admin_join_chat'
 *                       description: '관리자 채팅 참여'
 *                       payload: { chatId: 1 }
 *                     - event: 'close_chat'
 *                       description: '채팅 종료'
 *                       payload: { chatId: 1 }
 *                     - event: 'typing'
 *                       description: '타이핑 상태 전송'
 *                       payload: { chatId: 1, isTyping: true }
 *                 serverToClient:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ChatSocketEvents'
 *                   example:
 *                     - event: 'chat_history'
 *                       description: '채팅 기록 전송'
 *                       payload: [{ id: 1, message: '안녕하세요', ... }]
 *                     - event: 'new_message'
 *                       description: '새 메시지 수신'
 *                       payload: { id: 2, message: '무엇을 도와드릴까요?', ... }
 *                     - event: 'chat_closed'
 *                       description: '채팅 종료 알림'
 *                       payload: { chatId: 1 }
 *                     - event: 'active_chats'
 *                       description: '활성 채팅 목록'
 *                       payload: [{ id: 1, subject: '주문 문의', ... }]
 *                     - event: 'user_typing'
 *                       description: '사용자 타이핑 상태'
 *                       payload: { chatId: 1, userId: 5, isTyping: true }
 */
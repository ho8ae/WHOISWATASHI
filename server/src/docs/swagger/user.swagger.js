/**
 * @swagger
 * tags:
 *   name: Users
 *   description: 사용자 프로필 관리 API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserProfile:
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
 *         birthYear:
 *           type: integer
 *           description: 생년
 *           nullable: true
 *         birthMonth:
 *           type: integer
 *           description: 생월
 *           nullable: true
 *         birthDay:
 *           type: integer
 *           description: 생일
 *           nullable: true
 *         isSolarCalendar:
 *           type: boolean
 *           description: 양력 여부
 *           nullable: true
 *         agreeSMS:
 *           type: boolean
 *           description: SMS 수신 동의 여부
 *         role:
 *           type: string
 *           description: 역할
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 가입 일시
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: 정보 수정 일시
 *         addresses:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Address'
 *         orderCount:
 *           type: integer
 *           description: 총 주문 수
 *       example:
 *         id: 1
 *         email: user@example.com
 *         name: 홍길동
 *         phone: "01012345678"
 *         birthYear: 1990
 *         birthMonth: 1
 *         birthDay: 15
 *         isSolarCalendar: true
 *         agreeSMS: true
 *         role: customer
 *         createdAt: "2025-03-09T12:00:00Z"
 *         updatedAt: "2025-03-09T12:00:00Z"
 *         addresses: []
 *         orderCount: 5
 *     
 *     ProfileUpdateInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: 이름
 *         phone:
 *           type: string
 *           description: 연락처
 *         birthYear:
 *           type: integer
 *           description: 생년
 *         birthMonth:
 *           type: integer
 *           description: 생월
 *         birthDay:
 *           type: integer
 *           description: 생일
 *         isSolarCalendar:
 *           type: boolean
 *           description: 양력 여부
 *         agreeSMS:
 *           type: boolean
 *           description: SMS 수신 동의 여부
 *         currentPassword:
 *           type: string
 *           description: 현재 비밀번호 (비밀번호 변경 시 필수)
 *         newPassword:
 *           type: string
 *           description: 새 비밀번호
 *       example:
 *         name: 홍길동
 *         phone: "01098765432"
 *         birthYear: 1990
 *         birthMonth: 1
 *         birthDay: 15
 *         isSolarCalendar: true
 *         agreeSMS: true
 */

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: 사용자 프로필 조회
 *     description: 로그인한 사용자의 프로필 정보와 주소 목록을 조회합니다.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 프로필 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/UserProfile'
 *       401:
 *         description: 인증 실패
 *       500:
 *         description: 서버 오류
 *   
 *   put:
 *     summary: 사용자 프로필 수정
 *     description: 로그인한 사용자의 프로필 정보를 수정합니다.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProfileUpdateInput'
 *     responses:
 *       200:
 *         description: 프로필 수정 성공
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
 *                     phone:
 *                       type: string
 *                     birthYear:
 *                       type: integer
 *                     birthMonth:
 *                       type: integer
 *                     birthDay:
 *                       type: integer
 *                     isSolarCalendar:
 *                       type: boolean
 *                     agreeSMS:
 *                       type: boolean
 *                     role:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                 message:
 *                   type: string
 *                   example: 프로필이 성공적으로 업데이트되었습니다.
 *       400:
 *         description: 잘못된 요청 (유효성 검사 실패)
 *       401:
 *         description: 인증 실패 또는 현재 비밀번호 불일치
 *       500:
 *         description: 서버 오류
 */
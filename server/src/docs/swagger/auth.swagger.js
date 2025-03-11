/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: 사용자 인증 및 계정 관리 API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 사용자 ID
 *         email:
 *           type: string
 *           description: 이메일 주소
 *         name:
 *           type: string
 *           description: 이름
 *         phone:
 *           type: string
 *           description: 전화번호
 *         role:
 *           type: string
 *           description: 사용자 역할(customer, admin)
 *           enum: [customer, admin]
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 계정 생성 일시
 *       example:
 *         id: 1
 *         email: user@example.com
 *         name: 홍길동
 *         phone: "01012345678"
 *         role: customer
 *         createdAt: "2025-03-09T12:00:00Z"
 *     
 *     LoginInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: 사용자 이메일
 *         password:
 *           type: string
 *           format: password
 *           description: 비밀번호
 *       example:
 *         email: user@example.com
 *         password: Password123!
 *     
 *     LoginResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             user:
 *               $ref: '#/components/schemas/User'
 *             accessToken:
 *               type: string
 *               description: JWT 액세스 토큰
 *           example:
 *             user:
 *               id: 1
 *               email: user@example.com
 *               name: 홍길동
 *               role: customer
 *             accessToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *         message:
 *           type: string
 *           example: 로그인에 성공했습니다.
 *     
 *     RegisterInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - passwordConfirm
 *         - name
 *         - phone
 *         - verificationCode
 *         - agreeTerms
 *         - agreePrivacy
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: 이메일 주소
 *         password:
 *           type: string
 *           format: password
 *           description: 비밀번호 (영문 대소문자/숫자/특수문자 중 2가지 이상 조합, 10자~16자)
 *         passwordConfirm:
 *           type: string
 *           format: password
 *           description: 비밀번호 확인
 *         name:
 *           type: string
 *           description: 이름
 *         phone:
 *           type: string
 *           description: 휴대전화 번호
 *         verificationCode:
 *           type: string
 *           description: SMS 인증번호
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
 *           description: 양력 여부 (true=양력, false=음력)
 *         agreeTerms:
 *           type: boolean
 *           description: 이용약관 동의
 *         agreePrivacy:
 *           type: boolean
 *           description: 개인정보 수집 및 이용 동의
 *         agreeSMS:
 *           type: boolean
 *           description: SMS 수신 동의
 *       example:
 *         email: user@example.com
 *         password: Password123!
 *         passwordConfirm: Password123!
 *         name: 홍길동
 *         phone: "01012345678"
 *         verificationCode: "123456"
 *         birthYear: 1990
 *         birthMonth: 1
 *         birthDay: 1
 *         isSolarCalendar: true
 *         agreeTerms: true
 *         agreePrivacy: true
 *         agreeSMS: false
 *     
 *     VerificationRequest:
 *       type: object
 *       required:
 *         - phone
 *       properties:
 *         phone:
 *           type: string
 *           description: 휴대전화 번호
 *       example:
 *         phone: "01012345678"
 *     
 *     VerificationVerify:
 *       type: object
 *       required:
 *         - phone
 *         - code
 *       properties:
 *         phone:
 *           type: string
 *           description: 휴대전화 번호
 *         code:
 *           type: string
 *           description: 인증번호
 *       example:
 *         phone: "01012345678"
 *         code: "123456"
 *     
 *     PasswordResetRequest:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: 이메일 주소
 *       example:
 *         email: user@example.com
 *     
 *     TokenVerifyRequest:
 *       type: object
 *       required:
 *         - email
 *         - token
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: 이메일 주소
 *         token:
 *           type: string
 *           description: 재설정 토큰
 *       example:
 *         email: user@example.com
 *         token: "abcdef123456"
 *     
 *     PasswordResetInput:
 *       type: object
 *       required:
 *         - userId
 *         - resetId
 *         - password
 *       properties:
 *         userId:
 *           type: integer
 *           description: 사용자 ID
 *         resetId:
 *           type: integer
 *           description: 재설정 요청 ID
 *         password:
 *           type: string
 *           format: password
 *           description: 새 비밀번호
 *       example:
 *         userId: 1
 *         resetId: 2
 *         password: NewPassword123!
 *     
 *     RefreshTokenRequest:
 *       type: object
 *       required:
 *         - refreshToken
 *       properties:
 *         refreshToken:
 *           type: string
 *           description: 리프레시 토큰
 *       example:
 *         refreshToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: 회원가입
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: 회원가입 성공
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
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     accessToken:
 *                       type: string
 *                 message:
 *                   type: string
 *                   example: 회원가입이 성공적으로 완료되었습니다.
 *       400:
 *         description: 입력 데이터 오류
 *       409:
 *         description: 이미 존재하는 이메일
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: 로그인
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: 입력 데이터 오류
 *       401:
 *         description: 인증 실패
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: 로그아웃
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: 로그아웃 성공
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
 *                   example: 로그아웃되었습니다.
 */

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: 토큰 갱신
 *     description: 리프레시 토큰을 사용하여 새 액세스 토큰을 발급받습니다. (쿠키에 저장된 리프레시 토큰을 사용하거나 요청 본문에 포함)
 *     tags: [Authentication]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshTokenRequest'
 *     responses:
 *       200:
 *         description: 토큰 갱신 성공
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
 *                     accessToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: 리프레시 토큰 유효하지 않음
 */

/**
 * @swagger
 * /auth/send-verification:
 *   post:
 *     summary: 인증번호 발송
 *     description: 휴대전화번호로 인증번호를 발송합니다.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerificationRequest'
 *     responses:
 *       200:
 *         description: 인증번호 발송 성공
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
 *                   example: 인증번호가 발송되었습니다.
 *       400:
 *         description: 입력 데이터 오류
 */

/**
 * @swagger
 * /auth/verify-code:
 *   post:
 *     summary: 인증번호 확인
 *     description: 발송된 인증번호를 확인합니다.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerificationVerify'
 *     responses:
 *       200:
 *         description: 인증번호 확인 성공
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
 *                   example: 인증이 완료되었습니다.
 *       400:
 *         description: 인증번호 불일치 또는 만료
 */

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: 현재 사용자 정보 조회
 *     description: 로그인한 사용자의 정보를 조회합니다.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 사용자 정보 조회 성공
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
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         description: 인증 실패
 */

/**
 * @swagger
 * /auth/request-reset:
 *   post:
 *     summary: 비밀번호 재설정 요청
 *     description: 비밀번호 재설정 이메일을 발송합니다.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PasswordResetRequest'
 *     responses:
 *       200:
 *         description: 비밀번호 재설정 이메일 발송 성공
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
 *                   example: 비밀번호 재설정 안내가 이메일로 발송되었습니다.
 *       400:
 *         description: 입력 데이터 오류
 */

/**
 * @swagger
 * /auth/verify-reset-token:
 *   post:
 *     summary: 비밀번호 재설정 토큰 검증
 *     description: 이메일로 발송된 비밀번호 재설정 토큰을 검증합니다.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TokenVerifyRequest'
 *     responses:
 *       200:
 *         description: 토큰 검증 성공
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
 *                     userId:
 *                       type: integer
 *                       example: 1
 *                     resetId:
 *                       type: integer
 *                       example: 2
 *       400:
 *         description: 입력 데이터 오류
 *       401:
 *         description: 유효하지 않은 토큰
 */

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: 새 비밀번호 설정
 *     description: 비밀번호 재설정 토큰 검증 후 새 비밀번호를 설정합니다.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PasswordResetInput'
 *     responses:
 *       200:
 *         description: 비밀번호 재설정 성공
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
 *                   example: 비밀번호가 성공적으로 재설정되었습니다.
 *       400:
 *         description: 입력 데이터 오류
 *       401:
 *         description: 유효하지 않은 요청
 */
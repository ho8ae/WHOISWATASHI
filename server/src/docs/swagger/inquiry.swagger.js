/**
 * @swagger
 * tags:
 *   name: Inquiries
 *   description: 문의 게시판 관리 API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Inquiry:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 문의 ID
 *         userId:
 *           type: integer
 *           description: 작성자 ID (회원인 경우)
 *           nullable: true
 *         email:
 *           type: string
 *           description: 작성자 이메일
 *         name:
 *           type: string
 *           description: 작성자 이름
 *         title:
 *           type: string
 *           description: 제목
 *         content:
 *           type: string
 *           description: 내용
 *         isPrivate:
 *           type: boolean
 *           description: 비공개 여부
 *         status:
 *           type: string
 *           enum: [pending, answered, closed]
 *           description: 문의 상태
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 작성 일시
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: 최종 수정 일시
 *       example:
 *         id: 1
 *         userId: 123
 *         email: user@example.com
 *         name: 홍길동
 *         title: 배송 관련 문의
 *         content: 주문한 상품이 아직 발송되지 않았습니다. 확인 부탁드립니다.
 *         isPrivate: true
 *         status: pending
 *         createdAt: 2023-03-15T09:30:00Z
 *         updatedAt: 2023-03-15T09:30:00Z
 *
 *     InquiryAnswer:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 답변 ID
 *         inquiryId:
 *           type: integer
 *           description: 문의 ID
 *         adminId:
 *           type: integer
 *           description: 관리자 ID
 *         content:
 *           type: string
 *           description: 답변 내용
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 작성 일시
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: 최종 수정 일시
 *         admin:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 *       example:
 *         id: 1
 *         inquiryId: 1
 *         adminId: 456
 *         content: 안녕하세요. 주문하신 상품은 현재 출고 준비 중입니다. 내일 발송될 예정입니다.
 *         createdAt: 2023-03-15T10:30:00Z
 *         updatedAt: 2023-03-15T10:30:00Z
 *         admin:
 *           id: 456
 *           name: 관리자
 *
 *     InquiryWithAnswers:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 문의 ID
 *         userId:
 *           type: integer
 *           description: 작성자 ID (회원인 경우)
 *           nullable: true
 *         email:
 *           type: string
 *           description: 작성자 이메일
 *         name:
 *           type: string
 *           description: 작성자 이름
 *         title:
 *           type: string
 *           description: 제목
 *         content:
 *           type: string
 *           description: 내용
 *         isPrivate:
 *           type: boolean
 *           description: 비공개 여부
 *         status:
 *           type: string
 *           enum: [pending, answered, closed]
 *           description: 문의 상태
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 작성 일시
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: 최종 수정 일시
 *         answers:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/InquiryAnswer'
 *           description: 답변 목록
 *       example:
 *         id: 1
 *         userId: 123
 *         email: user@example.com
 *         name: 홍길동
 *         title: 배송 관련 문의
 *         content: 주문한 상품이 아직 발송되지 않았습니다. 확인 부탁드립니다.
 *         isPrivate: true
 *         status: answered
 *         createdAt: 2023-03-15T09:30:00Z
 *         updatedAt: 2023-03-15T10:30:00Z
 *         answers:
 *           - id: 1
 *             inquiryId: 1
 *             adminId: 456
 *             content: 안녕하세요. 주문하신 상품은 현재 출고 준비 중입니다. 내일 발송될 예정입니다.
 *             createdAt: 2023-03-15T10:30:00Z
 *             updatedAt: 2023-03-15T10:30:00Z
 *             admin:
 *               id: 456
 *               name: 관리자
 *
 *     CreateInquiryRequest:
 *       type: object
 *       required:
 *         - title
 *         - content
 *       properties:
 *         title:
 *           type: string
 *           description: 제목
 *           minLength: 2
 *           maxLength: 255
 *         content:
 *           type: string
 *           description: 내용
 *           minLength: 10
 *         isPrivate:
 *           type: boolean
 *           description: 비공개 여부
 *           default: false
 *         email:
 *           type: string
 *           format: email
 *           description: 이메일 (비회원인 경우 필수)
 *         name:
 *           type: string
 *           description: 이름 (비회원인 경우 필수)
 *         password:
 *           type: string
 *           description: 비밀번호 (비회원 & 비공개글인 경우 필수)
 *           minLength: 4
 *       example:
 *         title: 배송 관련 문의
 *         content: 주문한 상품이 아직 발송되지 않았습니다. 확인 부탁드립니다.
 *         isPrivate: true
 * 
 *     UpdateInquiryRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: 제목
 *           minLength: 2
 *           maxLength: 255
 *         content:
 *           type: string
 *           description: 내용
 *           minLength: 10
 *         isPrivate:
 *           type: boolean
 *           description: 비공개 여부
 *         password:
 *           type: string
 *           description: 비밀번호 (비회원 글 수정 시 필요)
 *           minLength: 4
 *       example:
 *         title: 배송 관련 문의(수정됨)
 *         content: 주문한 상품이 아직 발송되지 않았습니다. 빠른 처리 부탁드립니다.
 *         isPrivate: true
 *
 *     InquiryAnswerRequest:
 *       type: object
 *       required:
 *         - content
 *       properties:
 *         content:
 *           type: string
 *           description: 답변 내용
 *           minLength: 10
 *       example:
 *         content: 안녕하세요. 주문하신 상품은 현재 출고 준비 중입니다. 내일 발송될 예정입니다.
 *
 *     UpdateStatusRequest:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [pending, answered, closed]
 *           description: 변경할 상태
 *       example:
 *         status: closed
 *
 *     AccessPrivateRequest:
 *       type: object
 *       required:
 *         - password
 *       properties:
 *         password:
 *           type: string
 *           description: 비공개글 접근 비밀번호
 *           minLength: 4
 *       example:
 *         password: "1234"
 */

/**
 * @swagger
 * /inquiries:
 *   post:
 *     summary: 문의글 작성
 *     description: 새로운 문의글을 작성합니다. 비회원도 작성 가능합니다.
 *     tags: [Inquiries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateInquiryRequest'
 *     responses:
 *       201:
 *         description: 문의글 작성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Inquiry'
 *                 message:
 *                   type: string
 *                   example: 문의글이 등록되었습니다.
 *       400:
 *         description: 유효하지 않은 요청 데이터
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                       message:
 *                         type: string
 *       401:
 *         description: 인증 실패
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /inquiries/my:
 *   get:
 *     summary: 내 문의글 목록 조회
 *     description: 로그인한 사용자 본인이 작성한 문의글 목록을 조회합니다.
 *     tags: [Inquiries]
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
 *         description: 문의글 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 inquiries:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Inquiry'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 15
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
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
 * /inquiries/admin:
 *   get:
 *     summary: 모든 문의글 목록 조회 (관리자용)
 *     description: 관리자가 모든 문의글 목록을 조회합니다. 필터링 및 정렬 기능을 지원합니다.
 *     tags: [Inquiries]
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
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, answered, closed]
 *         description: 상태 필터
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: 검색어 (제목, 내용, 이름, 이메일)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, title]
 *           default: createdAt
 *         description: 정렬 기준
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: 정렬 방향
 *     responses:
 *       200:
 *         description: 문의글 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 inquiries:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Inquiry'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 50
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 20
 *                     pages:
 *                       type: integer
 *                       example: 3
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 없음
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /inquiries/{id}:
 *   get:
 *     summary: 문의글 상세 조회
 *     description: ID로 문의글 상세 정보를 조회합니다. 비공개 글인 경우 작성자나 관리자만 접근 가능합니다.
 *     tags: [Inquiries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 문의글 ID
 *     responses:
 *       200:
 *         description: 문의글 상세 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/InquiryWithAnswers'
 *       403:
 *         description: 비공개 글 접근 권한 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: 비공개 글은 비밀번호가 필요합니다.
 *                 requirePassword:
 *                   type: boolean
 *                   example: true
 *       404:
 *         description: 문의글을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 *
 *   put:
 *     summary: 문의글 수정
 *     description: 문의글을 수정합니다. 작성자만 수정 가능합니다.
 *     tags: [Inquiries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 문의글 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateInquiryRequest'
 *     responses:
 *       200:
 *         description: 문의글 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Inquiry'
 *                 message:
 *                   type: string
 *                   example: 문의글이 수정되었습니다.
 *       400:
 *         description: 유효하지 않은 요청 데이터
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 수정 권한 없음
 *       404:
 *         description: 문의글을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 *
 *   delete:
 *     summary: 문의글 삭제
 *     description: 문의글을 삭제합니다. 작성자나 관리자만 삭제 가능합니다.
 *     tags: [Inquiries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 문의글 ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: 비회원 글 삭제 시 필요한 비밀번호
 *     responses:
 *       200:
 *         description: 문의글 삭제 성공
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
 *                   example: 문의글이 삭제되었습니다.
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 삭제 권한 없음
 *       404:
 *         description: 문의글을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /inquiries/{id}/access:
 *   post:
 *     summary: 비공개 문의글 접근
 *     description: 비밀번호를 이용하여 비공개 문의글에 접근합니다.
 *     tags: [Inquiries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 문의글 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AccessPrivateRequest'
 *     responses:
 *       200:
 *         description: 비공개 문의글 접근 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/InquiryWithAnswers'
 *       400:
 *         description: 유효하지 않은 요청 데이터
 *       403:
 *         description: 비밀번호 불일치
 *       404:
 *         description: 문의글을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /inquiries/admin/{id}/answer:
 *   post:
 *     summary: 문의글 답변 작성 (관리자용)
 *     description: 관리자가 문의글에 답변을 작성합니다.
 *     tags: [Inquiries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 문의글 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InquiryAnswerRequest'
 *     responses:
 *       201:
 *         description: 답변 작성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/InquiryAnswer'
 *                 message:
 *                   type: string
 *                   example: 답변이 등록되었습니다.
 *       400:
 *         description: 유효하지 않은 요청 데이터
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 없음 (관리자가 아님)
 *       404:
 *         description: 문의글을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /inquiries/admin/answer/{answerId}:
 *   put:
 *     summary: 답변 수정 (관리자용)
 *     description: 관리자가 자신이 작성한 답변을 수정합니다.
 *     tags: [Inquiries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: answerId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 답변 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InquiryAnswerRequest'
 *     responses:
 *       200:
 *         description: 답변 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/InquiryAnswer'
 *                 message:
 *                   type: string
 *                   example: 답변이 수정되었습니다.
 *       400:
 *         description: 유효하지 않은 요청 데이터
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 없음 (관리자가 아니거나 본인이 작성한 답변이 아님)
 *       404:
 *         description: 답변을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /inquiries/admin/{id}/status:
 *   patch:
 *     summary: 문의글 상태 변경 (관리자용)
 *     description: 관리자가 문의글의 상태를 변경합니다.
 *     tags: [Inquiries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 문의글 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateStatusRequest'
 *     responses:
 *       200:
 *         description: 상태 변경 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Inquiry'
 *                 message:
 *                   type: string
 *                   example: 문의글 상태가 변경되었습니다.
 *       400:
 *         description: 유효하지 않은 요청 데이터
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 권한 없음 (관리자가 아님)
 *       404:
 *         description: 문의글을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
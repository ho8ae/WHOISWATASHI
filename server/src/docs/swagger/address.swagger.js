/**
 * @swagger
 * tags:
 *   name: Addresses
 *   description: 사용자 주소 관리 API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Address:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 주소 ID
 *         userId:
 *           type: integer
 *           description: 사용자 ID
 *         name:
 *           type: string
 *           description: 주소 별칭 
 *           example: 집,회사
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
 *           nullable: true
 *         phone:
 *           type: string
 *           description: 연락처
 *           nullable: true
 *         isDefault:
 *           type: boolean
 *           description: 기본 주소 여부
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
 *         userId: 1
 *         name: 집
 *         recipient: 홍길동
 *         postalCode: "12345"
 *         address1: 서울시 강남구 테헤란로 123
 *         address2: 456호
 *         phone: "01012345678"
 *         isDefault: true
 *         createdAt: "2025-03-09T12:00:00Z"
 *         updatedAt: "2025-03-09T12:00:00Z"
 *     
 *     AddressInput:
 *       type: object
 *       required:
 *         - name
 *         - recipient
 *         - postalCode
 *         - address1
 *       properties:
 *         name:
 *           type: string
 *           description: 주소 별칭 
 *           example: 집, 회사
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
 *       example:
 *         name: 회사
 *         recipient: 홍길동
 *         postalCode: "54321"
 *         address1: 서울시 서초구 서초대로 123
 *         address2: 789호
 *         phone: "01098765432"
 *         isDefault: false
 *     
 *     AddressUpdateInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: 주소 별칭 
 *           example: 집, 회사
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
 *       example:
 *         name: 본가
 *         recipient: 홍길동
 *         address2: 202호
 *         isDefault: true
 */

/**
 * @swagger
 * /addresses:
 *   get:
 *     summary: 주소 목록 조회
 *     description: 로그인한 사용자의 저장된 주소 목록을 조회합니다.
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 주소 목록 조회 성공
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
 *                     $ref: '#/components/schemas/Address'
 *       401:
 *         description: 인증 실패
 *       500:
 *         description: 서버 오류
 *   
 *   post:
 *     summary: 주소 추가
 *     description: 새로운 배송지 주소를 추가합니다.
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddressInput'
 *     responses:
 *       201:
 *         description: 주소 추가 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Address'
 *                 message:
 *                   type: string
 *                   example: 배송지가 성공적으로 추가되었습니다.
 *       400:
 *         description: 잘못된 요청 (유효성 검사 실패)
 *       401:
 *         description: 인증 실패
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /addresses/{id}:
 *   get:
 *     summary: 주소 상세 조회
 *     description: 특정 주소의 상세 정보를 조회합니다.
 *     tags: [Addresses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 주소 ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 주소 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Address'
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 접근 권한 없음
 *       404:
 *         description: 주소를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 *   
 *   put:
 *     summary: 주소 수정
 *     description: 특정 주소 정보를 수정합니다.
 *     tags: [Addresses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 주소 ID
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddressUpdateInput'
 *     responses:
 *       200:
 *         description: 주소 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Address'
 *                 message:
 *                   type: string
 *                   example: 배송지가 성공적으로 수정되었습니다.
 *       400:
 *         description: 잘못된 요청 (유효성 검사 실패)
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 접근 권한 없음
 *       404:
 *         description: 주소를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 *   
 *   delete:
 *     summary: 주소 삭제
 *     description: 특정 주소를 삭제합니다.
 *     tags: [Addresses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 주소 ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 주소 삭제 성공
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
 *                   example: 배송지가 삭제되었습니다.
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 접근 권한 없음
 *       404:
 *         description: 주소를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /addresses/{id}/default:
 *   patch:
 *     summary: 기본 주소 설정
 *     description: 특정 주소를 기본 배송지로 설정합니다.
 *     tags: [Addresses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 주소 ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 기본 주소 설정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Address'
 *                 message:
 *                   type: string
 *                   example: 기본 배송지로 설정되었습니다.
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 접근 권한 없음
 *       404:
 *         description: 주소를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
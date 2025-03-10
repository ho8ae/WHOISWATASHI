const nodemailer = require('nodemailer');

// 이메일 전송을 위한 트랜스포터 생성
let transporter;

// 개발 환경에서는 Ethereal 테스트 계정 사용, 프로덕션에서는 실제 SMTP 설정 사용
if (process.env.NODE_ENV !== 'production') {
  // 개발 환경용 테스트 계정 (메일 전송 테스트 가능, 실제 배달은 안됨)
  nodemailer.createTestAccount().then(testAccount => {
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    
    console.log('테스트 이메일 계정 생성됨:', testAccount.user);
  });
} else {
  // 프로덕션 환경 (실제 SMTP 설정)
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
}

/**
 * 이메일 발송 함수
 * @param {Object} options - 이메일 옵션
 * @param {string} options.to - 수신자 이메일
 * @param {string} options.subject - 이메일 제목
 * @param {string} options.text - 텍스트 버전 내용
 * @param {string} options.html - HTML 버전 내용
 * @returns {Promise<Object>} 발송 결과
 */
async function sendEmail(options) {
  try {
    // 기본 발신자 설정
    const from = process.env.EMAIL_FROM || '"쇼핑몰" <no-reply@example.com>';
    
    // 이메일 발송
    const info = await transporter.sendMail({
      from,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html
    });
    
    // 개발 환경에서는 Ethereal 미리보기 URL 로그 출력
    if (process.env.NODE_ENV !== 'production') {
      console.log('이메일 전송 성공:', info.messageId);
      console.log('이메일 미리보기 URL:', nodemailer.getTestMessageUrl(info));
    }
    
    return info;
  } catch (error) {
    console.error('이메일 전송 실패:', error);
    throw new Error('이메일 전송에 실패했습니다.');
  }
}

/**
 * 비밀번호 재설정 이메일 발송
 * @param {string} email - 수신자 이메일
 * @param {string} resetUrl - 비밀번호 재설정 URL
 * @returns {Promise<Object>} 발송 결과
 */
async function sendPasswordResetEmail(email, resetUrl) {
  const subject = '비밀번호 재설정 안내';
  
  const text = `
안녕하세요,

회원님의 계정에 대한 비밀번호 재설정 요청이 접수되었습니다.
비밀번호를 재설정하려면 아래 링크를 클릭하세요:

${resetUrl}

이 링크는 1시간 동안만 유효합니다.
비밀번호 재설정을 요청하지 않으셨다면, 이 메일을 무시하셔도 됩니다.

감사합니다.
쇼핑몰 팀 드림
  `;
  
  const html = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #333;">비밀번호 재설정 안내</h2>
  <p>안녕하세요,</p>
  <p>회원님의 계정에 대한 비밀번호 재설정 요청이 접수되었습니다.</p>
  <p>비밀번호를 재설정하려면 아래 버튼을 클릭하세요:</p>
  
  <div style="text-align: center; margin: 30px 0;">
    <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
      비밀번호 재설정
    </a>
  </div>
  
  <p>또는 아래 링크를 브라우저에 복사하여 붙여넣으세요:</p>
  <p style="word-break: break-all; color: #666;">${resetUrl}</p>
  
  <p>이 링크는 <strong>1시간 동안만 유효</strong>합니다.</p>
  <p>비밀번호 재설정을 요청하지 않으셨다면, 이 메일을 무시하셔도 됩니다.</p>
  
  <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #777; font-size: 12px;">
    <p>감사합니다.</p>
    <p>쇼핑몰 팀 드림</p>
  </div>
</div>
  `;
  
  return await sendEmail({
    to: email,
    subject,
    text,
    html
  });
}

/**
 * 회원가입 환영 이메일 발송
 * @param {string} email - 수신자 이메일
 * @param {string} name - 사용자 이름
 * @returns {Promise<Object>} 발송 결과
 */
async function sendWelcomeEmail(email, name) {
  const subject = '회원가입을 환영합니다!';
  
  const text = `
안녕하세요 ${name}님,

저희 쇼핑몰에 회원가입 해주셔서 감사합니다!
지금부터 다양한 상품을 둘러보고 쇼핑을 즐기실 수 있습니다.

문의 사항이 있으시면 언제든지 고객센터로 연락해주세요.

감사합니다.
쇼핑몰 팀 드림
  `;
  
  const html = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #333;">회원가입을 환영합니다!</h2>
  <p>안녕하세요 <strong>${name}</strong>님,</p>
  <p>저희 쇼핑몰에 회원가입 해주셔서 감사합니다!</p>
  <p>지금부터 다양한 상품을 둘러보고 쇼핑을 즐기실 수 있습니다.</p>
  
  <div style="text-align: center; margin: 30px 0;">
    <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
      쇼핑 시작하기
    </a>
  </div>
  
  <p>문의 사항이 있으시면 언제든지 고객센터로 연락해주세요.</p>
  
  <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #777; font-size: 12px;">
    <p>감사합니다.</p>
    <p>쇼핑몰 팀 드림</p>
  </div>
</div>
  `;
  
  return await sendEmail({
    to: email,
    subject,
    text,
    html
  });
}

module.exports = {
  sendEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail
};
/**
 * 이메일 형식 검증 함수
 * @param {string} email - 검증할 이메일
 * @returns {boolean} 유효한 이메일 여부
 */
export const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };
  
  /**
   * 비밀번호 강도 검증 함수
   * @param {string} password - 검증할 비밀번호
   * @returns {Object} 검증 결과 및 메시지
   */
  export const validatePassword = (password) => {
    const errors = [];
    
    if (!password) {
      return {
        isValid: false,
        message: '비밀번호를 입력해주세요.'
      };
    }
    
    // 최소 길이 검사
    if (password.length < 10 || password.length > 16) {
      errors.push('비밀번호는 10자 ~ 16자로 입력해주세요.');
    }
    
    // 대문자 포함 검사
    if (!/[A-Z]/.test(password)) {
      errors.push('대문자를 포함해야 합니다.');
    }
    
    // 특수문자 포함 검사
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('특수문자를 포함해야 합니다.');
    }
    
    // 숫자 포함 검사
    if (!/\d/.test(password)) {
      errors.push('숫자를 포함해야 합니다.');
    }
    
    return {
      isValid: errors.length === 0,
      message: errors.length > 0 ? errors.join(' ') : ''
    };
  };
  
  /**
   * 비밀번호 일치 검사 함수
   * @param {string} password - 비밀번호
   * @param {string} passwordConfirm - 비밀번호 확인
   * @returns {Object} 검증 결과 및 메시지
   */
  export const validatePasswordMatch = (password, passwordConfirm) => {
    if (!passwordConfirm) {
      return {
        isValid: false,
        message: '비밀번호 확인을 입력해주세요.'
      };
    }
    
    return {
      isValid: password === passwordConfirm,
      message: password !== passwordConfirm ? '비밀번호가 일치하지 않습니다.' : ''
    };
  };
  
  /**
   * 회원가입 폼 전체 검증 함수
   * @param {Object} formData - 검증할 폼 데이터
   * @param {boolean} isVerificationSent - 인증번호 발송 여부
   * @returns {Object} 각 필드별 에러 메시지
   */
  export const validateRegisterForm = (formData, isVerificationSent) => {
    const errors = {};
  
    // 이메일 검증
    if (!formData.email) {
      errors.email = '이메일을 입력해주세요.';
    } else if (!isValidEmail(formData.email)) {
      errors.email = '올바른 이메일 형식이 아닙니다.';
    }
  
    // 비밀번호 검증
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.message;
    }
  
    // 비밀번호 확인 검증
    const passwordMatchValidation = validatePasswordMatch(
      formData.password, 
      formData.passwordConfirm
    );
    if (!passwordMatchValidation.isValid) {
      errors.passwordConfirm = passwordMatchValidation.message;
    }
  
    // 이름 검증
    if (!formData.name) {
      errors.name = '이름을 입력해주세요.';
    }
  
    // 휴대폰 검증
    if (!formData.phone) {
      errors.phone = '휴대폰 번호를 입력해주세요.';
    }
  
    // 인증번호 검증
    if (isVerificationSent && !formData.verificationCode) {
      errors.verificationCode = '인증번호를 입력해주세요.';
    }
  
    // 생년월일 검증
    if (!formData.birthYear || !formData.birthMonth || !formData.birthDay) {
      errors.birth = '생년월일을 모두 입력해주세요.';
    }
  
    // 약관 동의 검증
    if (!formData.agreeTerms) {
      errors.agreeTerms = '이용약관에 동의해주세요.';
    }
    
    if (!formData.agreePrivacy) {
      errors.agreePrivacy = '개인정보 수집 및 이용에 동의해주세요.';
    }
  
    return errors;
  };
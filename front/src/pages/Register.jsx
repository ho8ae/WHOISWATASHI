import React, { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { validateRegisterForm, validatePassword } from '../utils/validation';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    name: '',
    phone: '',
    verificationCode: '',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    isSolarCalendar: true,
    agreeTerms: false,
    agreePrivacy: false,
    agreeSMS: false,
  });

  // useAuth hook 사용
  const { register, isAuthenticated, loading } = useAuth();

  const [errors, setErrors] = useState({});
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const navigate = useNavigate();

  // 로그인 성공 시 홈으로 회원가입 축하 페이지로 이동
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // 패스워드 실시간 검증
  useEffect(() => {
    if (formData.password) {
      const { isValid, message } = validatePassword(formData.password);
      if (!isValid) {
        setErrors(prev => ({ ...prev, password: message }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.password;
          return newErrors;
        });
      }
    }

    // 비밀번호 확인 실시간 검증
    if (formData.password && formData.passwordConfirm && 
        formData.password !== formData.passwordConfirm) {
      setErrors(prev => ({ 
        ...prev, 
        passwordConfirm: '비밀번호가 일치하지 않습니다.' 
      }));
    } else if (formData.passwordConfirm) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.passwordConfirm;
        return newErrors;
      });
    }
  }, [formData.password, formData.passwordConfirm]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // 체크박스인 경우 checked 값을, 생년월일 필드인 경우 정수로 변환, 그 외에는 원래 값을 사용
    const newValue =
      type === 'checkbox'
        ? checked
        : name === 'birthYear' || name === 'birthMonth' || name === 'birthDay'
        ? value === ''
          ? ''
          : parseInt(value, 10)
        : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleRequestVerification = () => {
    if (!formData.phone) {
      setErrors((prev) => ({ ...prev, phone: '휴대폰 번호를 입력해주세요.' }));
      return;
    }

    // 인증번호 요청 로직
    setIsVerificationSent(true);
    alert('인증번호가 발송되었습니다.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 폼 검증
    const validationErrors = validateRegisterForm(formData, isVerificationSent);
    setErrors(validationErrors);
    
    // 에러가
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    
    try {
      await register(formData);
    } catch (err) {
      console.error('회원가입 실패:', err);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white font-sans">
      <div className="text-xl mb-8 text-black">
        Welecome at <span className="font-['NanumBarunpen']">WHOISWATASHI</span>{' '}
        <p className="text-gray-400 text-sm">
          후이즈와타시에 오신걸 환영합니다.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 이메일 */}
        <div className="border-b border-gray-200">
          <div className="flex items-center mb-1">
            <label htmlFor="email" className="w-24 text-sm text-gray-600">
              이메일
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="flex-1 py-2 focus:outline-none"
              placeholder="이메일을 입력해주세요"
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email}</p>
          )}
        </div>

        {/* 비밀번호 */}
        <div className="border-b border-gray-200">
          <div className="flex items-center mb-1">
            <label htmlFor="password" className="w-24 text-sm text-gray-600">
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="flex-1 py-2 focus:outline-none"
              placeholder="비밀번호를 입력해주세요"
            />
          </div>
          {errors.password && (
            <p className="text-xs text-red-500 mt-1">{errors.password}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            비밀번호는 8자 이상, 대문자, 특수문자, 숫자를 포함해야 합니다.
          </p>
        </div>

        {/* 비밀번호 확인 */}
        <div className="border-b border-gray-200">
          <div className="flex items-center mb-1">
            <label
              htmlFor="passwordConfirm"
              className="w-24 text-sm text-gray-600"
            >
              비밀번호 확인
            </label>
            <input
              type="password"
              id="passwordConfirm"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
              className="flex-1 py-2 focus:outline-none"
              placeholder="비밀번호를 다시 입력해주세요"
            />
          </div>
          {errors.passwordConfirm && (
            <p className="text-xs text-red-500 mt-1">
              {errors.passwordConfirm}
            </p>
          )}
        </div>

        {/* 이름 */}
        <div className="border-b border-gray-200">
          <div className="flex items-center mb-1">
            <label htmlFor="name" className="w-24 text-sm text-gray-600">
              이름
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="flex-1 py-2 focus:outline-none"
              placeholder="이름을 입력해주세요"
            />
          </div>
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">{errors.name}</p>
          )}
        </div>

        {/* 휴대폰 */}
        <div className="border-b border-gray-200">
          <div className="flex items-center mb-1">
            <label htmlFor="phone" className="w-24 text-sm text-gray-600">
              휴대폰
            </label>
            <div className="flex-1">
              <div className="flex items-center">
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="flex-1 py-2 focus:outline-none"
                  placeholder="휴대폰 번호를 입력해주세요"
                />
                <button
                  type="button"
                  className="ml-2 text-sm border border-gray-300 px-3 py-1"
                  onClick={handleRequestVerification}
                >
                  인증요청
                </button>
              </div>

              {isVerificationSent && (
                <div className="flex items-center mt-2">
                  <input
                    type="text"
                    id="verificationCode"
                    name="verificationCode"
                    value={formData.verificationCode}
                    onChange={handleChange}
                    className="flex-1 py-2 focus:outline-none border-b border-gray-200"
                    placeholder="인증번호를 입력해주세요"
                  />
                  <button
                    type="button"
                    className="ml-2 text-sm border border-gray-300 px-3 py-1"
                  >
                    확인
                  </button>
                </div>
              )}
            </div>
          </div>
          {errors.phone && (
            <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
          )}
          {errors.verificationCode && (
            <p className="text-xs text-red-500 mt-1">
              {errors.verificationCode}
            </p>
          )}
        </div>

        {/* 생년월일 */}
        <div className="border-b border-gray-200">
          <div className="mb-1">
            <label className="block w-24 text-sm text-gray-600 mb-2">
              생년월일
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="birthYear"
                name="birthYear"
                value={formData.birthYear}
                onChange={handleChange}
                className="w-1/3 py-2 px-2 border border-gray-200 focus:outline-none"
                placeholder="YYYY"
                min="1900"
                max="2023"
              />
              <span className="text-gray-400">년</span>
              <input
                type="number"
                id="birthMonth"
                name="birthMonth"
                value={formData.birthMonth}
                onChange={handleChange}
                className="w-1/4 py-2 px-2 border border-gray-200 focus:outline-none"
                placeholder="MM"
                min="1"
                max="12"
              />
              <span className="text-gray-400">월</span>
              <input
                type="number"
                id="birthDay"
                name="birthDay"
                value={formData.birthDay}
                onChange={handleChange}
                className="w-1/4 py-2 px-2 border border-gray-200 focus:outline-none"
                placeholder="DD"
                min="1"
                max="31"
              />
              <span className="text-gray-400">일</span>
            </div>
            <div className="flex items-center mt-2">
              <label className="inline-flex items-center mr-4">
                <input
                  type="radio"
                  name="isSolarCalendar"
                  checked={formData.isSolarCalendar}
                  onChange={() =>
                    setFormData({ ...formData, isSolarCalendar: true })
                  }
                  className="mr-1"
                />
                <span className="text-sm">양력</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="isSolarCalendar"
                  checked={!formData.isSolarCalendar}
                  onChange={() =>
                    setFormData({ ...formData, isSolarCalendar: false })
                  }
                  className="mr-1"
                />
                <span className="text-sm">음력</span>
              </label>
            </div>
          </div>
          {errors.birth && (
            <p className="text-xs text-red-500 mt-1">{errors.birth}</p>
          )}
        </div>

        {/* 약관 동의 */}
        <div className="pt-4 space-y-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="agreeAll"
              name="agreeAll"
              className="mr-2"
              onChange={() => {
                const allChecked = !(
                  formData.agreeTerms && formData.agreePrivacy
                );
                setFormData({
                  ...formData,
                  agreeTerms: allChecked,
                  agreePrivacy: allChecked,
                  agreeSMS: allChecked,
                });
              }}
              checked={
                formData.agreeTerms &&
                formData.agreePrivacy &&
                formData.agreeSMS
              }
            />
            <label htmlFor="agreeAll" className="text-sm font-medium">
              전체 동의
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="agreeTerms"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="agreeTerms" className="text-sm">
              [필수] 이용약관 동의
            </label>
            <button type="button" className="ml-auto text-xs text-gray-400">
              보기
            </button>
          </div>
          {errors.agreeTerms && (
            <p className="text-xs text-red-500">{errors.agreeTerms}</p>
          )}

          <div className="flex items-center">
            <input
              type="checkbox"
              id="agreePrivacy"
              name="agreePrivacy"
              checked={formData.agreePrivacy}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="agreePrivacy" className="text-sm">
              [필수] 개인정보 수집 및 이용 동의
            </label>
            <button type="button" className="ml-auto text-xs text-gray-400">
              보기
            </button>
          </div>
          {errors.agreePrivacy && (
            <p className="text-xs text-red-500">{errors.agreePrivacy}</p>
          )}

          <div className="flex items-center">
            <input
              type="checkbox"
              id="agreeSMS"
              name="agreeSMS"
              checked={formData.agreeSMS}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="agreeSMS" className="text-sm">
              [선택] SMS 마케팅 정보 수신 동의
            </label>
          </div>
        </div>

        {/* 회원가입 버튼 */}
        <button
          type="submit"
          className="w-full py-3 bg-black text-white font-medium"
          disabled={loading}
        >
          {loading ? '회원가입 중...' : '회원가입'}
        </button>
      </form>
    </div>
  );
};

export default Register;
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useMypage from '../../hooks/useMypage';

const ProfileInfo = () => {
  const {
    profile,
    loading,
    error,
    updateUserProfile,
    resetProfileError
  } = useMypage();

  const [showSuccess, setShowSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  // 프로필 데이터로 폼 초기화
  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name,
        phone: profile.phone,
        birthYear: profile.birthYear,
        birthMonth: profile.birthMonth,
        birthDay: profile.birthDay,
        isSolarCalendar: profile.isSolarCalendar,
        agreeSMS: profile.agreeSMS
      });
    }
  }, [profile, reset]);

  // 프로필 폼 제출
  const onSubmit = async (data) => {
    try {
      await updateUserProfile(data);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setIsEditing(false);
    } catch (err) {
      console.error('프로필 업데이트 오류:', err);
    }
  };

  if (loading.profile) {
    return <div className="text-center py-4">프로필 정보를 불러오는 중...</div>;
  }

  if (!profile) {
    return <div className="text-center py-4">프로필 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">내 정보</h2>
        <button
          type="button"
          className="px-4 py-2 rounded bg-indigo-500 text-white hover:bg-indigo-600 transition"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? '취소' : '정보 수정'}
        </button>
      </div>

      {error.profile && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded" onClick={resetProfileError}>
          {error.profile}
        </div>
      )}

      {showSuccess && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">
          프로필이 성공적으로 업데이트되었습니다.
        </div>
      )}

      {isEditing ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
              <input
                type="text"
                value={profile.email}
                disabled
                className="w-full p-2 bg-gray-100 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
              <input
                type="text"
                {...register('name', { required: '이름을 입력해주세요' })}
                className="w-full p-2 border border-gray-300 rounded"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">연락처</label>
              <input
                type="text"
                {...register('phone', { 
                  required: '연락처를 입력해주세요',
                  pattern: {
                    value: /^[0-9]{10,11}$/,
                    message: '올바른 전화번호 형식이 아닙니다'
                  }
                })}
                className="w-full p-2 border border-gray-300 rounded"
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">생년</label>
                <input
                  type="number"
                  {...register('birthYear', {
                    min: {
                      value: 1900,
                      message: '1900년 이상이어야 합니다'
                    },
                    max: {
                      value: new Date().getFullYear(),
                      message: '현재 연도 이하여야 합니다'
                    }
                  })}
                  className="w-full p-2 border border-gray-300 rounded"
                />
                {errors.birthYear && <p className="text-red-500 text-xs mt-1">{errors.birthYear.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">월</label>
                <input
                  type="number"
                  {...register('birthMonth', {
                    min: {
                      value: 1,
                      message: '1~12 사이여야 합니다'
                    },
                    max: {
                      value: 12,
                      message: '1~12 사이여야 합니다'
                    }
                  })}
                  className="w-full p-2 border border-gray-300 rounded"
                />
                {errors.birthMonth && <p className="text-red-500 text-xs mt-1">{errors.birthMonth.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">일</label>
                <input
                  type="number"
                  {...register('birthDay', {
                    min: {
                      value: 1,
                      message: '1~31 사이여야 합니다'
                    },
                    max: {
                      value: 31,
                      message: '1~31 사이여야 합니다'
                    }
                  })}
                  className="w-full p-2 border border-gray-300 rounded"
                />
                {errors.birthDay && <p className="text-red-500 text-xs mt-1">{errors.birthDay.message}</p>}
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isSolarCalendar"
                {...register('isSolarCalendar')}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="isSolarCalendar" className="ml-2 block text-sm text-gray-700">
                양력
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="agreeSMS"
                {...register('agreeSMS')}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="agreeSMS" className="ml-2 block text-sm text-gray-700">
                SMS 수신 동의
              </label>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                disabled={loading.profile}
              >
                {loading.profile ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">이메일</p>
              <p>{profile.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">이름</p>
              <p>{profile.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">연락처</p>
              <p>{profile.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">생년월일</p>
              <p>
                {profile.birthYear && profile.birthMonth && profile.birthDay
                  ? `${profile.birthYear}년 ${profile.birthMonth}월 ${profile.birthDay}일 (${
                      profile.isSolarCalendar ? '양력' : '음력'
                    })`
                  : '미입력'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">SMS 수신 동의</p>
              <p>{profile.agreeSMS ? '동의함' : '동의하지 않음'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">가입일</p>
              <p>{new Date(profile.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileInfo;
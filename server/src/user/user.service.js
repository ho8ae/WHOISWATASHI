const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

/**
 * 사용자 프로필 조회
 */
async function getUserProfile(userId) {
  const user = await prisma.user.findUnique({
    where: { id: Number(userId) },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      birthYear: true,
      birthMonth: true,
      birthDay: true,
      isSolarCalendar: true,
      agreeSMS: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      addresses: {
        orderBy: {
          isDefault: 'desc' // 기본 주소를 우선 표시
        }
      },
      _count: {
        select: {
          orders: true // 주문 수 계산
        }
      }
    }
  });

  if (!user) {
    throw new Error('사용자를 찾을 수 없습니다.');
  }

  return {
    ...user,
    orderCount: user._count.orders
  };
}

/**
 * 사용자 프로필 수정
 */
async function updateUserProfile(userId, userData) {
  const { currentPassword, newPassword, ...updateData } = userData;

  // 비밀번호 변경이 포함된 경우
  if (newPassword) {
    if (!currentPassword) {
      throw new Error('현재 비밀번호를 입력해주세요.');
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      select: { password: true }
    });

    // 현재 비밀번호 확인
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new Error('현재 비밀번호가 일치하지 않습니다.');
    }

    // 새 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    updateData.password = hashedPassword;
  }

  // 프로필 업데이트
  return await prisma.user.update({
    where: { id: Number(userId) },
    data: updateData,
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      birthYear: true,
      birthMonth: true,
      birthDay: true,
      isSolarCalendar: true,
      agreeSMS: true,
      role: true,
      createdAt: true,
      updatedAt: true
    }
  });
}

module.exports = {
  getUserProfile,
  updateUserProfile
};
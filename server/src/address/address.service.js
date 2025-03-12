const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * 사용자 주소 목록 조회
 */
async function getUserAddresses(userId) {
  return await prisma.address.findMany({
    where: { userId: Number(userId) },
    orderBy: [
      { isDefault: 'desc' },
      { createdAt: 'desc' }
    ]
  });
}

/**
 * 주소 상세 조회
 */
async function getAddressById(id, userId) {
  const address = await prisma.address.findUnique({
    where: { id: Number(id) }
  });

  if (!address) {
    throw new Error('주소를 찾을 수 없습니다.');
  }

  // 주소 소유자 확인
  if (address.userId !== Number(userId)) {
    throw new Error('접근 권한이 없습니다.');
  }

  return address;
}

/**
 * 주소 생성
 */
async function createAddress(userId, addressData) {
  const { isDefault, ...data } = addressData;

  // 트랜잭션으로 처리 (기본 주소 설정 시 기존 기본 주소 해제)
  return await prisma.$transaction(async (tx) => {
    // 기본 주소로 설정하는 경우, 기존 기본 주소 해제
    if (isDefault) {
      await tx.address.updateMany({
        where: {
          userId: Number(userId),
          isDefault: true
        },
        data: { isDefault: false }
      });
    }

    // 신규 주소에 기본값 설정 (첫 주소인 경우 자동으로 기본 주소로 설정)
    const addressCount = await tx.address.count({
      where: { userId: Number(userId) }
    });

    const newAddress = await tx.address.create({
      data: {
        ...data,
        userId: Number(userId),
        isDefault: isDefault || addressCount === 0 // 첫번째 주소 또는 요청에 따라 기본 주소 설정
      }
    });

    return newAddress;
  });
}

/**
 * 주소 수정
 */
async function updateAddress(id, userId, addressData) {
  const { isDefault, ...data } = addressData;

  // 주소 소유자 확인
  const address = await prisma.address.findUnique({
    where: { id: Number(id) }
  });

  if (!address) {
    throw new Error('주소를 찾을 수 없습니다.');
  }

  if (address.userId !== Number(userId)) {
    throw new Error('접근 권한이 없습니다.');
  }

  // 트랜잭션으로 처리
  return await prisma.$transaction(async (tx) => {
    // 기본 주소로 설정하는 경우, 기존 기본 주소 해제
    if (isDefault) {
      await tx.address.updateMany({
        where: {
          userId: Number(userId),
          isDefault: true,
          id: { not: Number(id) } // 현재 수정 중인 주소는 제외
        },
        data: { isDefault: false }
      });
    }

    // 주소 업데이트
    return await tx.address.update({
      where: { id: Number(id) },
      data: {
        ...data,
        isDefault: isDefault !== undefined ? isDefault : address.isDefault
      }
    });
  });
}

/**
 * 주소 삭제
 */
async function deleteAddress(id, userId) {
  // 주소 소유자 확인
  const address = await prisma.address.findUnique({
    where: { id: Number(id) }
  });

  if (!address) {
    throw new Error('주소를 찾을 수 없습니다.');
  }

  if (address.userId !== Number(userId)) {
    throw new Error('접근 권한이 없습니다.');
  }

  // 트랜잭션으로 처리
  return await prisma.$transaction(async (tx) => {
    // 주소 삭제
    await tx.address.delete({
      where: { id: Number(id) }
    });

    // 삭제한 주소가 기본 주소였다면, 새로운 기본 주소 설정
    if (address.isDefault) {
      const firstAddress = await tx.address.findFirst({
        where: { userId: Number(userId) },
        orderBy: { createdAt: 'desc' }
      });

      if (firstAddress) {
        await tx.address.update({
          where: { id: firstAddress.id },
          data: { isDefault: true }
        });
      }
    }

    return { id: Number(id) };
  });
}

/**
 * 기본 주소 설정
 */
async function setDefaultAddress(id, userId) {
  // 주소 소유자 확인
  const address = await prisma.address.findUnique({
    where: { id: Number(id) }
  });

  if (!address) {
    throw new Error('주소를 찾을 수 없습니다.');
  }

  if (address.userId !== Number(userId)) {
    throw new Error('접근 권한이 없습니다.');
  }

  // 트랜잭션으로 처리
  return await prisma.$transaction(async (tx) => {
    // 기존 기본 주소 해제
    await tx.address.updateMany({
      where: {
        userId: Number(userId),
        isDefault: true,
        id: { not: Number(id) }
      },
      data: { isDefault: false }
    });

    // 새로운 기본 주소 설정
    return await tx.address.update({
      where: { id: Number(id) },
      data: { isDefault: true }
    });
  });
}

module.exports = {
  getUserAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
};
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * 모든 옵션 타입 조회
 */
async function getAllOptionTypes() {
  return await prisma.optionType.findMany({
    include: {
      values: {
        orderBy: {
          displayOrder: 'asc'
        }
      }
    },
    orderBy: {
      displayOrder: 'asc'
    }
  });
}

/**
 * ID로 옵션 타입 조회
 */
async function getOptionTypeById(id) {
  return await prisma.optionType.findUnique({
    where: { id: Number(id) },
    include: {
      values: {
        orderBy: {
          displayOrder: 'asc'
        }
      }
    }
  });
}

/**
 * 옵션 타입 생성
 */
async function createOptionType(data) {
  return await prisma.optionType.create({
    data: {
      name: data.name,
      displayOrder: data.displayOrder || 0
    }
  });
}

/**
 * 옵션 타입 수정
 */
async function updateOptionType(id, data) {
  return await prisma.optionType.update({
    where: { id: Number(id) },
    data: {
      name: data.name,
      displayOrder: data.displayOrder
    }
  });
}

/**
 * 옵션 타입 삭제
 */
async function deleteOptionType(id) {
  return await prisma.optionType.delete({
    where: { id: Number(id) }
  });
}

/**
 * 옵션 값 생성
 */
async function createOptionValue(optionTypeId, data) {
  return await prisma.optionValue.create({
    data: {
      optionTypeId: Number(optionTypeId),
      value: data.value,
      displayOrder: data.displayOrder || 0
    }
  });
}

/**
 * 옵션 값 수정
 */
async function updateOptionValue(id, data) {
  return await prisma.optionValue.update({
    where: { id: Number(id) },
    data: {
      value: data.value,
      displayOrder: data.displayOrder
    }
  });
}

/**
 * 옵션 값 삭제
 */
async function deleteOptionValue(id) {
  return await prisma.optionValue.delete({
    where: { id: Number(id) }
  });
}

module.exports = {
  getAllOptionTypes,
  getOptionTypeById,
  createOptionType,
  updateOptionType,
  deleteOptionType,
  createOptionValue,
  updateOptionValue,
  deleteOptionValue
};
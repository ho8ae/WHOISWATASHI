// src/category/category.service.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * 모든 카테고리 조회
 */
async function getAllCategories() {
  return await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: 'asc' }
  });
}

/**
 * 루트 카테고리만 조회 (parentId가 null인 카테고리)
 */
async function getRootCategories() {
  return await prisma.category.findMany({
    where: { 
      isActive: true,
      parentId: null
    },
    orderBy: { displayOrder: 'asc' }
  });
}

/**
 * ID로 카테고리 조회
 */
async function getCategoryById(id) {
  return await prisma.category.findUnique({
    where: { id: Number(id) }
  });
}

/**
 * Slug로 카테고리 조회
 */
async function getCategoryBySlug(slug) {
  return await prisma.category.findUnique({
    where: { slug }
  });
}

/**
 * 하위 카테고리 조회
 */
async function getSubcategories(parentId) {
  return await prisma.category.findMany({
    where: { 
      parentId: Number(parentId),
      isActive: true
    },
    orderBy: { displayOrder: 'asc' }
  });
}

/**
 * 카테고리 생성
 */
async function createCategory(categoryData) {
  return await prisma.category.create({
    data: categoryData
  });
}

/**
 * 카테고리 수정
 */
async function updateCategory(id, categoryData) {
  return await prisma.category.update({
    where: { id: Number(id) },
    data: categoryData
  });
}

/**
 * 카테고리 삭제 (소프트 삭제 - isActive만 false로 변경)
 */
async function deleteCategory(id) {
  return await prisma.category.update({
    where: { id: Number(id) },
    data: { isActive: false }
  });
}

/**
 * 계층 구조로 카테고리 조회
 */
async function getCategoryTree() {
  // 루트 카테고리 조회
  const rootCategories = await getRootCategories();
  
  // 각 루트 카테고리에 대해 하위 카테고리 재귀적으로 가져오기
  const categoryTree = await Promise.all(
    rootCategories.map(async (rootCategory) => {
      const children = await getNestedChildren(rootCategory.id);
      return {
        ...rootCategory,
        children
      };
    })
  );
  
  return categoryTree;
}

/**
 * 재귀적으로 하위 카테고리 가져오기
 */
async function getNestedChildren(parentId) {
  const children = await getSubcategories(parentId);
  
  return await Promise.all(
    children.map(async (child) => {
      const grandChildren = await getNestedChildren(child.id);
      return {
        ...child,
        children: grandChildren
      };
    })
  );
}

module.exports = {
  getAllCategories,
  getRootCategories,
  getCategoryById,
  getCategoryBySlug,
  getSubcategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryTree
};
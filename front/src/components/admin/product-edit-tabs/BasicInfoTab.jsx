import React from 'react';

const BasicInfoTab = ({
  formData,
  handleChange,
  handleNumberChange,
  categoryList,
}) => {
  // console.log(categoryList);

  // slug 자동 생성 함수
  const generateSlug = () => {
    if (!formData.name) return;

    // 이름을 소문자로 변환하고, 특수문자 제거, 공백을 하이픈으로 대체
    const slug = formData.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    handleChange({ target: { name: 'slug', value: slug } });
  };

  // 카테고리 선책 처리
  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;

    handleChange(e);

    if (categoryId) {
      handleChange({
        target: {
          name: 'categories',
          value: [parseInt(categoryId, 10)],
        },
      });
    } else {
      handleChange({ target: { name: 'categories', value: [] } });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          상품명 <span className="text-red-500">*</span>
        </label>
        <input
          required
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="상품명을 입력하세요"
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          슬러그 (URL)
        </label>
        <div className="flex">
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            placeholder="my-product-name"
            className="w-full p-2 border rounded-l focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <div>
            <button
              type="button"
              onClick={generateSlug}
              className="bg-gray-200 hover:bg-gray-300 px-2 py-2 rounded-r border border-gray-300 text-xs font-medium text-gray-70"
            >
              자동 생성
            </button>
          </div>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          URL에 사용될 영문 식별자입니다. 입력하지 않으면 상품명에서 자동
          생성됩니다.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          상품 코드 (SKU)
        </label>
        <input
          type="text"
          name="sku"
          value={formData.sku || ''}
          onChange={handleChange}
          placeholder="MS-001"
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="mt-1 text-xs text-gray-500">
          재고 관리용 상품 코드입니다. 입력하지 않으면 자동 생성됩니다.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          판매가 <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center">
          <input
            required
            type="number"
            name="price"
            value={formData.price}
            onChange={handleNumberChange}
            min="0"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <span className="ml-2">원</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          할인가
        </label>
        <div className="flex items-center">
          <input
            type="number"
            name="salePrice"
            value={formData.salePrice || 0}
            onChange={handleNumberChange}
            min="0"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <span className="ml-2">원</span>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          할인가가 설정되면 판매가는 취소선으로 표시됩니다.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          재고 수량 <span className="text-red-500">*</span>
        </label>
        <input
          required
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleNumberChange}
          min="0"
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          카테고리
        </label>
        <select
          name="categoryId"
          value={formData.categoryId || ''}
          onChange={handleCategoryChange}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">카테고리 선택</option>

          {Array.isArray(categoryList.list) &&
            categoryList.list.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
        </select>
      </div>

      <div className="flex space-x-6 items-center">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="isActive"
            className="ml-2 block text-sm text-gray-700"
          >
            판매 활성화
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isFeatured"
            name="isFeatured"
            checked={formData.isFeatured}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="isFeatured"
            className="ml-2 block text-sm text-gray-700"
          >
            추천 상품
          </label>
        </div>
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          간단 설명
        </label>
        <textarea
          name="summary"
          value={formData.summary || ''}
          onChange={handleChange}
          rows="2"
          placeholder="상품 목록에서 보여질 간단한 설명을 입력하세요"
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        ></textarea>
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          메타 타이틀 (SEO)
        </label>
        <input
          type="text"
          name="metaTitle"
          value={formData.metaTitle || ''}
          onChange={handleChange}
          placeholder="검색 엔진용 제목"
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="mt-1 text-xs text-gray-500">
          검색 엔진 최적화(SEO)를 위한 페이지 제목입니다. 입력하지 않으면
          상품명이 사용됩니다.
        </p>
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          메타 설명 (SEO)
        </label>
        <textarea
          name="metaDescription"
          value={formData.metaDescription || ''}
          onChange={handleChange}
          rows="2"
          placeholder="검색 결과에 표시될 설명"
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        ></textarea>
        <p className="mt-1 text-xs text-gray-500">
          검색 엔진 결과에 표시될 설명입니다. 120자 이내로 작성하는 것이
          좋습니다.
        </p>
      </div>
    </div>
  );
};

export default BasicInfoTab;

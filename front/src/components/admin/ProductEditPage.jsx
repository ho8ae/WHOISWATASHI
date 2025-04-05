// components/admin/ProductEditPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useAdmin from '../../hooks/useAdmin';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';

// 탭 컴포넌트들 import
import { 
  EditTabs, 
  BasicInfoTab, 
  DetailsTab, 
  ImagesTab, 
  DeliveryTab,
} from './product-edit-tabs';

const ProductEditPage = () => {
  const { productId } = useParams();
  const isEditMode = !!productId;
  const navigate = useNavigate();
  const { getProductDetail, addProduct, editProduct, getCategories, categories } = useAdmin();

  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    price: 0,
    salePrice: null,
    stock: 0,
    sku: '',
    description: '',
    isActive: true,
    isFeatured: false,
    metaTitle: '',
    metaDescription: '',
    images: [],
    categories: []
  });

  // 카테고리 목록 로드
  useEffect(() => {
    getCategories();
  }, [getCategories]);

  // 상품 상세정보 로드 (수정 모드)
  useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      getProductDetail(productId)
        .then(response => {
          // Redux 액션 응답에서 실제 데이터 추출
          const data = response.payload || response;
          
          // API 응답을 폼 데이터 형식에 맞게 변환
          const productData = {
            name: data.name || '',
            slug: data.slug || '',
            price: data.price || 0,
            salePrice: data.salePrice || null,
            stock: data.stock || 0,
            sku: data.sku || '',
            description: data.description || '',
            isActive: data.isActive !== undefined ? data.isActive : true,
            isFeatured: data.isFeatured !== undefined ? data.isFeatured : false,
            metaTitle: data.metaTitle || '',
            metaDescription: data.metaDescription || '',
            
            // 카테고리 처리
            categories: data.categories?.map(cat => {
              if (typeof cat === 'object') {
                return cat.categoryId || (cat.category ? cat.category.id : cat.id);
              }
              return cat;
            }) || [],
            
            // 이미지 처리
            images: data.images?.map(img => ({ 
              id: img.id || Date.now(), 
              url: img.imageUrl || img.url,
              isPrimary: img.isPrimary || false,
              altText: img.altText || ''
            })) || []
          };
          
          setFormData(productData);
          setLoading(false);
        })
        .catch(err => {
          console.error('상품 로딩 오류:', err);
          setError('상품 정보를 불러오는 데 실패했습니다.');
          setLoading(false);
        });
    }
  }, [productId, isEditMode, getProductDetail]);

  // 일반 필드 값 변경 핸들러
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // 숫자 필드 값 변경 핸들러
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? 0 : Number(value)
    }));
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // 서버로 전송할 데이터 구성
      const productData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        price: formData.price,
        salePrice: formData.salePrice,
        stock: formData.stock,
        sku: formData.sku,
        isActive: formData.isActive,
        isFeatured: formData.isFeatured,
        metaTitle: formData.metaTitle || null,
        metaDescription: formData.metaDescription || null,
        
        // ProductCategory 관계 데이터
        categories: formData.categories,
        
        // ProductImage 관계 데이터
        images: formData.images.map(img => ({
          imageUrl: img.url,
          altText: img.altText || '',
          isPrimary: !!img.isPrimary
        }))
      };

      if (isEditMode) {
        await editProduct(productId, productData);
        alert('상품이 성공적으로 수정되었습니다.');
      } else {
        const response = await addProduct(productData);
        console.log('상품 생성 응답:', response);
        alert('상품이 성공적으로 등록되었습니다.');
      }
      
      navigate('/admin/products');
    } catch (err) {
      console.error('상품 저장 오류:', err);
      setError(err.message || '상품 저장에 실패했습니다.');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">상품 정보를 불러오는 중...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 pb-12">
      <div className="flex items-center justify-between my-6">
        <button
          onClick={() => navigate('/admin/products')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} className="mr-1" />
          <span>상품 목록으로</span>
        </button>
        <h1 className="text-2xl font-bold">
          {isEditMode ? '상품 수정' : '새 상품 등록'}
        </h1>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          <Save size={18} className="mr-2" />
          {saving ? '저장 중...' : '저장하기'}
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <div className="flex items-center">
            <AlertCircle size={20} className="mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <form onSubmit={handleSubmit}>
          <EditTabs 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            hideTabs={['options']}  // 상품 등록 시에는 옵션 탭 숨김
          />
          
          <div className="p-6">
            {activeTab === 'basic' && (
              <BasicInfoTab 
                formData={formData} 
                handleChange={handleChange} 
                handleNumberChange={handleNumberChange} 
                categoryList={categories}
              />
            )}
            
            {activeTab === 'details' && (
              <DetailsTab formData={formData} setFormData={setFormData} />
            )}
            
            {activeTab === 'images' && (
              <ImagesTab formData={formData} setFormData={setFormData} />
            )}
            
            {activeTab === 'delivery' && (
              <DeliveryTab 
                formData={formData} 
                handleChange={handleChange} 
                handleNumberChange={handleNumberChange} 
              />
            )}

           
          
          </div>
          
          <div className="px-6 py-4 bg-gray-50 border-t flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mr-3"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {saving ? '저장 중...' : '저장하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductEditPage;
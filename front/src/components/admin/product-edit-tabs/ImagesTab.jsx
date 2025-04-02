import React, { useState } from 'react';
import { Image, CheckCircle, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

const ImagesTab = ({ formData, setFormData }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [draggedIndex, setDraggedIndex] = useState(null);

  const handleAddImage = () => {
    if (!imageUrl.trim()) return;
    
    const newImage = {
      id: Date.now(), // 임시 ID
      url: imageUrl,
      altText: altText || formData.name || '상품 이미지',
      isPrimary: formData.images.length === 0
    };
    
    setFormData(prev => ({ 
      ...prev, 
      images: [...prev.images, newImage] 
    }));
    
    setImageUrl('');
    setAltText('');
  };

  const handleRemoveImage = (id) => {
    let newImages = formData.images.filter(img => img.id !== id);
    
    // 대표 이미지가 삭제되었고 다른 이미지가 있다면 첫 번째 이미지를 대표로 설정
    if (formData.images.find(img => img.id === id && img.isPrimary) && newImages.length > 0) {
      newImages = newImages.map((img, index) => ({
        ...img,
        isPrimary: index === 0
      }));
    }
    
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  const handleSetPrimary = (id) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map(img => ({
        ...img,
        isPrimary: img.id === id
      }))
    }));
  };

  const moveImage = (fromIndex, toIndex) => {
    const newImages = [...formData.images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  // 드래그 앤 드롭 핸들러
  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null) return;
    
    const draggedOverItem = formData.images[index];
    
    // 같은 항목이면 무시
    if (draggedIndex === index) return;
    
    moveImage(draggedIndex, index);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="py-4">
      <div className="mb-6">
        <label className="block text-l font-medium text-gray-700 mb-2 ">
          대표 이미지 추가
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
          <div className="md:col-span-2">
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="이미지 URL을 입력하세요"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="대체 텍스트 (선택사항)"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleAddImage}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
          >
            <Image size={16} className="mr-2" />
            이미지 추가
          </button>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          참고: 나중에 파일 업로드 기능으로 대체할 수 있습니다.
        </p>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            상품 이미지 목록
          </label>
          <div className="text-xs text-gray-500">
            {formData.images.length > 0 ? `${formData.images.length}개의 이미지` : ''}
          </div>
        </div>
        
        {formData.images.length === 0 ? (
          <div className="border border-dashed border-gray-300 rounded-lg p-12 text-center">
            <Image className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">추가된 이미지가 없습니다</p>
            <p className="text-xs text-gray-400 mt-1">이미지를 추가하려면 위 필드에 URL을 입력하세요</p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {formData.images.map((image, index) => (
                <li 
                  key={image.id}
                  className={`flex items-center p-3 ${draggedIndex === index ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                >
                  <div className="flex items-center flex-1">
                    <div className="flex-shrink-0 h-16 w-16 rounded overflow-hidden border mr-4">
                      <img 
                        src={image.url} 
                        alt={image.altText}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/150?text=Error";
                        }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {image.url.split('/').pop()}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {image.altText}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => moveImage(index, index - 1)}
                        className="text-gray-400 hover:text-gray-600 p-1"
                        title="위로 이동"
                      >
                        <ArrowUp size={16} />
                      </button>
                    )}
                    
                    {index < formData.images.length - 1 && (
                      <button
                        type="button"
                        onClick={() => moveImage(index, index + 1)}
                        className="text-gray-400 hover:text-gray-600 p-1"
                        title="아래로 이동"
                      >
                        <ArrowDown size={16} />
                      </button>
                    )}
                    
                    {image.isPrimary ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle size={14} className="mr-1" />
                        대표
                      </span>
                    ) : (
                      <button 
                        type="button"
                        onClick={() => handleSetPrimary(image.id)}
                        className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1"
                      >
                        대표 설정
                      </button>
                    )}
                    
                    <button 
                      type="button"
                      onClick={() => handleRemoveImage(image.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="삭제"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <p className="mt-3 text-sm text-gray-500">
          드래그하여 이미지 순서를 변경할 수 있습니다. 첫 번째 이미지가 대표 이미지로 설정됩니다.
        </p>
      </div>
    </div>
  );
};

export default ImagesTab;
// components/admin/product-edit-tabs/DetailsTab.jsx
import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast } from 'react-hot-toast';

const DetailsTab = ({ formData, setFormData, errors }) => {
  const [charCount, setCharCount] = useState(0);
  const [isUnsavedChanges, setIsUnsavedChanges] = useState(false);
  const quillRef = useRef(null);
  const MAX_CHARS = 10000;

  useEffect(() => {
    // 자동 저장된 내용 확인
    const autoSavedContent = localStorage.getItem('productDescriptionAutoSave');
    if (autoSavedContent && !formData.description) {
      // 초기 상태에서만 자동 저장된 내용을 복원
      setFormData((prev) => ({ ...prev, description: autoSavedContent }));
    }
    
    // 터치 이벤트 버그 수정을 위한 코드
    const fixQuillTouch = () => {
      const editorElements = document.querySelectorAll('.ql-editor');
      
      if (editorElements.length > 0) {
        editorElements.forEach(editor => {
          // 터치 핸들러 직접 등록
          editor.style.touchAction = 'auto';
          editor.style.overflow = 'auto';
          editor.style.webkitOverflowScrolling = 'touch';
          
          // iOS 사파리 포커스 버그 수정
          editor.addEventListener('touchstart', function() {
            this.focus();
          });
        });
      }
    };
    
    // 컴포넌트가 마운트된 후 약간의 지연을 두고 터치 이벤트 수정 적용
    const touchFixTimeout = setTimeout(fixQuillTouch, 500);
    
    return () => {
      clearTimeout(touchFixTimeout);
    };
  }, []);

  // 에디터 설정 - 모바일에 최적화된 간결한 도구 모음
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ list: 'bullet' }, { list: 'ordered' }],
      ['link'],
      ['clean'],
    ],
    clipboard: {
      matchVisual: false,
    }
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'list',
    'bullet',
    'link',
  ];

  // 글자 수 계산 함수
  const countCharacters = (html) => {
    if (!html) return 0;
    
    // HTML 태그 제거 후 글자 수 계산
    const text = html.replace(/<[^>]*>/g, '');
    return text.length;
  };

  // 에디터 내용 변경 핸들러
  const handleContentChange = (content) => {
    const count = countCharacters(content);
    setCharCount(count);
    
    // 글자 수 제한 체크
    if (count > MAX_CHARS) {
      toast.error(`최대 ${MAX_CHARS}자까지 입력 가능합니다.`);
      return;
    }
    
    setFormData((prev) => ({ ...prev, description: content }));
    setIsUnsavedChanges(true);
    
    // 자동 저장 기능
    localStorage.setItem('productDescriptionAutoSave', content || '');
  };

  // 임시 저장 기능
  const handleSaveDraft = () => {
    // 로컬 스토리지에 임시 저장
    localStorage.setItem('productDescriptionDraft', formData.description || '');
    toast.success('임시 저장되었습니다.');
    setIsUnsavedChanges(false);
  };

  // 임시 저장된 내용 불러오기
  const handleLoadDraft = () => {
    // 수동 저장된 드래프트 먼저 확인
    const savedDraft = localStorage.getItem('productDescriptionDraft');
    // 자동 저장된 내용 확인
    const autoSavedDraft = localStorage.getItem('productDescriptionAutoSave');
    
    if (savedDraft) {
      setFormData((prev) => ({ ...prev, description: savedDraft }));
      toast.success('임시 저장된 내용을 불러왔습니다.');
    } else if (autoSavedDraft) {
      setFormData((prev) => ({ ...prev, description: autoSavedDraft }));
      toast.success('자동 저장된 내용을 불러왔습니다.');
    } else {
      toast.error('저장된 내용이 없습니다.');
    }
  };

  return (
    <div className="py-2">
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-gray-700">
          상품 상세 설명
        </label>
        <div className="text-sm text-gray-500">
          {charCount}/{MAX_CHARS} 자
        </div>
      </div>
      
      {errors?.description && (
        <div className="text-red-500 text-sm mb-2">{errors.description}</div>
      )}
      
      <div className={`border rounded ${errors?.description ? 'border-red-500' : 'border-gray-300'} quill-container`}>
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={formData.description || ''}
          onChange={handleContentChange}
          modules={modules}
          formats={formats}
        />
        
      </div>
      
    
      
      <div className="flex space-x-2 mt-4">
        <button
          type="button"
          onClick={handleSaveDraft}
          disabled={!isUnsavedChanges}
          className={`px-3 py-2 text-sm rounded-full flex-1 ${
            isUnsavedChanges
              ? 'bg-blue-500 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          임시 저장
        </button>
        <button
          type="button"
          onClick={handleLoadDraft}
          className="px-3 py-2 text-sm bg-gray-200 rounded-full flex-1"
        >
          불러오기
        </button>
      </div>
      
      <div className="mt-4 text-xs text-gray-500">
        <p>* 상품 상세 설명은 구매자에게 상품의 특징과 정보를 제공하는 중요한 영역입니다.</p>
        <p>* 정확하고 상세한 정보를 제공하여 반품/교환 요청을 줄일 수 있습니다.</p>
      </div>
    </div>
  );
};

export default DetailsTab;
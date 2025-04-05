// components/admin/product-edit-tabs/EditTabs.jsx
import React from 'react';

const EditTabs = ({ activeTab, setActiveTab, hideTabs = [] }) => {
  const tabs = [
    { id: 'basic', label: '기본 정보' },
    { id: 'details', label: '상세 정보' },
    { id: 'images', label: '이미지' },
    { id: 'options', label: '옵션 관리' },
    { id: 'delivery', label: '배송 정보' }
  ].filter(tab => !hideTabs.includes(tab.id));

  return (
    <div className="flex border-b">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`px-6 py-3 ${
            activeTab === tab.id
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default EditTabs;
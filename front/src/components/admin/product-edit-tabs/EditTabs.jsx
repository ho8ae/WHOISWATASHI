// components/admin/product-edit-tabs/EditTabs.jsx
import React from 'react';

const EditTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'basic', label: '기본 정보' },
    { id: 'details', label: '상세 설명' },
    { id: 'images', label: '이미지' },
    { id: 'options', label: '옵션/재고' },
    { id: 'delivery', label: '배송 정보' },
  ];

  return (
    <div className="border-b border-gray-200 overflow-x-auto">
      <nav className="flex py-2 px-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            type='button'
            className={`whitespace-nowrap px-4 py-2 text-sm font-medium mr-2 rounded-lg ${
              activeTab === tab.id
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default EditTabs;
import React from 'react';
import { motion } from 'framer-motion';

const TabNavigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'profile', label: '프로필' },
    { id: 'orders', label: '주문 내역' },
    { id: 'wishlist', label: '찜 목록' }
  ];

  return (
    <div className="border-b border-gray-200">
      <nav className="flex flex-wrap -mb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`mr-2 py-2 px-4 font-medium text-sm border-b-2 ${
              activeTab === tab.id
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                className="h-0.5 absolute bottom-0 left-0 right-0"
                layoutId="tab-indicator"
              />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default TabNavigation;
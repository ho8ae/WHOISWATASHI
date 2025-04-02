// components/admin/product-edit-tabs/DeliveryTab.jsx
import React from 'react';
import {  AlertCircle } from 'lucide-react';

const DeliveryTab = ({ formData, handleChange, handleNumberChange }) => {
  return (
    <div className="py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            배송비 유형
          </label>
          <select
            name="shippingType"
            value={formData.shippingType || 'flat'}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="flat">고정 배송비</option>
            <option value="free">무료 배송</option>
            <option value="conditional">조건부 무료 배송</option>
          </select>
        </div>

        {formData.shippingType === 'flat' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              배송비
            </label>
            <div className="flex items-center">
              <input
                type="number"
                name="shippingFee"
                value={formData.shippingFee || 0}
                onChange={handleNumberChange}
                min="0"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="ml-2">원</span>
            </div>
          </div>
        )}

        {formData.shippingType === 'conditional' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                기본 배송비
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  name="shippingFee"
                  value={formData.shippingFee || 0}
                  onChange={handleNumberChange}
                  min="0"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="ml-2">원</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                무료 배송 기준 금액
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  name="freeShippingThreshold"
                  value={formData.freeShippingThreshold || 0}
                  onChange={handleNumberChange}
                  min="0"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="ml-2">원 이상</span>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                이 금액 이상 주문 시 무료 배송이 적용됩니다
              </p>
            </div>
          </>
        )}

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            배송 소요 기간
          </label>
          <select
            name="shippingDays"
            value={formData.shippingDays || '1-3'}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="1-3">1-3일 이내</option>
            <option value="3-5">3-5일 이내</option>
            <option value="5-7">5-7일 이내</option>
            <option value="7-14">7-14일 이내</option>
            <option value="custom">직접 입력</option>
          </select>
        </div>

        {formData.shippingDays === 'custom' && (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              배송 소요 기간 (직접 입력)
            </label>
            <input
              type="text"
              name="customShippingDays"
              value={formData.customShippingDays || ''}
              onChange={handleChange}
              placeholder="예: 주문 제작으로 2-3주 소요"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            추가 배송 정보
          </label>
          <textarea
            name="shippingInfo"
            value={formData.shippingInfo || ''}
            onChange={handleChange}
            rows="3"
            placeholder="배송과 관련된 추가 안내사항이 있으면 입력하세요"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>
      </div>

      <div className="mt-6 p-4 border rounded-lg bg-blue-50 flex items-start">
        <AlertCircle className="text-blue-600 mr-3 mt-0.5 flex-shrink-0" size={20} />
        <div>
          <h4 className="text-sm font-medium text-blue-800">배송 정보 안내</h4>
          <p className="mt-1 text-sm text-blue-700">
            정확한 배송 정보를 제공하면 고객의 신뢰도와 만족도를 높일 수 있습니다.
            배송 지연이 예상되는 경우, 사전에 안내하는 것이 좋습니다.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            반품/교환 정보
          </label>
        </div>
        <textarea
          name="returnPolicy"
          value={formData.returnPolicy || ''}
          onChange={handleChange}
          rows="4"
          placeholder="반품 및 교환 정책을 입력하세요"
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        ></textarea>
        <p className="mt-1 text-xs text-gray-500">
          반품/교환 가능 여부, 기간, 배송비 부담 주체 등을 상세히 기재하세요.
        </p>
      </div>
    </div>
  );
};

export default DeliveryTab;
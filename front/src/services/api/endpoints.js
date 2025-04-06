export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token',
    SEND_VERIFICATION: '/auth/send-verification',
    VERIFY_CODE: '/auth/verify-code',
    ME: '/auth/me',
    REQUEST_RESET: '/auth/request-reset',
    VERIFY_RESET_TOKEN: '/auth/verify-reset-token',
    RESET_PASSWORD: '/auth/reset-password',
  },
  USERS: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
  },
  PRODUCTS: {
    LIST: '/products',
    DETAIL: (id) => `/products/${id}`,
    CATEGORIES: '/products/categories',
    VARIANTS: (productId) => `/products/${productId}/variants`,
  },
  CART: {
    GET: '/cart',
    ADD: '/cart/items',
    UPDATE: (itemId) => `/cart/items/${itemId}`,
    REMOVE: (itemId) => `/cart/items/${itemId}`,
  },
  ORDERS: {
    CREATE: '/orders',
    LIST: '/orders',
    DETAIL: (id) => `/orders/${id}`,
    CANCEL: (id) => `/orders/${id}/cancel`,
    GET_BY_ID: (id) => `/orders/${id}`,
    GET_USER_ORDERS: '/orders',
    GET_GUEST_ORDER: '/orders/guest',
  },

  PAYMENT: {
    VERIFY_PORTONE: '/payments/portone/verify',
  },

  // ADMIN
  ADMIN: {
    // 대시보드
    DASHBOARD: '/admin/dashboard',
    
    // 사용자 관리
    USERS: {
      LIST: '/admin/users',
      DETAIL: (id) => `/admin/users/${id}`,
      UPDATE_ROLE: (id) => `/admin/users/${id}/role`,
    },
    
    // 상품 관리
    PRODUCTS: {
      LIST: '/products',
      DETAIL: (id) => `/products/${id}`,
      CREATE: '/products',
      UPDATE: (id) => `/products/${id}`,
      DELETE: (id) => `/products/${id}`,
      OUT_OF_STOCK: 'admin/products/out-of-stock',
      UPDATE_STOCK: (variantId) => `admin/products/variants/${variantId}/stock`,
    },
    
    // 주문 관리
    ORDERS: {
      LIST: '/admin/orders',
      DETAIL: (id) => `/admin/orders/${id}`,
      UPDATE: (id) => `/admin/orders/${id}`,
    },

    // 카테고리 관리
    CATEGORIES: {
      LIST: '/categories',
      DETAIL: (id) => `/categories/${id}`,
      CREATE: '/categories',
      UPDATE: (id) => `/categories/${id}`,
      DELETE: (id) => `/categories/${id}`,
    },

    // 옵션 타입 관리
    OPTION_TYPES: {
      LIST: '/option-types',
      DETAIL: (id) => `/option-types/${id}`,
      CREATE: '/option-types',
      UPDATE: (id) => `/option-types/${id}`,
      DELETE: (id) => `/option-types/${id}`,
      CREATE_VALUE: (optionTypeId) => `/option-types/${optionTypeId}/values`,
      UPDATE_VALUE: (valueId) => `/option-types/values/${valueId}`,
      DELETE_VALUE: (valueId) => `/option-types/values/${valueId}`,
    },

    // 문의 관리
    INQUIRIES: {
      LIST: '/inquiries/admin',
      DETAIL: (id) => `/inquiries/${id}`,
      ANSWER: (id) => `/inquiries/admin/${id}/answer`,
      UPDATE_ANSWER: (answerId) => `/inquiries/admin/answer/${answerId}`,
      UPDATE_STATUS: (id) => `/inquiries/admin/${id}/status`,
    },
  },
};
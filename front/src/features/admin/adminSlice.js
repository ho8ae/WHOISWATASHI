import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminAPI } from './adminAPI';

// 대시보드 조회 액션
export const fetchDashboard = createAsyncThunk(
  'admin/fetchDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getDashboard();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || '대시보드 조회에 실패했습니다.');
    }
  },
);

// 사용자 목록 조회 액션
export const fetchUsers = createAsyncThunk(
  'admin/fetchUsers',
  async (params, { rejectWithValue }) => {
    try {
      const response = await adminAPI.users.getUsers(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.message || '사용자 목록 조회에 실패했습니다.',
      );
    }
  },
);

// 사용자 상세 조회 액션
export const fetchUserDetail = createAsyncThunk(
  'admin/fetchUserDetail',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await adminAPI.users.getUserDetail(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.message || '사용자 상세 조회에 실패했습니다.',
      );
    }
  },
);

// 사용자 역할 변경 액션
export const updateUserRole = createAsyncThunk(
  'admin/updateUserRole',
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      const response = await adminAPI.users.updateUserRole(userId, role);
      return { userId, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.message || '사용자 역할 변경에 실패했습니다.',
      );
    }
  },
);

// 상품 목록 조회 액션
export const fetchProducts = createAsyncThunk(
  'admin/fetchProducts',
  async (params, { rejectWithValue }) => {
    try {
      const response = await adminAPI.products.getProducts(params);

      return {
        products: response.products,
        pagination: response.pagination,
      };
    } catch (error) {
      return rejectWithValue(error.message || '상품 목록 조회에 실패했습니다.');
    }
  },
);

// 상품 상세 조회 액션
export const fetchProductDetail = createAsyncThunk(
  'admin/fetchProductDetail',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await adminAPI.products.getProductDetail(productId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || '상품 상세 조회에 실패했습니다.');
    }
  },
);

// 상품 생성 액션
export const createProduct = createAsyncThunk(
  'admin/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await adminAPI.products.createProduct(productData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || '상품 생성에 실패했습니다.');
    }
  },
);

// 상품 수정 액션
export const updateProduct = createAsyncThunk(
  'admin/updateProduct',
  async ({ productId, productData }, { rejectWithValue }) => {
    try {
      const response = await adminAPI.products.updateProduct(
        productId,
        productData,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || '상품 수정에 실패했습니다.');
    }
  },
);

// 상품 삭제 액션
export const deleteProduct = createAsyncThunk(
  'admin/deleteProduct',
  async (productId, { rejectWithValue }) => {
    try {
      await adminAPI.products.deleteProduct(productId);
      return { productId };
    } catch (error) {
      return rejectWithValue(error.message || '상품 삭제에 실패했습니다.');
    }
  },
);

// 품절 상품 목록 조회 액션
export const fetchOutOfStockProducts = createAsyncThunk(
  'admin/fetchOutOfStockProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminAPI.products.getOutOfStockProducts();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.message || '품절 상품 목록 조회에 실패했습니다.',
      );
    }
  },
);

// 상품 재고 업데이트 액션
export const updateProductStock = createAsyncThunk(
  'admin/updateProductStock',
  async ({ variantId, stock }, { rejectWithValue }) => {
    try {
      const response = await adminAPI.products.updateStock(variantId, stock);
      return { variantId, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.message || '상품 재고 업데이트에 실패했습니다.',
      );
    }
  },
);

// 주문 목록 조회 액션
export const fetchOrders = createAsyncThunk(
  'admin/fetchOrders',
  async (params, { rejectWithValue }) => {
    try {
      const response = await adminAPI.orders.getOrders(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || '주문 목록 조회에 실패했습니다.');
    }
  },
);

// 주문 상세 조회 액션
export const fetchOrderDetail = createAsyncThunk(
  'admin/fetchOrderDetail',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await adminAPI.orders.getOrderDetail(orderId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || '주문 상세 조회에 실패했습니다.');
    }
  },
);

// 주문 상태 업데이트 액션
export const updateOrder = createAsyncThunk(
  'admin/updateOrder',
  async ({ orderId, orderData }, { rejectWithValue }) => {
    try {
      const response = await adminAPI.orders.updateOrder(orderId, orderData);
      return { orderId, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.message || '주문 상태 업데이트에 실패했습니다.',
      );
    }
  },
);

// 카테고리 목록 조회 액션
export const fetchCategories = createAsyncThunk(
  'admin/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminAPI.categories.getCategories();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.message || '카테고리 목록 조회에 실패했습니다.',
      );
    }
  },
);

// 카테고리 생성 액션
export const createCategory = createAsyncThunk(
  'admin/createCategory',
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await adminAPI.categories.createCategory(categoryData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || '카테고리 생성에 실패했습니다.');
    }
  },
);

// 카테고리 수정 액션
export const updateCategory = createAsyncThunk(
  'admin/updateCategory',
  async ({ categoryId, categoryData }, { rejectWithValue }) => {
    try {
      const response = await adminAPI.categories.updateCategory(
        categoryId,
        categoryData,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || '카테고리 수정에 실패했습니다.');
    }
  },
);

// 카테고리 삭제 액션
export const deleteCategory = createAsyncThunk(
  'admin/deleteCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      await adminAPI.categories.deleteCategory(categoryId);
      return { categoryId };
    } catch (error) {
      return rejectWithValue(error.message || '카테고리 삭제에 실패했습니다.');
    }
  },
);

// 문의 목록 조회 액션
export const fetchInquiries = createAsyncThunk(
  'admin/fetchInquiries',
  async (params, { rejectWithValue }) => {
    try {
      const response = await adminAPI.inquiries.getInquiries(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || '문의 목록 조회에 실패했습니다.');
    }
  },
);

// 문의 상세 조회 액션
export const fetchInquiryDetail = createAsyncThunk(
  'admin/fetchInquiryDetail',
  async (inquiryId, { rejectWithValue }) => {
    try {
      const response = await adminAPI.inquiries.getInquiryDetail(inquiryId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || '문의 상세 조회에 실패했습니다.');
    }
  },
);

// 문의 답변 작성 액션
export const answerInquiry = createAsyncThunk(
  'admin/answerInquiry',
  async ({ inquiryId, answerData }, { rejectWithValue }) => {
    try {
      const response = await adminAPI.inquiries.answerInquiry(
        inquiryId,
        answerData,
      );
      return { inquiryId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.message || '문의 답변 작성에 실패했습니다.');
    }
  },
);

// 문의 상태 변경 액션
export const updateInquiryStatus = createAsyncThunk(
  'admin/updateInquiryStatus',
  async ({ inquiryId, status }, { rejectWithValue }) => {
    try {
      const response = await adminAPI.inquiries.updateInquiryStatus(
        inquiryId,
        status,
      );
      return { inquiryId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.message || '문의 상태 변경에 실패했습니다.');
    }
  },
);

// 상품 변형 생성 액션
export const createProductVariant = createAsyncThunk(
  'admin/createProductVariant',
  async ({ productId, variantData }, { rejectWithValue }) => {
    try {
      // inquiries에서 products로 변경
      const response = await adminAPI.products.createProductVariant(
        productId,
        variantData,
      );
      return { productId, variant: response.data || response };
    } catch (error) {
      return rejectWithValue(error.message || '상품 변형 생성에 실패했습니다.');
    }
  },
);

// 상품 변형 목록 조회 액션
export const fetchProductVariants = createAsyncThunk(
  'admin/fetchProductVariants',
  async (productId, { rejectWithValue }) => {
    try {
      // inquiries에서 products로 변경
      const response = await adminAPI.products.getProductVariants(productId);
      return { productId, variants: response.data || response };
    } catch (error) {
      return rejectWithValue(
        error.message || '상품 변형 목록 조회에 실패했습니다.',
      );
    }
  },
);

// 상품 변형 수정 액션
export const updateProductVariant = createAsyncThunk(
  'admin/updateProductVariant',
  async ({ variantId, variantData }, { rejectWithValue }) => {
    try {
      const response = await adminAPI.products.updateProductVariant(variantId, variantData);
      return { variantId, variant: response.data || response };
    } catch (error) {
      return rejectWithValue(error.message || '상품 변형 수정에 실패했습니다.');
    }
  },
);

// 옵션 타입 목록 조회 액션 추가
export const fetchOptionTypes = createAsyncThunk(
  'admin/fetchOptionTypes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminAPI.optionTypes.getOptionTypes();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.message || '옵션 타입 목록 조회에 실패했습니다.',
      );
    }
  },
);

// 옵션 값 생성 액션
export const createOptionValue = createAsyncThunk(
  'admin/createOptionValue',
  async ({ optionTypeId, optionValueData }, { rejectWithValue }) => {
    try {
      const response = await adminAPI.optionTypes.createOptionValue(
        optionTypeId,
        optionValueData,
      );
      return { optionTypeId, optionValue: response.data };
    } catch (error) {
      return rejectWithValue(error.message || '옵션 값 생성에 실패했습니다.');
    }
  },
);

// 옵션 타입 생성 액션 thunk
export const createOptionType = createAsyncThunk(
  'admin/createOptionType',
  async (optionTypeData, { rejectWithValue }) => {
    try {
      const response = await adminAPI.optionTypes.createOptionType(optionTypeData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || '옵션 타입 생성에 실패했습니다.');
    }
  },
);

// 모든 상품 변형 조회 액션
export const fetchAllProductVariants = createAsyncThunk(
  'admin/fetchAllProductVariants',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminAPI.products.getAllProductVariants();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || '모든 상품 변형 조회에 실패했습니다.');
    }
  }
);

// 모든 옵션 값 조회 액션
export const fetchAllOptionValues = createAsyncThunk(
  'admin/fetchAllOptionValues',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminAPI.optionTypes.getAllOptionValues();
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message || '모든 옵션 값 조회에 실패했습니다.');
    }
  }
);


// 초기 상태
const initialState = {
  // 대시보드
  dashboard: {
    data: null,
    loading: false,
    error: null,
  },

  // 사용자 관리
  users: {
    list: [],
    pagination: {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    },
    selectedUser: null,
    loading: false,
    error: null,
  },

  // 상품 관리
  products: {
    list: [],
    pagination: {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    },
    selectedProduct: null,
    outOfStockProducts: [],
    loading: false,
    error: null,
  },

  // 주문 관리
  orders: {
    list: [],
    pagination: {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    },
    selectedOrder: null,
    loading: false,
    error: null,
  },

  // 카테고리 관리
  categories: {
    list: [],
    tree: [],
    selectedCategory: null,
    loading: false,
    error: null,
  },

  // 문의 관리
  inquiries: {
    list: [],
    pagination: {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    },
    selectedInquiry: null,
    loading: false,
    error: null,
  },

  // 옵션 타입 관리 추가
  optionTypes: {
    list: [],
    loading: false,
    error: null,
  },

  allProductVariants: [],
  allOptionValues: [],
};

// Admin 슬라이스
const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    // 사용자 선택
    selectUser: (state, action) => {
      state.users.selectedUser = action.payload;
    },

    // 상품 선택
    selectProduct: (state, action) => {
      state.products.selectedProduct = action.payload;
    },

    // 주문 선택
    selectOrder: (state, action) => {
      state.orders.selectedOrder = action.payload;
    },

    // 카테고리 선택
    selectCategory: (state, action) => {
      state.categories.selectedCategory = action.payload;
    },

    // 문의 선택
    selectInquiry: (state, action) => {
      state.inquiries.selectedInquiry = action.payload;
    },

    // 에러 초기화
    clearError: (state, action) => {
      const section = action.payload;

      if (!section || section === 'dashboard') {
        state.dashboard.error = null;
      }

      if (!section || section === 'users') {
        state.users.error = null;
      }

      if (!section || section === 'products') {
        state.products.error = null;
      }

      if (!section || section === 'orders') {
        state.orders.error = null;
      }

      if (!section || section === 'categories') {
        state.categories.error = null;
      }

      if (!section || section === 'inquiries') {
        state.inquiries.error = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // 대시보드 조회
      .addCase(fetchDashboard.pending, (state) => {
        state.dashboard.loading = true;
        state.dashboard.error = null;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.dashboard.loading = false;
        state.dashboard.data = action.payload;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.dashboard.loading = false;
        state.dashboard.error = action.payload;
      })

      // 사용자 목록 조회
      .addCase(fetchUsers.pending, (state) => {
        state.users.loading = true;
        state.users.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users.loading = false;
        state.users.list = action.payload.users;
        state.users.pagination = action.payload.pagination;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.users.loading = false;
        state.users.error = action.payload;
      })

      // 사용자 상세 조회
      .addCase(fetchUserDetail.pending, (state) => {
        state.users.loading = true;
        state.users.error = null;
      })
      .addCase(fetchUserDetail.fulfilled, (state, action) => {
        state.users.loading = false;
        state.users.selectedUser = action.payload;
      })
      .addCase(fetchUserDetail.rejected, (state, action) => {
        state.users.loading = false;
        state.users.error = action.payload;
      })

      // 사용자 역할 변경
      .addCase(updateUserRole.pending, (state) => {
        state.users.loading = true;
        state.users.error = null;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.users.loading = false;

        // 선택된 사용자가 있고, 그 사용자의 역할이 변경되었다면 업데이트
        if (
          state.users.selectedUser &&
          state.users.selectedUser.id === action.payload.userId
        ) {
          state.users.selectedUser.role = action.payload.role;
        }

        // 목록에서도 해당 사용자 업데이트
        const userIndex = state.users.list.findIndex(
          (user) => user.id === action.payload.userId,
        );
        if (userIndex !== -1) {
          state.users.list[userIndex].role = action.payload.role;
        }
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.users.loading = false;
        state.users.error = action.payload;
      })

      // 상품 목록 조회
      .addCase(fetchProducts.pending, (state) => {
        state.products.loading = true;
        state.products.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products.loading = false;
        state.products.list = action.payload.products;
        state.products.pagination = action.payload.pagination;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.products.loading = false;
        state.products.error = action.payload;
      })

      // 상품 상세 조회
      .addCase(fetchProductDetail.pending, (state) => {
        state.products.loading = true;
        state.products.error = null;
      })
      .addCase(fetchProductDetail.fulfilled, (state, action) => {
        state.products.loading = false;
        state.products.selectedProduct = action.payload;
      })
      .addCase(fetchProductDetail.rejected, (state, action) => {
        state.products.loading = false;
        state.products.error = action.payload;
      })

      // 상품 생성
      .addCase(createProduct.pending, (state) => {
        state.products.loading = true;
        state.products.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.loading = false;
        // 생성된 상품을 목록 맨 앞에 추가
        state.products.list = [action.payload, ...state.products.list];
        // 총 상품 수 증가
        if (state.products.pagination) {
          state.products.pagination.total += 1;
        }
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.products.loading = false;
        state.products.error = action.payload;
      })

      // 상품 수정
      .addCase(updateProduct.pending, (state) => {
        state.products.loading = true;
        state.products.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.products.loading = false;

        // 선택된 상품 업데이트
        if (
          state.products.selectedProduct &&
          state.products.selectedProduct.id === action.payload.id
        ) {
          state.products.selectedProduct = action.payload;
        }

        // 목록에서도 해당 상품 업데이트
        const productIndex = state.products.list.findIndex(
          (product) => product.id === action.payload.id,
        );
        if (productIndex !== -1) {
          state.products.list[productIndex] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.products.loading = false;
        state.products.error = action.payload;
      })

      // 상품 삭제
      .addCase(deleteProduct.pending, (state) => {
        state.products.loading = true;
        state.products.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products.loading = false;

        // 목록에서 해당 상품 제거
        state.products.list = state.products.list.filter(
          (product) => product.id !== action.payload.productId,
        );

        // 선택된 상품이 삭제된 상품이라면 null로 설정
        if (
          state.products.selectedProduct &&
          state.products.selectedProduct.id === action.payload.productId
        ) {
          state.products.selectedProduct = null;
        }

        // 총 상품 수 감소
        if (state.products.pagination) {
          state.products.pagination.total -= 1;
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.products.loading = false;
        state.products.error = action.payload;
      })

      // 품절 상품 목록 조회
      .addCase(fetchOutOfStockProducts.pending, (state) => {
        state.products.loading = true;
        state.products.error = null;
      })
      .addCase(fetchOutOfStockProducts.fulfilled, (state, action) => {
        state.products.loading = false;
        state.products.outOfStockProducts = action.payload;
      })
      .addCase(fetchOutOfStockProducts.rejected, (state, action) => {
        state.products.loading = false;
        state.products.error = action.payload;
      })

      // 상품 재고 업데이트
      .addCase(updateProductStock.pending, (state) => {
        state.products.loading = true;
        state.products.error = null;
      })
      .addCase(updateProductStock.fulfilled, (state, action) => {
        state.products.loading = false;

        // 품절 상품 목록 업데이트
        if (action.payload.stock > 0) {
          // 재고가 있는 경우 품절 목록에서 제거
          state.products.outOfStockProducts =
            state.products.outOfStockProducts.filter(
              (product) => product.id !== action.payload.variantId,
            );
        }
      })
      .addCase(updateProductStock.rejected, (state, action) => {
        state.products.loading = false;
        state.products.error = action.payload;
      })

      // 주문 목록 조회
      .addCase(fetchOrders.pending, (state) => {
        state.orders.loading = true;
        state.orders.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders.loading = false;
        state.orders.list = action.payload.orders;
        state.orders.pagination = action.payload.pagination;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.orders.loading = false;
        state.orders.error = action.payload;
      })

      // 주문 상세 조회
      .addCase(fetchOrderDetail.pending, (state) => {
        state.orders.loading = true;
        state.orders.error = null;
      })
      .addCase(fetchOrderDetail.fulfilled, (state, action) => {
        state.orders.loading = false;
        state.orders.selectedOrder = action.payload;
      })
      .addCase(fetchOrderDetail.rejected, (state, action) => {
        state.orders.loading = false;
        state.orders.error = action.payload;
      })

      // 주문 상태 업데이트
      .addCase(updateOrder.pending, (state) => {
        state.orders.loading = true;
        state.orders.error = null;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.orders.loading = false;

        // 선택된 주문 업데이트
        if (
          state.orders.selectedOrder &&
          state.orders.selectedOrder.id === action.payload.orderId
        ) {
          state.orders.selectedOrder = {
            ...state.orders.selectedOrder,
            ...action.payload.data,
          };
        }

        // 목록에서도 해당 주문 업데이트
        const orderIndex = state.orders.list.findIndex(
          (order) => order.id === action.payload.orderId,
        );
        if (orderIndex !== -1) {
          state.orders.list[orderIndex] = {
            ...state.orders.list[orderIndex],
            ...action.payload.data,
          };
        }
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.orders.loading = false;
        state.orders.error = action.payload;
      })

      // 카테고리 목록 조회
      .addCase(fetchCategories.pending, (state) => {
        state.categories.loading = true;
        state.categories.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories.loading = false;
        state.categories.list = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categories.loading = false;
        state.categories.error = action.payload;
      })

      // 카테고리 생성
      .addCase(createCategory.pending, (state) => {
        state.categories.loading = true;
        state.categories.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.loading = false;
        state.categories.list = [...state.categories.list, action.payload];
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.categories.loading = false;
        state.categories.error = action.payload;
      })

      // 카테고리 수정
      .addCase(updateCategory.pending, (state) => {
        state.categories.loading = true;
        state.categories.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.categories.loading = false;

        // 선택된 카테고리 업데이트
        if (
          state.categories.selectedCategory &&
          state.categories.selectedCategory.id === action.payload.id
        ) {
          state.categories.selectedCategory = action.payload;
        }

        // 목록에서도 해당 카테고리 업데이트
        const categoryIndex = state.categories.list.findIndex(
          (category) => category.id === action.payload.id,
        );
        if (categoryIndex !== -1) {
          state.categories.list[categoryIndex] = action.payload;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.categories.loading = false;
        state.categories.error = action.payload;
      })

      // 카테고리 삭제
      .addCase(deleteCategory.pending, (state) => {
        state.categories.loading = true;
        state.categories.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories.loading = false;

        // 목록에서 해당 카테고리 제거
        state.categories.list = state.categories.list.filter(
          (category) => category.id !== action.payload.categoryId,
        );

        // 선택된 카테고리가 삭제된 카테고리라면 null로 설정
        if (
          state.categories.selectedCategory &&
          state.categories.selectedCategory.id === action.payload.categoryId
        ) {
          state.categories.selectedCategory = null;
        }
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.categories.loading = false;
        state.categories.error = action.payload;
      })

      // 문의 목록 조회
      .addCase(fetchInquiries.pending, (state) => {
        state.inquiries.loading = true;
        state.inquiries.error = null;
      })
      .addCase(fetchInquiries.fulfilled, (state, action) => {
        state.inquiries.loading = false;
        state.inquiries.list = action.payload.inquiries;
        state.inquiries.pagination = action.payload.pagination;
      })
      .addCase(fetchInquiries.rejected, (state, action) => {
        state.inquiries.loading = false;
        state.inquiries.error = action.payload;
      })

      // 문의 상세 조회
      .addCase(fetchInquiryDetail.pending, (state) => {
        state.inquiries.loading = true;
        state.inquiries.error = null;
      })
      .addCase(fetchInquiryDetail.fulfilled, (state, action) => {
        state.inquiries.loading = false;
        state.inquiries.selectedInquiry = action.payload;
      })
      .addCase(fetchInquiryDetail.rejected, (state, action) => {
        state.inquiries.loading = false;
        state.inquiries.error = action.payload;
      })

      // 문의 답변 작성
      .addCase(answerInquiry.pending, (state) => {
        state.inquiries.loading = true;
        state.inquiries.error = null;
      })
      .addCase(answerInquiry.fulfilled, (state, action) => {
        state.inquiries.loading = false;

        // 선택된 문의 업데이트
        if (
          state.inquiries.selectedInquiry &&
          state.inquiries.selectedInquiry.id === action.payload.inquiryId
        ) {
          state.inquiries.selectedInquiry = {
            ...state.inquiries.selectedInquiry,
            answers: [
              ...(state.inquiries.selectedInquiry.answers || []),
              action.payload.data,
            ],
            status: 'answered',
          };
        }

        // 목록에서도 해당 문의 상태 업데이트
        const inquiryIndex = state.inquiries.list.findIndex(
          (inquiry) => inquiry.id === action.payload.inquiryId,
        );
        if (inquiryIndex !== -1) {
          state.inquiries.list[inquiryIndex].status = 'answered';
        }
      })
      .addCase(answerInquiry.rejected, (state, action) => {
        state.inquiries.loading = false;
        state.inquiries.error = action.payload;
      })

      // 문의 상태 변경
      .addCase(updateInquiryStatus.pending, (state) => {
        state.inquiries.loading = true;
        state.inquiries.error = null;
      })
      .addCase(updateInquiryStatus.fulfilled, (state, action) => {
        state.inquiries.loading = false;

        // 선택된 문의 업데이트
        if (
          state.inquiries.selectedInquiry &&
          state.inquiries.selectedInquiry.id === action.payload.inquiryId
        ) {
          state.inquiries.selectedInquiry = {
            ...state.inquiries.selectedInquiry,
            status: action.payload.data.status,
          };
        }

        // 목록에서도 해당 문의 상태 업데이트
        const inquiryIndex = state.inquiries.list.findIndex(
          (inquiry) => inquiry.id === action.payload.inquiryId,
        );
        if (inquiryIndex !== -1) {
          state.inquiries.list[inquiryIndex].status =
            action.payload.data.status;
        }
      })
      .addCase(updateInquiryStatus.rejected, (state, action) => {
        state.inquiries.loading = false;
        state.inquiries.error = action.payload;
      })

      .addCase(createProductVariant.pending, (state) => {
        state.products.loading = true;
        state.products.error = null;
      })
      .addCase(createProductVariant.fulfilled, (state, action) => {
        state.products.loading = false;

        // 선택된 상품 업데이트 (필요한 경우)
        if (
          state.products.selectedProduct &&
          state.products.selectedProduct.id === action.payload.productId
        ) {
          if (!state.products.selectedProduct.variants) {
            state.products.selectedProduct.variants = [];
          }
          state.products.selectedProduct.variants.push(action.payload.variant);
        }
      })
      .addCase(createProductVariant.rejected, (state, action) => {
        state.products.loading = false;
        state.products.error = action.payload;
      })
      .addCase(fetchProductVariants.pending, (state) => {
        state.products.loading = true;
        state.products.error = null;
      })
      .addCase(fetchProductVariants.fulfilled, (state, action) => {
        state.products.loading = false;

        // 선택된 상품이 있고, 해당 상품의 변형이 조회된 경우
        if (
          state.products.selectedProduct &&
          state.products.selectedProduct.id === Number(action.payload.productId)
        ) {
          state.products.selectedProduct.variants = action.payload.variants;
        }
      })
      .addCase(fetchProductVariants.rejected, (state, action) => {
        state.products.loading = false;
        state.products.error = action.payload;
      })

      // 옵션 타입 목록 조회
      .addCase(fetchOptionTypes.pending, (state) => {
        state.optionTypes.loading = true;
        state.optionTypes.error = null;
      })
      .addCase(fetchOptionTypes.fulfilled, (state, action) => {
        state.optionTypes.loading = false;
        state.optionTypes.list = action.payload;
      })
      .addCase(fetchOptionTypes.rejected, (state, action) => {
        state.optionTypes.loading = false;
        state.optionTypes.error = action.payload;
      })
      // 액션 처리 추가
      .addCase(createOptionValue.pending, (state) => {
        state.optionTypes.loading = true;
        state.optionTypes.error = null;
      })
      .addCase(createOptionValue.fulfilled, (state, action) => {
        state.optionTypes.loading = false;

        // 옵션 타입을 찾아서 새 옵션 값 추가
        const optionTypeIndex = state.optionTypes.list.findIndex(
          (type) => type.id === action.payload.optionTypeId,
        );

        if (optionTypeIndex !== -1) {
          if (!state.optionTypes.list[optionTypeIndex].values) {
            state.optionTypes.list[optionTypeIndex].values = [];
          }
          state.optionTypes.list[optionTypeIndex].values.push(
            action.payload.optionValue,
          );
        }
      })
      .addCase(createOptionValue.rejected, (state, action) => {
        state.optionTypes.loading = false;
        state.optionTypes.error = action.payload;
      })
      .addCase(createOptionType.pending, (state) => {
        state.optionTypes.loading = true;
        state.optionTypes.error = null;
      })
      .addCase(createOptionType.fulfilled, (state, action) => {
        state.optionTypes.loading = false;
        state.optionTypes.list = [...state.optionTypes.list, action.payload];
      })
      .addCase(createOptionType.rejected, (state, action) => {
        state.optionTypes.loading = false;
        state.optionTypes.error = action.payload;
      })

      .addCase(updateProductVariant.pending, (state) => {
        state.products.loading = true;
        state.products.error = null;
      })
      .addCase(updateProductVariant.fulfilled, (state, action) => {
        state.products.loading = false;
        
        // 선택된 상품이 있고, 해당 상품의 변형이 업데이트된 경우
        if (state.products.selectedProduct) {
          const variantIndex = state.products.selectedProduct.variants?.findIndex(
            v => v.id === action.payload.variantId
          );
          
          if (variantIndex !== -1 && variantIndex !== undefined) {
            state.products.selectedProduct.variants[variantIndex] = action.payload.variant;
          }
        }
      })
      .addCase(updateProductVariant.rejected, (state, action) => {
        state.products.loading = false;
        state.products.error = action.payload;
      })

      // 모든 상품 변형 조회
      .addCase(fetchAllProductVariants.fulfilled, (state, action) => {
        state.allProductVariants = action.payload;
      })
      .addCase(fetchAllOptionValues.fulfilled, (state, action) => {
        state.allOptionValues = action.payload;
      });
     
  },
});

// 액션 생성자 내보내기
export const {
  selectUser,
  selectProduct,
  selectOrder,
  selectCategory,
  selectInquiry,
  clearError,
} = adminSlice.actions;

// 리듀서 내보내기
export default adminSlice.reducer;

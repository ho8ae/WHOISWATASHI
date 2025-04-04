// features/products/productsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productsAPI } from './productsAPI';

// 상품 목록 조회 비동기 액션
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params, { rejectWithValue }) => {
    try {
      const response = await productsAPI.getProducts(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || '상품 목록 조회에 실패했습니다.');
    }
  }
);

// 상품 상세 조회 비동기 액션
export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const numericId = Number(id);
      const response = await productsAPI.getProductById(numericId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || '상품 상세 조회에 실패했습니다.');
    }
  }
);

// 카테고리 목록 조회 비동기 액션
export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productsAPI.getCategories();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || '카테고리 목록 조회에 실패했습니다.');
    }
  }
);

// 초기 상태
const initialState = {
  products: [],
  product: null,
  categories: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  },
  filters: {
    categoryId: null,
    search: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  },
  loading: false,
  error: null
};

// Products 슬라이스
const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // 필터 설정
    setFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload
      };
    },
    
    // 필터 초기화
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    
    // 에러 초기화
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // 상품 목록 조회 케이스
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        console.log('페이로드 확인:', action.payload);
        
        // 서버 응답 구조 처리
        if (action.payload && action.payload.products) {
          state.products = action.payload.products;
        } else if (action.payload && action.payload.data && action.payload.data.products) {
          state.products = action.payload.data.products;
        } else {
          console.warn('예상치 못한 응답 구조:', action.payload);
          state.products = [];
        }
        
        // 페이지네이션 정보 처리
        if (action.payload && action.payload.pagination) {
          state.pagination = action.payload.pagination;
        } else if (action.payload && action.payload.data && action.payload.data.pagination) {
          state.pagination = action.payload.data.pagination;
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // 상품 상세 조회 케이스
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload.data;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // 카테고리 목록 조회 케이스
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.data || [];
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// 액션 내보내기
export const { setFilters, resetFilters, clearError } = productsSlice.actions;

// 리듀서 내보내기
export default productsSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartAPI } from './cartAPI';

// 장바구니 조회 액션
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartAPI.getCart();
      return response; // 이미 { success: true, data: {...} } 형태로 반환됨
    } catch (error) {
      return rejectWithValue(error.message || '장바구니 조회에 실패했습니다.');
    }
  }
);

// 장바구니 상품 추가 액션
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productVariantId, quantity }, { rejectWithValue }) => {
    try {
      const response = await cartAPI.addToCart(productVariantId, quantity);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || '장바구니 추가에 실패했습니다.');
    }
  }
);

// 장바구니 아이템 수량 변경 액션
export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      const response = await cartAPI.updateCartItem(itemId, quantity);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || '장바구니 수정에 실패했습니다.');
    }
  }
);

// 장바구니 아이템 삭제 액션
export const removeCartItem = createAsyncThunk(
  'cart/removeCartItem',
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await cartAPI.removeCartItem(itemId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || '장바구니 아이템 삭제에 실패했습니다.');
    }
  }
);

// 장바구니 비우기 액션
export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartAPI.clearCart();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || '장바구니 비우기에 실패했습니다.');
    }
  }
);

// 초기 상태
const initialState = {
  items: [],
  itemCount: 0,
  subtotal: 0,
  loading: false,
  error: null
};

// 장바구니 슬라이스
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // 에러 초기화
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // 장바구니 조회
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        
        // 응답 구조 처리
        if (action.payload && action.payload.success && action.payload.data) {
          state.items = action.payload.data.items || [];
          state.itemCount = action.payload.data.itemCount || 0;
          state.subtotal = action.payload.data.subtotal || 0;
        } else {
          console.warn('예상치 못한 응답 구조:', action.payload);
          state.items = [];
          state.itemCount = 0;
          state.subtotal = 0;
        }
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // 장바구니 상품 추가
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        
        if (action.payload && action.payload.data) {
          state.items = action.payload.data.items || [];
          state.itemCount = action.payload.data.itemCount || 0;
          state.subtotal = action.payload.data.subtotal || 0;
        }
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // 장바구니 아이템 수량 변경
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        
        if (action.payload && action.payload.data) {
          state.items = action.payload.data.items || [];
          state.itemCount = action.payload.data.itemCount || 0;
          state.subtotal = action.payload.data.subtotal || 0;
        }
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // 장바구니 아이템 삭제
      .addCase(removeCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.loading = false;
        
        if (action.payload && action.payload.data) {
          state.items = action.payload.data.items || [];
          state.itemCount = action.payload.data.itemCount || 0;
          state.subtotal = action.payload.data.subtotal || 0;
        }
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // 장바구니 비우기
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.itemCount = 0;
        state.subtotal = 0;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// 액션 내보내기
export const { clearError } = cartSlice.actions;

// 리듀서 내보내기
export default cartSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderAPI } from './orderAPI';

// 주문 생성 액션
export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await orderAPI.createOrder(orderData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || '주문 생성에 실패했습니다.');
    }
  }
);

// 주문 상세 조회 액션
export const fetchOrderById = createAsyncThunk(
  'order/fetchOrderById',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await orderAPI.getOrderById(orderId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || '주문 조회에 실패했습니다.');
    }
  }
);

// 사용자 주문 목록 조회 액션
export const fetchUserOrders = createAsyncThunk(
  'order/fetchUserOrders',
  async (params, { rejectWithValue }) => {
    try {
      const response = await orderAPI.getUserOrders(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || '주문 목록 조회에 실패했습니다.');
    }
  }
);

// 비회원 주문 조회 액션
export const fetchGuestOrder = createAsyncThunk(
  'order/fetchGuestOrder',
  async (data, { rejectWithValue }) => {
    try {
      const response = await orderAPI.getGuestOrder(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || '비회원 주문 조회에 실패했습니다.');
    }
  }
);

// 주문 취소 액션
export const cancelOrder = createAsyncThunk(
  'order/cancelOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await orderAPI.cancelOrder(orderId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || '주문 취소에 실패했습니다.');
    }
  }
);

// 포트원 결제 검증 액션
export const verifyPortOnePayment = createAsyncThunk(
  'order/verifyPortOnePayment',
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await orderAPI.verifyPortOnePayment(paymentData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || '결제 검증에 실패했습니다.');
    }
  }
);

// 초기 상태
const initialState = {
  currentOrder: null,
  orderList: [],
  pagination: null,
  loading: false,
  error: null,
  paymentResult: null,
  orderCreated: false
};

// 주문 슬라이스
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    // 에러 초기화
    clearError: (state) => {
      state.error = null;
    },
    // 주문 생성 상태 초기화
    resetOrderCreated: (state) => {
      state.orderCreated = false;
    },
    // 결제 결과 초기화
    resetPaymentResult: (state) => {
      state.paymentResult = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // 주문 생성
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.orderCreated = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload.data;
        state.orderCreated = true;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.orderCreated = false;
      })
      
      // 주문 상세 조회
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload.data;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // 사용자 주문 목록 조회
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orderList = action.payload.orders;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // 비회원 주문 조회
      .addCase(fetchGuestOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGuestOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload.data;
      })
      .addCase(fetchGuestOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // 주문 취소
      .addCase(cancelOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentOrder && state.currentOrder.id === action.meta.arg) {
          state.currentOrder = {
            ...state.currentOrder,
            status: 'cancelled'
          };
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // 포트원 결제 검증
      .addCase(verifyPortOnePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPortOnePayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentResult = action.payload.data;
      })
      .addCase(verifyPortOnePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// 액션 내보내기
export const { clearError, resetOrderCreated, resetPaymentResult } = orderSlice.actions;

// 리듀서 내보내기
export default orderSlice.reducer;
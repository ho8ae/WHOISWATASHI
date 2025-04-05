import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderAPI } from './orderAPI';

// 주문 생성 액션
export const createNewOrder = createAsyncThunk(
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

// 주문 목록 조회 액션
export const fetchOrders = createAsyncThunk(
  'order/fetchOrders',
  async (params, { rejectWithValue }) => {
    try {
      const response = await orderAPI.getOrders(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || '주문 목록 조회에 실패했습니다.');
    }
  }
);

// 주문 상세 조회 액션
export const fetchOrderById = createAsyncThunk(
  'order/fetchOrderById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await orderAPI.getOrderById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || '주문 상세 조회에 실패했습니다.');
    }
  }
);

// 주문 취소 액션
export const cancelExistingOrder = createAsyncThunk(
  'order/cancelOrder',
  async (id, { rejectWithValue }) => {
    try {
      const response = await orderAPI.cancelOrder(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || '주문 취소에 실패했습니다.');
    }
  }
);

// 결제 검증 액션
export const verifyOrderPayment = createAsyncThunk(
  'order/verifyPayment',
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await orderAPI.verifyPayment(paymentData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || '결제 검증에 실패했습니다.');
    }
  }
);

// 초기 상태
const initialState = {
  orders: [],
  currentOrder: null,
  orderId: null,
  orderNumber: null,
  paymentStatus: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  },
  loading: false,
  error: null
};

// Orders 슬라이스
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrderState: (state) => {
      state.currentOrder = null;
      state.orderId = null;
      state.orderNumber = null;
      state.paymentStatus = null;
      state.error = null;
    },
    clearOrderError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // 주문 생성
      .addCase(createNewOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.loading = false;
        
        if (action.payload && action.payload.data) {
          state.orderId = action.payload.data.orderId;
          state.orderNumber = action.payload.data.orderNumber;
          state.currentOrder = action.payload.data;
        }
      })
      .addCase(createNewOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // 주문 목록 조회
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        
        if (action.payload && action.payload.data) {
          state.orders = action.payload.data.orders || [];
          
          if (action.payload.data.pagination) {
            state.pagination = action.payload.data.pagination;
          }
        }
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // 주문 상세 조회
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        
        if (action.payload && action.payload.data) {
          state.currentOrder = action.payload.data;
          state.paymentStatus = action.payload.data.paymentStatus;
        }
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // 주문 취소
      .addCase(cancelExistingOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelExistingOrder.fulfilled, (state, action) => {
        state.loading = false;
        
        if (state.currentOrder && action.payload && action.payload.data) {
          state.currentOrder.status = 'cancelled';
        }
      })
      .addCase(cancelExistingOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // 결제 검증
      .addCase(verifyOrderPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOrderPayment.fulfilled, (state, action) => {
        state.loading = false;
        
        if (action.payload && action.payload.data) {
          state.paymentStatus = 'paid';
          
          if (state.currentOrder) {
            state.currentOrder.paymentStatus = 'paid';
            state.currentOrder.status = 'processing';
          }
        }
      })
      .addCase(verifyOrderPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// 액션 내보내기
export const { resetOrderState, clearOrderError } = orderSlice.actions;

// 리듀서 내보내기
export default orderSlice.reducer;
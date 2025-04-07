import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { mypageAPI } from './mypageAPI';

// 사용자 프로필 조회 액션
export const fetchProfile = createAsyncThunk(
  'mypage/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await mypageAPI.getProfile();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || '프로필 조회에 실패했습니다.');
    }
  },
);

// 사용자 프로필 수정 액션
export const updateProfile = createAsyncThunk(
  'mypage/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await mypageAPI.updateProfile(profileData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || '프로필 수정에 실패했습니다.');
    }
  },
);

// 사용자 주문 목록 조회 액션
export const fetchOrders = createAsyncThunk(
  'mypage/fetchOrders',
  async ({ page = 1, limit = 10, status }, { rejectWithValue }) => {
    try {
      const response = await mypageAPI.getOrders(page, limit, status);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || '주문 목록 조회에 실패했습니다.');
    }
  },
);

// 주문 상세 조회 액션
export const fetchOrderDetail = createAsyncThunk(
  'mypage/fetchOrderDetail',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await mypageAPI.getOrderDetail(orderId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || '주문 상세 조회에 실패했습니다.');
    }
  },
);

// 주문 배송 상태 조회 액션
export const fetchOrderTracking = createAsyncThunk(
  'mypage/fetchOrderTracking',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await mypageAPI.getOrderTracking(orderId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || '배송 상태 조회에 실패했습니다.');
    }
  },
);

// 위시리스트 조회 액션
export const fetchWishlist = createAsyncThunk(
  'mypage/fetchWishlist',
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await mypageAPI.getWishlist(page, limit);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.message || '위시리스트 조회에 실패했습니다.',
      );
    }
  },
);

// 위시리스트 아이템 삭제 액션
export const removeWishlistItem = createAsyncThunk(
  'mypage/removeWishlistItem',
  async (wishlistItemId, { rejectWithValue }) => {
    try {
      const response = await mypageAPI.removeWishlistItem(wishlistItemId);
      return { ...response, removedItemId: wishlistItemId };
    } catch (error) {
      return rejectWithValue(
        error.message || '위시리스트 아이템 삭제에 실패했습니다.',
      );
    }
  },
);

// 주문 취소 액션
export const cancelOrder = createAsyncThunk(
  'mypage/cancelOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await mypageAPI.cancelOrder(orderId);
      return { ...response, canceledOrderId: orderId };
    } catch (error) {
      return rejectWithValue(error.message || '주문 취소에 실패했습니다.');
    }
  },
);

// 위시리스트에 상품 추가 액션
export const addToWishlist = createAsyncThunk(
  'mypage/addToWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await mypageAPI.addToWishlist(productId);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.message || '위시리스트 추가에 실패했습니다.',
      );
    }
  },
);

// 위시리스트 상품 확인 액션
export const checkWishlistItem = createAsyncThunk(
  'mypage/checkWishlistItem',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await mypageAPI.checkWishlistItem(productId);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.message || '위시리스트 확인에 실패했습니다.',
      );
    }
  },
);

// 위시리스트에서 상품 삭제 액션
export const removeProductFromWishlist = createAsyncThunk(
  'mypage/removeProductFromWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await mypageAPI.removeProductFromWishlist(productId);
      return { ...response, removedProductId: productId };
    } catch (error) {
      return rejectWithValue(
        error.message || '위시리스트 삭제에 실패했습니다.',
      );
    }
  },
);


// 초기 상태
const initialState = {
  profile: null,
  orders: {
    items: [],
    pagination: {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0
    }
  },
  selectedOrder: null,
  orderTracking: null,
  wishlist: {
    items: [],
    pagination: {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0
    }
  },
  productInWishlist: false,
  loading: {
    profile: false,
    orders: false,
    orderDetail: false,
    orderTracking: false,
    wishlist: false,
    wishlistCheck: false,
    wishlistAdd: false,
    wishlistRemove: false
  },
  error: {
    profile: null,
    orders: null,
    orderDetail: null,
    orderTracking: null,
    wishlist: null,
    wishlistCheck: null,
    wishlistAdd: null,
    wishlistRemove: null
  }
};

// 마이페이지 슬라이스
const mypageSlice = createSlice({
  name: 'mypage',
  initialState,
  reducers: {
    // 에러 초기화
    clearProfileError: (state) => {
      state.error.profile = null;
    },
    clearOrdersError: (state) => {
      state.error.orders = null;
    },
    clearOrderDetailError: (state) => {
      state.error.orderDetail = null;
    },
    clearOrderTrackingError: (state) => {
      state.error.orderTracking = null;
    },
    clearWishlistError: (state) => {
      state.error.wishlist = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 프로필 조회
      .addCase(fetchProfile.pending, (state) => {
        state.loading.profile = true;
        state.error.profile = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading.profile = false;
        if (action.payload?.data) {
          state.profile = action.payload.data;
        }
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading.profile = false;
        state.error.profile = action.payload;
      })

      // 프로필 수정
      .addCase(updateProfile.pending, (state) => {
        state.loading.profile = true;
        state.error.profile = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading.profile = false;
        if (action.payload?.data) {
          state.profile = action.payload.data;
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading.profile = false;
        state.error.profile = action.payload;
      })

      // 주문 목록 조회
      .addCase(fetchOrders.pending, (state) => {
        state.loading.orders = true;
        state.error.orders = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading.orders = false;
        if (action.payload?.orders) {
          state.orders.items = action.payload.orders;
          state.orders.pagination = action.payload.pagination || {
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 0,
          };
        }
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading.orders = false;
        state.error.orders = action.payload;
      })

      // 주문 상세 조회
      .addCase(fetchOrderDetail.pending, (state) => {
        state.loading.orderDetail = true;
        state.error.orderDetail = null;
      })
      .addCase(fetchOrderDetail.fulfilled, (state, action) => {
        state.loading.orderDetail = false;
        if (action.payload?.data) {
          state.selectedOrder = action.payload.data;
        }
      })
      .addCase(fetchOrderDetail.rejected, (state, action) => {
        state.loading.orderDetail = false;
        state.error.orderDetail = action.payload;
      })

      // 주문 배송 상태 조회
      .addCase(fetchOrderTracking.pending, (state) => {
        state.loading.orderTracking = true;
        state.error.orderTracking = null;
      })
      .addCase(fetchOrderTracking.fulfilled, (state, action) => {
        state.loading.orderTracking = false;
        if (action.payload?.data) {
          state.orderTracking = action.payload.data;
        }
      })
      .addCase(fetchOrderTracking.rejected, (state, action) => {
        state.loading.orderTracking = false;
        state.error.orderTracking = action.payload;
      })

      // 위시리스트 조회
      .addCase(fetchWishlist.pending, (state) => {
        state.loading.wishlist = true;
        state.error.wishlist = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading.wishlist = false;
        if (action.payload?.data) {
          state.wishlist.items = action.payload.data.items;
          state.wishlist.pagination = action.payload.data.pagination || {
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 0,
          };
        }
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading.wishlist = false;
        state.error.wishlist = action.payload;
      })

      // 위시리스트 아이템 삭제
      .addCase(removeWishlistItem.pending, (state) => {
        state.loading.wishlist = true;
        state.error.wishlist = null;
      })
      .addCase(removeWishlistItem.fulfilled, (state, action) => {
        state.loading.wishlist = false;
        if (action.payload?.removedItemId) {
          state.wishlist.items = state.wishlist.items.filter(
            (item) => item.id !== action.payload.removedItemId,
          );
        }
      })
      .addCase(removeWishlistItem.rejected, (state, action) => {
        state.loading.wishlist = false;
        state.error.wishlist = action.payload;
      })

      // 주문 취소
      .addCase(cancelOrder.pending, (state) => {
        state.loading.orders = true;
        state.error.orders = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading.orders = false;
        if (action.payload?.canceledOrderId) {
          // 주문 목록 업데이트
          state.orders.items = state.orders.items.map((order) => {
            if (order.id === action.payload.canceledOrderId) {
              return { ...order, status: 'cancelled' };
            }
            return order;
          });

          // 선택된 주문이 있고, 취소된 주문이라면 업데이트
          if (
            state.selectedOrder &&
            state.selectedOrder.id === action.payload.canceledOrderId
          ) {
            state.selectedOrder = {
              ...state.selectedOrder,
              status: 'cancelled',
            };
          }
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading.orders = false;
        state.error.orders = action.payload;
      })
      // 위시리스트 상품 확인
      .addCase(checkWishlistItem.pending, (state) => {
        state.loading.wishlistCheck = true;
        state.error.wishlistCheck = null;
      })
      .addCase(checkWishlistItem.fulfilled, (state, action) => {
        state.loading.wishlistCheck = false;
        if (action.payload?.data) {
          state.productInWishlist = action.payload.data.isInWishlist;
        }
      })
      .addCase(checkWishlistItem.rejected, (state, action) => {
        state.loading.wishlistCheck = false;
        state.error.wishlistCheck = action.payload;
      })

      // 위시리스트에 상품 추가
      .addCase(addToWishlist.pending, (state) => {
        state.loading.wishlistAdd = true;
        state.error.wishlistAdd = null;
      })
      .addCase(addToWishlist.fulfilled, (state) => {
        state.loading.wishlistAdd = false;
        state.productInWishlist = true;
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading.wishlistAdd = false;
        state.error.wishlistAdd = action.payload;
      })

      // 위시리스트에서 상품 삭제
      .addCase(removeProductFromWishlist.pending, (state) => {
        state.loading.wishlistRemove = true;
        state.error.wishlistRemove = null;
      })
      .addCase(removeProductFromWishlist.fulfilled, (state) => {
        state.loading.wishlistRemove = false;
        state.productInWishlist = false;
      })
      .addCase(removeProductFromWishlist.rejected, (state, action) => {
        state.loading.wishlistRemove = false;
        state.error.wishlistRemove = action.payload;
      });
  },
});

// 액션 내보내기
export const {
  clearProfileError,
  clearOrdersError,
  clearOrderDetailError,
  clearOrderTrackingError,
  clearWishlistError,
} = mypageSlice.actions;

// 리듀서 내보내기
export default mypageSlice.reducer;

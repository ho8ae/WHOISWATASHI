// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import authReducer from '../features/auth/authSlice';
import adminReducer from '../features/admin/adminSlice';

// 리듀서 설정
const rootReducer = combineReducers({
  auth: authReducer,
  admin: adminReducer,
  // 다른 리듀서들...
});

// persist 설정
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // auth 상태만 유지
};

// persist reducer 생성
const persistedReducer = persistReducer(persistConfig, rootReducer);

// store 생성
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // redux-persist를 위한 non-serializable 값 무시
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

// persistor 생성
export const persistor = persistStore(store);
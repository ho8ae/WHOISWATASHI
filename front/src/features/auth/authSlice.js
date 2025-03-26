import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from './authAPI';

// 로그인 비동기 액션
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(email, password);
      
      // 토큰 저장
      if (response.data && response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
      }
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || '로그인에 실패했습니다.');
    }
  }
);

// 로그아웃 비동기 액션
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.logout();
      
      // 토큰 삭제
      localStorage.removeItem('accessToken');
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message || '로그아웃에 실패했습니다.');
    }
  }
);

// 회원가입 비동기 액션
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(userData);
      
      // 토큰 저장
      if (response.data && response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
      }
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || '회원가입에 실패했습니다.');
    }
  }
);

// 현재 사용자 정보 조회 비동기 액션
export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.getCurrentUser();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || '사용자 정보 조회에 실패했습니다.');
    }
  }
);

// 문자 인증번호 발송 비동기 액션
export const sendVerificationCode = createAsyncThunk(
  'auth/sendVerificationCode',
  async (phone, { rejectWithValue }) => {
    try {
      const response = await authAPI.sendVerificationCode(phone);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || '인증번호 발송에 실패했습니다.');
    }
  }
);

// 인증번호 확인 비동기 액션
export const verifyCode = createAsyncThunk(
  'auth/verifyCode',
  async ({ phone, code }, { rejectWithValue }) => {
    try {
      const response = await authAPI.verifyCode(phone, code);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || '인증번호 확인에 실패했습니다.');
    }
  }
);

// 비밀번호 재설정 요청 비동기 액션
export const requestPasswordReset = createAsyncThunk(
  'auth/requestPasswordReset',
  async (email, { rejectWithValue }) => {
    try {
      const response = await authAPI.requestPasswordReset(email);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || '비밀번호 재설정 요청에 실패했습니다.');
    }
  }
);

// 비밀번호 재설정 토큰 검증 비동기 액션
export const verifyResetToken = createAsyncThunk(
  'auth/verifyResetToken',
  async ({ email, token }, { rejectWithValue }) => {
    try {
      const response = await authAPI.verifyResetToken(email, token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || '비밀번호 재설정 토큰 검증에 실패했습니다.');
    }
  }
);

// 비밀번호 재설정 비동기 액션
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ userId, resetId, password }, { rejectWithValue }) => {
    try {
      const response = await authAPI.resetPassword(userId, resetId, password);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || '비밀번호 재설정에 실패했습니다.');
    }
  }
);

// 초기 상태
const initialState = {
  user: null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  loading: false,
  error: null,
  verificationSent: false,
  verificationSuccess: false,
  passwordResetRequested: false,
  passwordResetVerified: false,
  passwordResetSuccess: false,
  passwordResetData: null,
  registerForm: {
    step: 1,       // 1: 이메일/비밀번호 입력, 2: 개인정보 입력, 3: 휴대폰 인증, 4: 완료
    data: {},      // 회원가입 입력 데이터 저장
  }
};

// Auth 슬라이스
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // 로그아웃 (로컬 상태만 변경)
    localLogout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('accessToken');
    },
    
    // 에러 초기화
    clearError: (state) => {
      state.error = null;
    },
    
    // 회원가입 단계 설정
    setRegisterStep: (state, action) => {
      state.registerForm.step = action.payload;
    },
    
    // 회원가입 데이터 업데이트
    updateRegisterData: (state, action) => {
      state.registerForm.data = {
        ...state.registerForm.data,
        ...action.payload
      };
    },
    
    // 회원가입 폼 초기화
    resetRegisterForm: (state) => {
      state.registerForm = initialState.registerForm;
      state.verificationSent = false;
      state.verificationSuccess = false;
    },
    
    // 비밀번호 재설정 상태 초기화
    resetPasswordResetState: (state) => {
      state.passwordResetRequested = false;
      state.passwordResetVerified = false;
      state.passwordResetSuccess = false;
      state.passwordResetData = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // 로그인 케이스
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // 로그아웃 케이스
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // 오류가 발생해도 로컬에서는 로그아웃 처리
        state.isAuthenticated = false;
        state.user = null;
      })
      
      // 회원가입 케이스
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.registerForm = initialState.registerForm;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // 현재 사용자 정보 조회 케이스
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // 사용자 정보 조회 실패 시 로그아웃 처리
        state.isAuthenticated = false;
        state.user = null;
        localStorage.removeItem('accessToken');
      })
      
      // 인증번호 발송 케이스
      .addCase(sendVerificationCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendVerificationCode.fulfilled, (state) => {
        state.loading = false;
        state.verificationSent = true;
      })
      .addCase(sendVerificationCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // 인증번호 확인 케이스
      .addCase(verifyCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyCode.fulfilled, (state) => {
        state.loading = false;
        state.verificationSuccess = true;
      })
      .addCase(verifyCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // 비밀번호 재설정 요청 케이스
      .addCase(requestPasswordReset.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestPasswordReset.fulfilled, (state) => {
        state.loading = false;
        state.passwordResetRequested = true;
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // 비밀번호 재설정 토큰 검증 케이스
      .addCase(verifyResetToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyResetToken.fulfilled, (state, action) => {
        state.loading = false;
        state.passwordResetVerified = true;
        state.passwordResetData = action.payload;
      })
      .addCase(verifyResetToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // 비밀번호 재설정 케이스
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.passwordResetSuccess = true;
        state.passwordResetData = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// 액션 내보내기
export const { 
  localLogout, 
  clearError, 
  setRegisterStep,
  updateRegisterData,
  resetRegisterForm,
  resetPasswordResetState
} = authSlice.actions;

// 리듀서 내보내기
export default authSlice.reducer;
import {
  forgotPasswordApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  refreshToken,
  registerUserApi,
  resetPasswordApi,
  TRegisterData,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';

export interface TUserAuth extends TUser {
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  passwordResetRequested: boolean;
  passwordResetSuccess: boolean;
}

export const initialState: TUserAuth = {
  email: '',
  name: '',
  isAuthChecked: false,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  passwordResetRequested: false,
  passwordResetSuccess: false
};

export const userRegister = createAsyncThunk(
  'user/register',
  async (
    {
      email,
      name,
      password
    }: { email: string; name: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await registerUserApi({ email, name, password });
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);

      return response.user;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const userLogin = createAsyncThunk(
  'user/login',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await loginUserApi({ email, password });

      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);

      return response.user;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const checkUserAuth = createAsyncThunk(
  'user/checkAuth',
  async (_, { rejectWithValue }) => {
    const accessToken = getCookie('accessToken');

    if (!accessToken) {
      return rejectWithValue('Токена нет');
    }

    try {
      const response = await getUserApi();

      return response.user;
    } catch (error) {
      try {
        const refreshTokenValue = localStorage.getItem('refreshToken');
        if (refreshTokenValue) {
          const refreshResponse = await refreshToken();

          setCookie('accessToken', refreshResponse.accessToken);
          localStorage.setItem('refreshToken', refreshResponse.refreshToken);

          const userResponse = await getUserApi();
          return userResponse.user;
        }
      } catch (refreshError) {
        deleteCookie('accessToken');
        localStorage.removeItem('refreshToken');
      }
      return rejectWithValue('Ошибка аутентификации');
    }
  }
);

export const userForgotPassword = createAsyncThunk(
  'user/forgotPassword',
  async ({ email }: { email: string }, { rejectWithValue }) => {
    try {
      const response = await forgotPasswordApi({ email });
      return response.success;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const userResetPassword = createAsyncThunk(
  'user/resetPassword',
  async (data: { password: string; token: string }, { rejectWithValue }) => {
    try {
      const response = await resetPasswordApi(data);
      return response.success;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/update',
  async (userData: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      const response = await updateUserApi(userData);
      return response.user;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await logoutApi();
      if (response.success) {
        localStorage.removeItem('refreshToken');
        deleteCookie('accessToken');

        return response;
      } else {
        return rejectWithValue('Ошибка при выходе');
      }
    } catch (_) {
      return rejectWithValue('Сетевая ошибка');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.email = action.payload.email;
      state.name = action.payload.name;
    }
  },
  extraReducers: (builder) => {
    builder

      // Вход

      .addCase(userLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isAuthenticated = false;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.email = action.payload.email;
        state.name = action.payload.name;
        state.isAuthChecked = true;
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
        state.isAuthChecked = true;
      })

      // Регистрация

      .addCase(userRegister.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isAuthenticated = false;
      })
      .addCase(userRegister.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.email = action.payload.email;
        state.name = action.payload.name;
        state.isAuthChecked = true;
      })
      .addCase(userRegister.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
        state.isAuthChecked = true;
      })

      // Запрос на сброс

      .addCase(userForgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(userForgotPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.passwordResetRequested = true;
      })
      .addCase(userForgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Сброс пароля

      .addCase(userResetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(userResetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.passwordResetRequested = false;
        state.passwordResetSuccess = true;
      })
      .addCase(userResetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Получение даннных пользователя

      .addCase(checkUserAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.email = action.payload.email;
        state.name = action.payload.name;
        state.isAuthChecked = true;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = null;
        state.isAuthChecked = true;
      })

      // Изменение данных пользователя

      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.email = action.payload.email;
        state.name = action.payload.name;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Выход
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
        state.email = '';
        state.name = '';
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export default userSlice.reducer;

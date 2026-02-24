import {
  forgotPasswordApi,
  getUserApi,
  loginUserApi,
  registerUserApi,
  resetPasswordApi,
  TRegisterData,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';

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
  passwordResetRequested: false, // запрос на сброс
  passwordResetSuccess: false // сброшен ли успешно пароль
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
      localStorage.setItem('accessToken', response.accessToken);
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
      console.log(response);
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);

      return response.user;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const userForgotPassword = createAsyncThunk(
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

const userResetPassword = createAsyncThunk(
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

const getUser = createAsyncThunk(
  'user/getData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserApi();
      return response.user;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const updateUser = createAsyncThunk(
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

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.email = action.payload.email;
      state.name = action.payload.name;
    },
    logout: (state) => {
      state.email = '';
      state.name = '';
      state.isAuthenticated = false;
      state.isAuthChecked = true;
      state.isLoading = false;
      state.error = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
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

      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.email = action.payload.email;
        state.name = action.payload.name;
        state.isAuthChecked = true;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
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
      });
  }
});

export default userSlice.reducer;

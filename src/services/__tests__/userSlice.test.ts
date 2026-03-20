import userSlice, {
  userRegister,
  userLogin,
  checkUserAuth,
  userForgotPassword,
  userResetPassword,
  updateUser,
  logoutUser,
  initialState
} from '../slices/userSlice';

jest.mock('../../utils/burger-api', () => ({
  registerUserApi: jest.fn(),
  loginUserApi: jest.fn(),
  getUserApi: jest.fn(),
  refreshToken: jest.fn(),
  forgotPasswordApi: jest.fn(),
  resetPasswordApi: jest.fn(),
  updateUserApi: jest.fn(),
  logoutApi: jest.fn()
}));

describe('userSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('должно иметь правильное начальное состояние', () => {
    expect(initialState).toEqual({
      email: '',
      name: '',
      isAuthChecked: false,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      passwordResetRequested: false,
      passwordResetSuccess: false
    });
  });

  // Регистрация
  describe('userRegister', () => {
    it('Тест должен обрабатывать успешную регистрацию', () => {
      const state = initialState;
      const mockUser = { email: 'test@test.ru', name: 'Тест' };
      const action = userRegister.fulfilled(mockUser, 'req-1', {
        email: 'test@test.ru',
        name: 'Тест',
        password: '123456789'
      });

      const newState = userSlice(state, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.isAuthenticated).toBe(true);
      expect(newState.email).toBe('test@test.ru');
      expect(newState.name).toBe('Тест');
      expect(newState.isAuthChecked).toBe(true);
      expect(newState.error).toBe(null);
    });

    it('Тест должен обрабатывать ошибку при регистрации', () => {
      const state = initialState;
      const errorMessage = 'Пользователь уже существует';

      const action = userRegister.rejected(new Error(errorMessage), 'req-1', {
        email: 'test@test.ru',
        name: 'Тест',
        password: '123456789'
      }, 'Пользователь уже существует');

      const newState = userSlice(state, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.isAuthenticated).toBe(false);
      expect(newState.error).toBe(errorMessage);
      expect(newState.isAuthChecked).toBe(true);
    });
  });
// Вход
  describe('userLogin', () => {
    it('Тест должен обрабатывать успешный вход', () => {
      const state = initialState;
      const mockUser = { email: 'test@test.ru', name: 'Тест' };
      const action = userLogin.fulfilled(mockUser, 'req-1', {
        email: 'test@test.ru',
        password: '123456789'
      });

      const newState = userSlice(state, action);

      expect(newState.isAuthenticated).toBe(true);
      expect(newState.email).toBe('test@test.ru');
      expect(newState.name).toBe('Тест');
    });

    it('Тест должен обрабатывать ошибку при входе', () => {
      const state = initialState;
      const action = userLogin.rejected(new Error('Неверный пароль'), 'req-1', {
        email: 'test@test.ru',
        password: 'wrong'
      }, 'Неверный пароль');

      const newState = userSlice(state, action);

      expect(newState.isAuthenticated).toBe(false);
      expect(newState.error).toBe('Неверный пароль');
    });
  });

  describe('checkUserAuth', () => {
    it('Тест должен успешно проверить авторизацию при наличии токена', () => {
      const state = initialState;
      const mockUser = { email: 'test@test.ru', name: 'Тест' };

      const action = checkUserAuth.fulfilled(mockUser, 'req-1', undefined);
      const newState = userSlice(state, action);

      expect(newState.isAuthenticated).toBe(true);
      expect(newState.email).toBe('test@test.ru');
      expect(newState.isAuthChecked).toBe(true);
    });

    it('Тест должен отклонить проверку, если токена нет', () => {
      const state = initialState;

      const action = checkUserAuth.rejected(
        new Error('Токена нет'),
        'req-1',
        undefined,
        'Токена нет'
      );
      const newState = userSlice(state, action);

      expect(newState.isAuthenticated).toBe(false);
      expect(newState.isAuthChecked).toBe(true);
      expect(newState.error).toBe(null);
    });
  });

  describe('userForgotPassword', () => {
    it('Тест должен обрабатывать успешный запрос на сброс пароля', () => {
      const state = initialState;

      const action = userForgotPassword.fulfilled(true, 'req-1', {
        email: 'test@test.ru'
      });
      const newState = userSlice(state, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.passwordResetRequested).toBe(true);
    });
  });

  describe('userResetPassword', () => {
    it('Тест должен обрабатывать успешный сброс пароля', () => {
      const state = initialState;

      const action = userResetPassword.fulfilled(true, 'req-1', {
        password: 'new123',
        token: 'abc'
      });
      const newState = userSlice(state, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.passwordResetRequested).toBe(false);
      expect(newState.passwordResetSuccess).toBe(true);
    });
  });

  describe('updateUser', () => {
    it('Тест должен обновлять данные пользователя', () => {
      const state = {
        ...initialState,
        email: 'old@test.ru',
        name: 'Старое имя'
      };
      const updatedUser = { email: 'new@test.ru', name: 'Новое имя' };

      const action = updateUser.fulfilled(updatedUser, 'req-1', {
        name: 'Новое имя'
      });
      const newState = userSlice(state, action);

      expect(newState.email).toBe('new@test.ru');
      expect(newState.name).toBe('Новое имя');
    });
  });

  describe('logoutUser', () => {
    it('Тест должен очищать данные при успешном выходе', () => {
      const state = {
        ...initialState,
        email: 'test@test.ru',
        name: 'Тест',
        isAuthenticated: true
      };

      const action = logoutUser.fulfilled(
        { success: true },
        'req-1',
        undefined
      );
      const newState = userSlice(state, action);

      expect(newState.isAuthenticated).toBe(false);
      expect(newState.email).toBe('');
      expect(newState.name).toBe('');
      expect(newState.isAuthChecked).toBe(true);
      expect(newState.error).toBe(null);
    });

    it('должен обрабатывать ошибку при выходе', () => {
      const state = initialState;
      const action = logoutUser.rejected(
        new Error('Ошибка при выходе'),
        'req-1',
        undefined,
        'Ошибка при выходе'
      );
      const newState = userSlice(state, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBe('Ошибка при выходе');
    });
  });
});

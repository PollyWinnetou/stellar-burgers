import { rootReducer } from '../store';

describe('rootReducer', () => {
  it('Тест должен возвращать корректное начальное состояние при инициализации', () => {
    const result = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(result).toEqual({
      ingredients: {
        ingredients: [],
        isLoading: false,
        error: null
      },
      constructorIngredients: {
        bun: null,
        ingredients: []
      },
      order: {
        orderRequest: false,
        orderModalData: null,
        orderSuccess: false,
        error: null
      },
      user: {
        email: '',
        name: '',
        isAuthChecked: false,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        passwordResetRequested: false,
        passwordResetSuccess: false
      },
      feed: {
        orders: [],
        total: 0,
        totalToday: 0,
        isLoading: false,
        error: null
      },
      userOrders: {
        orders: [],
        isLoading: false,
        error: null
      },
      selectOrder: {
        order: null,
        isLoading: false,
        error: null
      }
    });
  });

  it('Тест должен игнорировать неизвестные экшены и сохранять текущее состояние', () => {
    const currentState = {
      user: {
        email: 'test@test.ru',
        name: 'Тест',
        isAuthChecked: true,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        passwordResetRequested: false,
        passwordResetSuccess: false
      },
      ingredients: {
        ingredients: [],
        isLoading: false,
        error: null
      }
    };

    const result = rootReducer(currentState, { type: 'SOME_OLD_ACTION' });

    expect(result).toMatchObject(currentState);
  });
});

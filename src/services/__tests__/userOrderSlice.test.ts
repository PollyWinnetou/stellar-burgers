import userOrdersSlice, {
  getUserOrders,
  initialState
} from '../slices/userOrdersSlice';

jest.mock('../../utils/burger-api', () => ({
  getOrdersApi: jest.fn()
}));

describe('userOrderSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Проверка начального состояния', () => {
    expect(initialState).toEqual({
      orders: [],
      isLoading: false,
      error: null
    });
  });

  it('Проверка состояния загрузки', () => {
    const state = initialState;
    const action = getUserOrders.pending;
    const newState = userOrdersSlice(state, { type: action.type });
    expect(newState.isLoading).toBe(true);
    expect(newState.error).toBe(null);
  });

  it('Проверка состояния после успешной загрузки', () => {
    const state = initialState;

    const mockUserOrders = [
      {
        _id: 'order-123',
        status: 'done',
        name: 'Первый заказ',
        createdAt: '2026-01-15T10:00:00',
        updatedAt: '2026-01-15T10:05:00',
        number: 12345,
        ingredients: ['ing-1', 'ing-2']
      },
      {
        _id: 'order-456',
        status: 'done',
        name: 'Второй заказ',
        createdAt: '2026-01-15T11:00:00',
        updatedAt: '2026-01-15T11:05:00',
        number: 12346,
        ingredients: ['ing-3']
      }
    ];

    const action = getUserOrders.fulfilled(mockUserOrders, 'test_1');
    const newState = userOrdersSlice(state, action);

    expect(newState.orders).toEqual(mockUserOrders);
    expect(newState.isLoading).toBe(false);
    expect(newState.error).toBe(null);
  });

  it('Проверка на oшибки', () => {
    const state = initialState;
    const action = getUserOrders.rejected(new Error('Ошибка сети'), 'test_2');
    const newState = userOrdersSlice(state, action);
    expect(newState.isLoading).toBe(false);
    expect(newState.error).toBe('Ошибка сети');
  });
});

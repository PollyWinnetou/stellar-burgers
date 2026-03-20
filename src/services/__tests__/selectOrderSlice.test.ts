import selectOrderSlice, {
  initialState,
  getSelectOrder
} from '../slices/selectOrderSlice';

jest.mock('../../utils/burger-api', () => ({
  getOrderByNumberApi: jest.fn()
}));

describe('selectOrderSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Проверка начального состояния', () => {
    expect(initialState).toEqual({
      order: null,
      isLoading: false,
      error: null
    });
  });

  it('Проверка состояния загрузки', () => {
    const state = initialState;
    const action = getSelectOrder.pending;
    const newState = selectOrderSlice(state, { type: action.type });
    expect(newState.isLoading).toBe(true);
    expect(newState.error).toBe(null);
  });

  it('Проверка состояния после успешной загрузки', () => {
    const state = initialState;

    const mockSelectOrder = {
      _id: 'order-123',
      status: 'done',
      name: 'Тестовый заказ',
      createdAt: '2026-01-15T10:00:00',
      updatedAt: '2026-01-15T10:05:00',
      number: 12345,
      ingredients: ['ing-1', 'ing-2']
    };

    const action = getSelectOrder.fulfilled(mockSelectOrder, 'test_1', 12345);
    const newState = selectOrderSlice(state, action);

    expect(newState.order).toEqual(mockSelectOrder);
  });

  it('Проверка на oшибки', () => {
    const state = initialState;
    const action = getSelectOrder.rejected(new Error('Ошибка сети'),'test_2', 12345);
    const newState = selectOrderSlice(state, action);
    expect(newState.isLoading).toBe(false);
    expect(newState.error).toBe('Ошибка сети');
  });
})

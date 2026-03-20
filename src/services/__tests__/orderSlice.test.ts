import OrderSlice, {
  removeModalData,
  initialState,
  createOrder
} from '../slices/orderSlice';

jest.mock('../../utils/burger-api', () => ({
  orderBurgerApi: jest.fn()
}));

describe('orderSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Проверка начального состояния', () => {
    expect(initialState).toEqual({
      orderRequest: false,
      orderModalData: null,
      orderSuccess: false,
      error: null
    });
  });

  it('Проверка состояния загрузки', () => {
    const state = initialState;
    const action = createOrder.pending;
    const newState = OrderSlice(state, { type: action.type });
    expect(newState.orderRequest).toBe(true);
    expect(newState.orderSuccess).toBe(false);
    expect(newState.error).toBe(null);
  });

  it('Проверка состояния после успешного заказа', () => {
    const state = initialState;

    const mockOrder = {
      _id: 'order_1',
      status: 'done',
      name: 'Заказ 1',
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
      number: 12345,
      ingredients: ['id_1', 'id_2'],
      total: 1536
    };

    const action = createOrder.fulfilled(mockOrder, 'requestId', []);
    const newState = OrderSlice(state, action);

    expect(newState.orderRequest).toBe(false);
    expect(newState.orderSuccess).toBe(true);
    expect(newState.orderModalData).toEqual(mockOrder);
    expect(newState.error).toBe(null);
  });

  it('Проверка состояния при ошибке заказа', () => {
    const state = initialState;
    const action = createOrder.rejected(
      new Error('Ошибка сети'),
      'requestId',
      []
    );
    const newState = OrderSlice(state, action);

    expect(newState.orderRequest).toBe(false);
    expect(newState.orderSuccess).toBe(false);
    expect(newState.error).toBe('Ошибка сети');
  });

  it('Должен сбрасывать данные модального окна', () => {
    const state = {
      orderRequest: false,
      orderModalData: { _id: '123' } as any,
      orderSuccess: true,
      error: null
    };

    const action = removeModalData();
    const newState = OrderSlice(state, action);

    expect(newState.orderModalData).toBeNull();
    expect(newState.orderSuccess).toBe(false);
  });
});

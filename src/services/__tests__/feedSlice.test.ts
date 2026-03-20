import feedSlice, { getFeeds, initialState } from '../slices/feedSlice';

jest.mock('../../utils/burger-api', () => ({
  getFeedsApi: jest.fn()
}));

describe('feedsSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Проверка начального состояния', () => {
    expect(initialState).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      isLoading: false,
      error: null
    });
  });

  it('Проверка состояния загрузки', () => {
    const state = initialState;
    const action = getFeeds.pending;
    const newState = feedSlice(state, { type: action.type });
    expect(newState.isLoading).toBe(true);
    expect(newState.error).toBe(null);
  });

  it('Проверка состояния после успешной загрузки', () => {
    const state = initialState;

    const mockFeed = {
      success: true,
      orders: [
        {
          _id: 'order-123',
          status: 'done',
          name: 'Первый заказ',
          createdAt: '2026-01-15T10:00:00',
          updatedAt: '2026-01-15T10:05:00',
          number: 123456,
          ingredients: ['ing-1', 'ing-2', 'ing-3']
        },
        {
          _id: 'order-1234',
          status: 'done',
          name: 'Второй заказ',
          createdAt: '2026-01-15T10:00:00',
          updatedAt: '2026-01-15T10:05:00',
          number: 12345,
          ingredients: ['ing-1', 'ing-2']
        },
      ],
      total: 160,
      totalToday: 23
    };

    const action = getFeeds.fulfilled(mockFeed, 'test_1');
    const newState = feedSlice(state, action);

    expect(newState.orders).toEqual(mockFeed.orders);
    expect(newState.total).toBe(160);
    expect(newState.totalToday).toBe(23);
    expect(newState.isLoading).toBe(false);
    expect(newState.error).toBe(null);
  });

  it('Проверка на oшибки', () => {
    const state = initialState;
    const action = getFeeds.rejected(new Error('Ошибка сети'), 'test_2');
    const newState = feedSlice(state, action);
    expect(newState.isLoading).toBe(false);
    expect(newState.error).toBe('Ошибка сети');
  });
});

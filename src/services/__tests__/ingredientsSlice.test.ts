import ingredientsSlice, {
  fetchIngredients,
  initialState
} from '../slices/ingredientsSlice';

jest.mock('../../utils/burger-api', () => ({
  getIngredientsApi: jest.fn()
}));

describe('ingredientsSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Проверка начального состояния', () => {
    expect(initialState).toEqual({
      ingredients: [],
      isLoading: false,
      error: null
    });
  });

  it('Проверка состояния загрузки', () => {
    const state = initialState;
    const action = fetchIngredients.pending;
    const newState = ingredientsSlice(state, { type: action.type });
    expect(newState.isLoading).toBe(true);
    expect(newState.error).toBe(null);
  });

  it('Проверка состояния после успешной загрузки', () => {
    const state = initialState;
    const mockIngredients = [
      {
        _id: '643d69a5c3f7b9001cfa093c',
        name: 'Краторная булка N-200i',
        type: 'bun',
        proteins: 80,
        fat: 24,
        carbohydrates: 53,
        calories: 420,
        price: 1255,
        image: 'https://code.s3.yandex.net/react/code/bun-02.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
        __v: 0
      }
    ];
    const action = fetchIngredients.fulfilled(mockIngredients, 'test_id');
    const newState = ingredientsSlice(state, action);

    expect(newState.ingredients).toEqual(mockIngredients);
    expect(newState.isLoading).toBe(false);
    expect(newState.error).toBe(null);
  });

  it('Проверка на oшибки при неудаче', () => {
    const state = initialState;
    const action = fetchIngredients.rejected(
      new Error('Ошибка сети'),
      'test_id'
    );
    const newState = ingredientsSlice(state, action);
    expect(newState.isLoading).toBe(false);
    expect(newState.error).toBe('Ошибка сети');
  });
});

import constructorSlice, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  resetConstructor,
  initialState
} from '../slices/constructorSlice';
import { TConstructorIngredient } from '@utils-types';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mocked-uuid-123')
}));

describe('constructorSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Проверка начального состояния', () => {
    expect(initialState).toEqual({
      bun: null,
      ingredients: []
    });
  });

  it('Должен добавлять булку при добавлении ингредиента типа bun', () => {
    const state = initialState;

    const mockBun = {
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
    };

    const action = addIngredient(mockBun);
    const newState = constructorSlice(state, action);

    expect(newState.bun).toEqual({
      ...mockBun,
      id: 'mocked-uuid-123'
    });
    expect(newState.ingredients).toEqual([]);
  });

  it('Должен добавлять ингредиент в массив при type !== bun', () => {
    const state = initialState;

    const mockIngredient = {
      _id: '643d69a5c3f7b9001cfa0941',
      name: 'Биокотлета из марсианской Магнолии',
      type: 'main',
      proteins: 420,
      fat: 142,
      carbohydrates: 242,
      calories: 4242,
      price: 424,
      image: 'https://code.s3.yandex.net/react/code/meat-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
      __v: 0
    };

    const action = addIngredient(mockIngredient);
    const newState = constructorSlice(state, action);

    expect(newState.ingredients).toHaveLength(1);
    expect(newState.ingredients[0]).toEqual({
      ...mockIngredient,
      id: 'mocked-uuid-123'
    });
    expect(newState.bun).toBeNull();
  });

  it('Должен удалять ингредиент по id', () => {
    const state = {
      ...initialState,
      ingredients: [
        { ...initialState.ingredients[0], id: 'id_1', name: 'Ингредиент 1' },
        { ...initialState.ingredients[0], id: 'id_2', name: 'Ингредиент 2' },
        { ...initialState.ingredients[0], id: 'id_3', name: 'Ингредиент 3' }
      ]
    };

    const action = removeIngredient('id_3');
    const newState = constructorSlice(state, action);

    expect(newState.ingredients).toHaveLength(2);
    expect(newState.ingredients.map((i) => i.id)).toEqual(['id_1', 'id_2']);
  });

  it('Должен перемещать ингредиент с одной позиции на другую', () => {
    const state = {
      ...initialState,
      ingredients: [
        { id: 'id-1', name: 'Первый' },
        { id: 'id-2', name: 'Второй' },
        { id: 'id-3', name: 'Третий' }
      ] as TConstructorIngredient[]
    };

    const action = moveIngredient({ from: 0, to: 2 });
    const newState = constructorSlice(state, action);

    expect(newState.ingredients.map((i) => i.name)).toEqual([
      'Второй',
      'Третий',
      'Первый'
    ]);
  });

  it('Должен сбрасывать состояние к начальному', () => {
    const state = {
      bun: {
        id: 'bun-123',
        name: 'Булка',
        type: 'bun'
      } as TConstructorIngredient,
      ingredients: [
        {
          id: 'ing-123',
          name: 'Котлета',
          type: 'main'
        } as TConstructorIngredient
      ]
    };

    const action = resetConstructor();
    const newState = constructorSlice(state, action);

    expect(newState).toEqual(initialState);
    expect(newState.bun).toBeNull();
    expect(newState.ingredients).toEqual([]);
  });
});

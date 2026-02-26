import { FC } from 'react';
import { TIngredient } from '@utils-types';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import {
  selectIngredients,
  selectIngredientsError,
  selectIngredientsLoading
} from '../../services/selectors/ingredientsSelector';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();

  const ingredients = useSelector(selectIngredients);
  const isLoading = useSelector(selectIngredientsLoading);
  const error = useSelector(selectIngredientsError);

  const ingredientData = ingredients.find(
    (ingredient: TIngredient) => ingredient._id === id
  );

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};

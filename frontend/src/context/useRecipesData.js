import { useContext } from 'react';
import { RecipesContext } from './RecipesContext';

export const useRecipesData = () => useContext(RecipesContext);

import { useContext } from 'react';
import { SpoonacularContext } from './SpoonacularDataContext';

export const useSpoonacularData = () => useContext(SpoonacularContext);

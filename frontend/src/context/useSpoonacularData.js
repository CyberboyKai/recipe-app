import { useContext } from 'react';
import { SpoonacularContext } from './SpoonacularContext';

export const useSpoonacularData = () => useContext(SpoonacularContext);

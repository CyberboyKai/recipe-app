import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import './styles.css'

// import { SpoonacularProvider } from "./context/SpoonacularDataContext.jsx";
import { RecipesProvider } from "./context/RecipesDataContext.jsx";

createRoot(document.getElementById('root')).render(
 <StrictMode>
   <BrowserRouter>
      <RecipesProvider>
        <App />
      </RecipesProvider>
   </BrowserRouter>
 </StrictMode>,
)

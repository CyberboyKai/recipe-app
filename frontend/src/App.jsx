import { Route, Routes } from 'react-router-dom';

import Home from './pages/Home.jsx';
import NotFound from './pages/NotFound.jsx';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;

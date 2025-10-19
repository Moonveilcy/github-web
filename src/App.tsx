import { Routes, Route } from 'react-router-dom';
import { Hero } from './sections/Hero';
import { AppPage } from './pages/AppPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Hero />} />
      <Route path="/app" element={<AppPage />} />
    </Routes>
  );
}

export default App;
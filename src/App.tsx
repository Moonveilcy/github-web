import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { AppPage } from './pages/AppPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/app" element={<AppPage />} />
    </Routes>
  );
}

export default App;
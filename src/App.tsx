import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LogWorkoutPage from './pages/LogWorkoutPage';
import HistoryPage from './pages/HistoryPage';
import './index.css'; // Ensure Tailwind styles are loaded

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="log" element={<LogWorkoutPage />} />
          <Route path="history" element={<HistoryPage />} />
          {/* Add more routes here as needed */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

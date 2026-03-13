import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NewAnalysis from './pages/NewAnalysis';
import History from './pages/History';
import Products from './pages/Products';

export default function App() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
        
        <Route path="/" element={user ? <Layout user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}>
          <Route index element={<Dashboard user={user} />} />
          <Route path="new-analysis" element={<NewAnalysis user={user} />} />
          <Route path="history" element={<History user={user} />} />
          <Route path="products" element={<Products user={user} />} />
        </Route>
      </Routes>
    </Router>
  );
}

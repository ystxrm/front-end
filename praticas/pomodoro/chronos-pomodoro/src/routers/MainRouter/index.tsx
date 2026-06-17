import { BrowserRouter, Route, Routes, useLocation } from 'react-router';
import { AboutPomodoro } from '../../pages/AboutPomodoro';
import { NotFound } from '../../pages/NotFound';
import { Home } from '../../pages/Home';
import { History } from '../../pages/History';
import { Settings } from '../../pages/Settings';
import { LoginPage } from '../../pages/Login/LoginPage';
import { ProtectedRoute } from '../../components/ProtectedRoute/ProtectedRoute';
import { useEffect } from 'react';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
}

export function MainRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/home' element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path='/history/' element={<ProtectedRoute><History /></ProtectedRoute>} />
        <Route path='/settings/' element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path='/about-pomodoro/' element={<ProtectedRoute><AboutPomodoro /></ProtectedRoute>} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
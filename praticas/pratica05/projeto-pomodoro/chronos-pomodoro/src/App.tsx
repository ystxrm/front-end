import { TaskContextProvider } from './contexts/TaskContext/TaskContextProvider';
import { MessagesContainer } from './components/MessagesContainer';
import { MainRouter } from './routers/MainRouter';
import './styles/theme.css';
import './styles/global.css';
import { BrowserRouter, Routes, Route } from 'react-router';
import { AuthContextProvider } from './contexts/AuthContext';
import { LoginPage } from './pages/Login/LoginPage';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';

export function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <TaskContextProvider>
          <MessagesContainer>
            <Routes>
              <Route path="/" element={<LoginPage />} />

              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <MainRouter />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </MessagesContainer>
        </TaskContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
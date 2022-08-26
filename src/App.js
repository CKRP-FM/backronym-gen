import './App.scss';
import { UserAuthContextProvider } from './context/UserAuthContext';
import { Routes, Route } from 'react-router-dom';
// pages
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import ErrorPage from './pages/ErrorPage';
import ProtectedRoute from './components/ProtectedRoute';
import NgramViewer from './pages/NgramViewer';
import UserProfile from './components/UserProfile';

function App() {
  return (
    <UserAuthContextProvider>
      <div className="App">
        <Routes>
          {/* Default route is login/landing page */}
          <Route path="/login" element={<LoginPage />}></Route>

          {/* Only accessed if user is logged in thanks to ProtectedRoute component */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainPage />
              </ProtectedRoute>
            }
          ></Route>

          <Route path="/profile/:uid" element={<UserProfile/>}/>

          <Route
            path="/ngramviewer"
            element={
              <ProtectedRoute>
                <NgramViewer />
              </ProtectedRoute>
            }
          ></Route>

          {/* Any other route redirects to error */}
          <Route path="*" element={<ErrorPage />}></Route>
        </Routes>
      </div>
    </UserAuthContextProvider>
  );
}

export default App;

import { Navigate } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';

// takes in as input children pages we want to protect from non logged in users (ie. MainPage.js)
function ProtectedRoute({ children }) {
  let { user } = useUserAuth();
  if (!user) {
    return <Navigate to="/login" />;
  } else {
    return children;
  }
}

export default ProtectedRoute;

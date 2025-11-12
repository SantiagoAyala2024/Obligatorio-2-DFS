import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router';

const ProtectedRoute = () => {
  
    const isAuth = useSelector(state => Boolean(state.auth.token));

    if (!isAuth) return <Navigate to="/" replace />;

    return <Outlet />;
}

export default ProtectedRoute
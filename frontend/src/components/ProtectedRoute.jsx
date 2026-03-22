import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, role } = useAuth();
    console.log("ProtectedRoute check:", { isAuthenticated, role });

    if (!isAuthenticated || role !== 'admin') {
        console.warn("ProtectedRoute: Access denied. Redirecting to /login.");
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;

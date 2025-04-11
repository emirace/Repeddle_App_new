import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import useUser from "../hooks/useUser";
import useAuth from "../hooks/useAuth";
import Login from "../screens/Auth/Login";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();

  return user ? (
    <>{children}</>
  ) : (
    <Login navigation={undefined} route={undefined} />
  );
};

export default ProtectedRoute;

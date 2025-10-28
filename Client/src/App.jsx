import React, { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AuthPage from './Pages/auth/AuthPage';
import ChatPage from './Pages/chat/ChatPage';
import Profile from './Pages/profile/Profile';
import { useAppStore } from './store';
import { apiClient } from './lib/api-client';
import { GET_USER_INFO } from './utils/constants';

const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" />;
}

const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  if (isAuthenticated) {
    console.log(userInfo);

    if (userInfo.profileSetup) {
      console.log("<Navigate to=/chat");

      return <Navigate to="/chat" />
    }
    else {
      console.log("<Navigate to=/profile");
      return <Navigate to="/profile" />

    }
  }
  else {
    return children
  }
}

function App() {

  const { userInfo, setUserInfo } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);

  const getUserData = async () => {
    try {
      const responce = await apiClient.get(GET_USER_INFO, { withCredentials: true });
      if (responce.status === 200 && responce.data.id) {
        setUserInfo(responce.data);
      } else {
        setUserInfo(undefined);
      }
    } catch (error) {
      setUserInfo(undefined)
      console.log("Error in App", error);
    }
    finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {

    if (!userInfo) {
      getUserData();
    }
    else {
      setIsLoading(false);
    }

  }, [userInfo, setUserInfo]);

  if (isLoading) {
    return <div>... Loading ...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/auth' element={
          <AuthRoute>
            <AuthPage />
          </AuthRoute>
        } />
        <Route path='/chat' element={<PrivateRoute><ChatPage /></PrivateRoute>} />
        <Route path='/profile' element={<PrivateRoute><Profile /></PrivateRoute>} />

        <Route path='*' element={<Navigate to={'/auth'} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
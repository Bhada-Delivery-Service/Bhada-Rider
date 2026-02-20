import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, ridersAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [rider, setRider] = useState(null);
  const [onboardingStatus, setOnboardingStatus] = useState(null); // null = loading
  const [loading, setLoading] = useState(true);

  // Fetch fresh rider data and onboarding status from server
  const fetchRiderStatus = async (uid) => {
  try {
    const { data } = await ridersAPI.getById(uid);
    const rd = data?.data || data;
    if (rd) {
      localStorage.setItem('rider', JSON.stringify(rd));
      setRider(rd);
      setOnboardingStatus(rd.onboardingStatus || 'NOT_SUBMITTED');
    }
  } catch (err) {
    // 404 = new rider, profile not created yet → treat as fresh start
    if (err.response?.status === 404) {
      setRider(null);
      setOnboardingStatus('NOT_SUBMITTED');
    } else {
      // Other errors → fall back to cached value
      const storedRider = localStorage.getItem('rider');
      if (storedRider) {
        const rd = JSON.parse(storedRider);
        setRider(rd);
        setOnboardingStatus(rd.onboardingStatus || 'NOT_SUBMITTED');
      } else {
        setOnboardingStatus('NOT_SUBMITTED');
      }
    }
  }
};

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');
    const storedRider = localStorage.getItem('rider');

    if (token && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      // Set cached rider immediately so UI doesn't flash
      if (storedRider) {
        const rd = JSON.parse(storedRider);
        setRider(rd);
        setOnboardingStatus(rd.onboardingStatus || 'NOT_SUBMITTED');
      }
      // Verify session then refresh rider status from server
      authAPI.checkSession()
        .then(({ data }) => {
          if (!data.valid) {
            logout();
          } else {
            return fetchRiderStatus(parsedUser.uid);
          }
        })
        .catch(logout)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (accessToken, refreshToken, userData) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    // Always fetch fresh onboarding status right after login
    await fetchRiderStatus(userData.uid);
  };

  const updateRider = (riderData) => {
    localStorage.setItem('rider', JSON.stringify(riderData));
    setRider(riderData);
    setOnboardingStatus(riderData.onboardingStatus || 'NOT_SUBMITTED');
  };

  const refreshOnboardingStatus = async () => {
    if (user?.uid) await fetchRiderStatus(user.uid);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setRider(null);
    setOnboardingStatus(null);
  };

  const isApproved = onboardingStatus === 'APPROVED';

  return (
    <AuthContext.Provider value={{
      user, rider, login, logout, loading,
      updateRider, onboardingStatus, isApproved,
      refreshOnboardingStatus,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

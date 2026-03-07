import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI, ridersAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [rider, setRider] = useState(null);
  const [onboardingStatus, setOnboardingStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  // accessToken as React state — critical so NotificationProvider gets a stable
  // reference that only changes on actual login/logout, not on every render.
  // Reading directly from localStorage in App.jsx caused a new string reference
  // on every render → NotificationContext useEffect([accessToken]) re-ran →
  // disconnectSocket() called in a loop → socket connect/disconnect spam.
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('accessToken'));

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
      if (err.response?.status === 404) {
        setRider(null);
        setOnboardingStatus('NOT_SUBMITTED');
      } else {
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
      if (storedRider) {
        const rd = JSON.parse(storedRider);
        setRider(rd);
        setOnboardingStatus(rd.onboardingStatus || 'NOT_SUBMITTED');
      }
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

  const login = async (newAccessToken, refreshToken, userData) => {
    localStorage.setItem('accessToken', newAccessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setAccessToken(newAccessToken);  // ← update React state
    setUser(userData);
    await fetchRiderStatus(userData.uid);
  };

  // useCallback gives updateRider a stable reference so hooks that list it
  // as a dependency (e.g. useRiderStatus.fetchData) don't re-run on every render.
  const updateRider = useCallback((riderData) => {
    localStorage.setItem('rider', JSON.stringify(riderData));
    setRider(riderData);
    setOnboardingStatus(riderData.onboardingStatus || 'NOT_SUBMITTED');
  }, []); // setRider / setOnboardingStatus are stable setState dispatchers

  const refreshOnboardingStatus = async () => {
    if (user?.uid) await fetchRiderStatus(user.uid);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setRider(null);
    setOnboardingStatus(null);
    setAccessToken(null);  // ← clear React state
  };

  const isApproved = onboardingStatus === 'APPROVED';

  return (
    <AuthContext.Provider value={{
      user, rider, login, logout, loading,
      updateRider, onboardingStatus, isApproved,
      refreshOnboardingStatus,
      accessToken,  // ← expose stable token
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
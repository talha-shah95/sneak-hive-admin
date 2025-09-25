/**
 * Storage utility for handling persistent and session storage
 */

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  USER: 'user',
  ROLE: 'role',
};

export const getStorage = (rememberMe = false) => {
  return rememberMe ? localStorage : sessionStorage;
};

export const saveAuthData = (data, rememberMe = false) => {
  const storage = getStorage(rememberMe);
  storage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.token);
  storage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
  storage.setItem(STORAGE_KEYS.ROLE, data.user.type);
};

export const clearAuthData = () => {
  [localStorage, sessionStorage].forEach(storage => {
    Object.values(STORAGE_KEYS).forEach(key => {
      storage.removeItem(key);
    });
  });
};

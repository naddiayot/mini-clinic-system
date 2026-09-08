import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

// Provider ini akan "membungkus" seluruh aplikasi (dipasang di main.jsx / App.jsx)
// supaya semua halaman bisa tahu: siapa yang login, dan role-nya apa.
export function AuthProvider({ children }) {
  // Saat aplikasi pertama kali dibuka, cek dulu apakah sebelumnya sudah pernah
  // login (token & data user masih tersimpan di localStorage dari sesi sebelumnya).
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Dipanggil setelah login berhasil (dari halaman Login)
  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  // Dipanggil saat user klik tombol Logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook, supaya di halaman lain tinggal panggil: const { user } = useAuth();
export function useAuth() {
  return useContext(AuthContext);
}

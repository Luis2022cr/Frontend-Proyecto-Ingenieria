// api/AuthContext.tsx
import { createContext, useState, ReactNode } from 'react';

export interface AuthContextType {
  accessToken: string | null;
  userId: number | null;
  userRole: number | null;
  numeroUsuario: number | null;
  login: (token: string, id: number, role: number, numeroUsuario: number) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('accessToken'));
  const [userId, setUserId] = useState<number | null>(Number(localStorage.getItem('userId')));
  const [userRole, setUserRole] = useState<number | null>(Number(localStorage.getItem('userRole')));
  const [numeroUsuario, setNumeroUsuario] = useState<number | null>(Number(localStorage.getItem('numeroUsuario')));

  const login = (token: string, id: number, role: number, numeroUsuario: number) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('userId', id.toString());
    localStorage.setItem('userRole', role.toString());
    localStorage.setItem('numeroUsuario', numeroUsuario.toString());
    setAccessToken(token);
    setUserId(id);
    setUserRole(role);
    setNumeroUsuario(numeroUsuario);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('numeroUsuario');
    setAccessToken(null);
    setUserId(null);
    setUserRole(null);
    setNumeroUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ accessToken, userId, userRole, numeroUsuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

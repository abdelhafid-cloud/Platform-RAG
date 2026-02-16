import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type UserType = 'admin' | 'user';

interface AuthUser {
  id: string;
  email: string;
  prenom: string;
  nom: string;
  role: string;
  filialeId: string;
  assistantIds?: string[];
  type: UserType;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  userType: UserType | null;
  currentUser: AuthUser | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [utilisateurs, setUtilisateurs] = useState<any[]>([]);

  // Charger la liste des utilisateurs depuis le JSON (mock)
  useEffect(() => {
    fetch('/data/utilisateurs/data.json')
      .then((res) => res.json())
      .then((data) => {
        setUtilisateurs(data.utilisateurs || []);
      })
      .catch((error) => {
        console.error('Error loading utilisateurs:', error);
      });
  }, []);

  // Restaurer la session depuis localStorage
  useEffect(() => {
    const storedAuth = localStorage.getItem('authUser');
    if (storedAuth) {
      try {
        const parsed: AuthUser = JSON.parse(storedAuth);
        setIsAuthenticated(true);
        setUserType(parsed.type);
        setCurrentUser(parsed);
      } catch {
        localStorage.removeItem('authUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (username: string, password: string): boolean => {
    // Mode super administrateur
    if (username === 'admin' && password === 'admin') {
      const adminUser: AuthUser = {
        id: 'super-admin',
        email: 'admin@digitgrow.com',
        prenom: 'Super',
        nom: 'Admin',
        role: 'SuperAdmin',
        filialeId: '',
        assistantIds: undefined,
        type: 'admin',
      };

      setIsAuthenticated(true);
      setUserType('admin');
      setCurrentUser(adminUser);
      localStorage.setItem('authUser', JSON.stringify(adminUser));
      return true;
    }

    // Mode utilisateur simple (email + code fixe 000000)
    const email = username.toLowerCase();
    const CODE_UTILISATEUR = '000000';

    const foundUser = utilisateurs.find(
      (u) => u.email?.toLowerCase() === email && u.status === 'active'
    );

    if (foundUser && password === CODE_UTILISATEUR) {
      const authUser: AuthUser = {
        id: foundUser.id,
        email: foundUser.email,
        prenom: foundUser.prenom,
        nom: foundUser.nom,
        role: foundUser.role,
        filialeId: foundUser.filialeId,
        assistantIds: foundUser.assistantIds || [],
        type: 'user',
      };

      setIsAuthenticated(true);
      setUserType('user');
      setCurrentUser(authUser);
      localStorage.setItem('authUser', JSON.stringify(authUser));
      return true;
    }

    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserType(null);
    setCurrentUser(null);
    localStorage.removeItem('authUser');
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, userType, currentUser, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

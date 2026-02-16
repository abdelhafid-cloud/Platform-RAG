import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Filiale {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  adresse: string;
  telephone: string;
  email: string;
  logo: string;
  status: string;
  employees: number;
}

interface FilialeContextType {
  selectedFiliale: Filiale | null;
  setSelectedFiliale: (filiale: Filiale | null) => void;
  filiales: Filiale[];
  loading: boolean;
}

const FilialeContext = createContext<FilialeContextType | undefined>(undefined);

export function FilialeProvider({ children }: { children: ReactNode }) {
  const [selectedFiliale, setSelectedFiliale] = useState<Filiale | null>(null);
  const [filiales, setFiliales] = useState<Filiale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load filiales data
    fetch('/data/filialle/data.json')
      .then((response) => response.json())
      .then((data) => {
        setFiliales(data.filialles);
        setLoading(false);
        
        // Si un utilisateur est connecté (pas admin), sélectionner automatiquement sa filiale
        const storedAuth = localStorage.getItem('authUser');
        if (storedAuth) {
          try {
            const authUser = JSON.parse(storedAuth);
            if (authUser.type === 'user' && authUser.filialeId) {
              const userFiliale = data.filialles.find((f: Filiale) => f.id === authUser.filialeId);
              if (userFiliale) {
                setSelectedFiliale(userFiliale);
                localStorage.setItem('selectedFilialeId', userFiliale.id);
                return; // Ne pas continuer avec la logique de sauvegarde normale
              }
            }
          } catch {
            // Ignorer les erreurs de parsing
          }
        }
        
        // Check if there's a saved selected filiale in localStorage (pour les admins)
        const savedFilialeId = localStorage.getItem('selectedFilialeId');
        if (savedFilialeId) {
          const savedFiliale = data.filialles.find((f: Filiale) => f.id === savedFilialeId);
          if (savedFiliale) {
            setSelectedFiliale(savedFiliale);
          }
        }
      })
      .catch((error) => {
        console.error('Error loading filiales:', error);
        setLoading(false);
      });
  }, []);

  const handleSetSelectedFiliale = (filiale: Filiale | null) => {
    setSelectedFiliale(filiale);
    if (filiale) {
      localStorage.setItem('selectedFilialeId', filiale.id);
    } else {
      localStorage.removeItem('selectedFilialeId');
    }
  };

  return (
    <FilialeContext.Provider
      value={{
        selectedFiliale,
        setSelectedFiliale: handleSetSelectedFiliale,
        filiales,
        loading,
      }}
    >
      {children}
    </FilialeContext.Provider>
  );
}

export function useFiliale() {
  const context = useContext(FilialeContext);
  if (context === undefined) {
    throw new Error('useFiliale must be used within a FilialeProvider');
  }
  return context;
}


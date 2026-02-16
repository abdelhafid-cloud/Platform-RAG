import { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Settings, LogOut, User, ChevronDown, Bot, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useFiliale } from '@/contexts/FilialeContext';
import { useNavigate } from 'react-router-dom';

interface Assistant {
  id: string;
  filialeId: string;
  name: string;
  description: string;
  type: string;
  status: string;
  model: string;
  language: string;
  createdAt: string;
  lastUsed: string | null;
  totalConversations: number;
  successRate: string;
}

interface ChatNavbarProps {
  selectedAssistant: Assistant | null;
  onSelectAssistant: (assistant: Assistant) => void;
  availableAssistants: Assistant[];
}

export default function ChatNavbar({ selectedAssistant, onSelectAssistant, availableAssistants }: ChatNavbarProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAssistantMenu, setShowAssistantMenu] = useState(false);
  const [showFilialeMenu, setShowFilialeMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const assistantMenuRef = useRef<HTMLDivElement>(null);
  const filialeMenuRef = useRef<HTMLDivElement>(null);
  const { logout, userType, currentUser } = useAuth();
  const { selectedFiliale, setSelectedFiliale, filiales } = useFiliale();
  const navigate = useNavigate();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (assistantMenuRef.current && !assistantMenuRef.current.contains(event.target as Node)) {
        setShowAssistantMenu(false);
      }
      if (filialeMenuRef.current && !filialeMenuRef.current.contains(event.target as Node)) {
        setShowFilialeMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-14 border-b bg-white flex items-center justify-between px-6">
      {/* Left side - Logo & Title */}
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900">
          <span className="text-xs font-bold text-white">DG</span>
        </div>
        <div>
          <h1 className="text-sm font-semibold text-gray-900">Assistant DigitGrow</h1>
        </div>
      </div>

      {/* Center - Selectors */}
      <div className="flex items-center gap-3 absolute left-1/2 -translate-x-1/2">
        {/* Filiale Selector - Only for admin */}
        {userType === 'admin' && (
          <div className="relative" ref={filialeMenuRef}>
            <button
              onClick={() => setShowFilialeMenu(!showFilialeMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-blue-600">
                <span className="text-xs font-bold text-white">F</span>
              </div>
              <div className="text-left">
                <p className="text-xs font-medium text-gray-900">
                  {selectedFiliale ? selectedFiliale.name : 'Sélectionner une filiale'}
                </p>
                {selectedFiliale && (
                  <p className="text-[10px] text-gray-500">{selectedFiliale.status === 'active' ? 'Active' : 'Inactive'}</p>
                )}
              </div>
              <ChevronDown className="h-3 w-3 text-gray-500" />
            </button>

            {showFilialeMenu && (
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 max-h-96 overflow-y-auto">
                <div className="px-3 pb-2 border-b">
                  <p className="text-xs font-semibold text-gray-500 uppercase">
                    Filiales disponibles ({filiales.length})
                  </p>
                </div>
                {filiales.map((filiale) => (
                  <button
                    key={filiale.id}
                    onClick={() => {
                      setSelectedFiliale(filiale);
                      setShowFilialeMenu(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors ${
                      selectedFiliale?.id === filiale.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                      selectedFiliale?.id === filiale.id
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                        : 'bg-gray-100'
                    }`}>
                      <span className={`text-xs font-bold ${
                        selectedFiliale?.id === filiale.id ? 'text-white' : 'text-gray-600'
                      }`}>
                        {filiale.name.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {filiale.name}
                        </p>
                        {selectedFiliale?.id === filiale.id && (
                          <Sparkles className="h-3 w-3 text-blue-600 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate">{filiale.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={`text-[10px] px-1.5 py-0 ${
                          filiale.status === 'active'
                            ? 'bg-green-100 text-green-700 hover:bg-green-100'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-100'
                        }`}>
                          {filiale.status === 'active' ? '● Actif' : '● Inactif'}
                        </Badge>
                        <span className="text-[10px] text-gray-500">{filiale.employees} employés</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Assistant Selector - Only show if filiale is selected */}
        {selectedFiliale && availableAssistants.length > 0 && (
          <div className="relative" ref={assistantMenuRef}>
            <button
              onClick={() => setShowAssistantMenu(!showAssistantMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-green-500 to-emerald-600">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="text-left">
                <p className="text-xs font-medium text-gray-900">
                  {selectedAssistant ? selectedAssistant.name : 'Sélectionner un assistant'}
                </p>
                {selectedAssistant && (
                  <p className="text-[10px] text-gray-500">{selectedAssistant.type}</p>
                )}
              </div>
              <ChevronDown className="h-3 w-3 text-gray-500" />
            </button>

            {showAssistantMenu && (
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 max-h-96 overflow-y-auto">
                <div className="px-3 pb-2 border-b">
                  <p className="text-xs font-semibold text-gray-500 uppercase">
                    Assistants disponibles ({availableAssistants.length})
                  </p>
                </div>
                {availableAssistants.map((assistant) => (
                  <button
                    key={assistant.id}
                    onClick={() => {
                      onSelectAssistant(assistant);
                      setShowAssistantMenu(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors ${
                      selectedAssistant?.id === assistant.id ? 'bg-green-50' : ''
                    }`}
                  >
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                      selectedAssistant?.id === assistant.id
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                        : 'bg-gray-100'
                    }`}>
                      <Bot className={`h-5 w-5 ${
                        selectedAssistant?.id === assistant.id ? 'text-white' : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {assistant.name}
                        </p>
                        {selectedAssistant?.id === assistant.id && (
                          <Sparkles className="h-3 w-3 text-green-600 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate">{assistant.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className="text-[10px] px-1.5 py-0 bg-gray-100 text-gray-700 hover:bg-gray-100">
                          {assistant.type}
                        </Badge>
                        <Badge className="text-[10px] px-1.5 py-0 bg-blue-100 text-blue-700 hover:bg-blue-100">
                          {assistant.model}
                        </Badge>
                        {assistant.status === 'active' && (
                          <span className="text-[10px] text-green-600">● Actif</span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right side - User info */}
      <div className="flex items-center gap-2">
        {/* Show filiale badge for users (read-only) */}
        {userType === 'user' && selectedFiliale && (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 px-3 py-1">
            {selectedFiliale.name}
          </Badge>
        )}

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-9 w-9 hover:bg-gray-100"
        >
          {theme === 'light' ? (
            <Sun className="h-[18px] w-[18px]" strokeWidth={2} />
          ) : (
            <Moon className="h-[18px] w-[18px]" strokeWidth={2} />
          )}
        </Button>

        {/* User Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900">
              <span className="text-xs font-bold text-white">
                {currentUser ? `${currentUser.prenom[0]}${currentUser.nom[0]}`.toUpperCase() : 'AD'}
              </span>
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">
                {currentUser ? `${currentUser.prenom} ${currentUser.nom}` : 'Admin User'}
              </p>
              <p className="text-xs text-gray-500">{currentUser?.email || 'admin@digitgrow.com'}</p>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </button>

          {showUserMenu && (
            <div className="absolute top-full mt-2 right-0 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-2 border-b">
                <p className="text-sm font-semibold text-gray-900">
                  {currentUser ? `${currentUser.prenom} ${currentUser.nom}` : 'Admin User'}
                </p>
                <p className="text-xs text-gray-500">{currentUser?.email || 'admin@digitgrow.com'}</p>
                {currentUser && (
                  <Badge className="mt-1 text-[10px] px-1.5 py-0 bg-blue-100 text-blue-700">
                    {currentUser.role}
                  </Badge>
                )}
              </div>
              <button
                onClick={() => {
                  navigate('/parametres');
                  setShowUserMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-sm text-gray-700"
              >
                <User className="h-4 w-4" />
                Mon profil
              </button>
              <button
                onClick={() => {
                  navigate('/parametres');
                  setShowUserMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-sm text-gray-700"
              >
                <Settings className="h-4 w-4" />
                Paramètres
              </button>
              <div className="border-t my-1" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 text-sm text-red-600"
              >
                <LogOut className="h-4 w-4" />
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}


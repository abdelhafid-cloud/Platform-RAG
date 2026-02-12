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
  const menuRef = useRef<HTMLDivElement>(null);
  const assistantMenuRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();
  const { selectedFiliale } = useFiliale();
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
      {/* Left side - Title & Assistant Selector */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900">
            <span className="text-xs font-bold text-white">DG</span>
          </div>
          <div>
            <h1 className="text-sm font-semibold text-gray-900">Assistant DigitGrow</h1>
            {selectedFiliale && (
              <p className="text-xs text-gray-500">{selectedFiliale.name}</p>
            )}
          </div>
        </div>

        {/* Assistant Selector */}
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
              <div className="absolute top-full mt-2 left-0 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 max-h-96 overflow-y-auto">
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
        {selectedFiliale && (
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
              <span className="text-xs font-bold text-white">AD</span>
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">admin@digitgrow.com</p>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </button>

          {showUserMenu && (
            <div className="absolute top-full mt-2 right-0 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-2 border-b">
                <p className="text-sm font-semibold text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">admin@digitgrow.com</p>
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


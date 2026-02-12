import { useState, useRef, useEffect } from 'react';
import { Menu, Search, Sun, Moon, Building2, ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFiliale } from '@/contexts/FilialeContext';
import { Badge } from '@/components/ui/badge';

interface NavbarProps {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export default function Navbar({ sidebarCollapsed, onToggleSidebar }: NavbarProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showFilialeDropdown, setShowFilialeDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { selectedFiliale, setSelectedFiliale, filiales } = useFiliale();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowFilialeDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredFiliales = filiales.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectFiliale = (filiale: typeof selectedFiliale) => {
    setSelectedFiliale(filiale);
    setShowFilialeDropdown(false);
    setSearchQuery('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'inactive':
        return 'bg-red-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <header className="fixed top-0 right-0 left-0 z-40 flex h-16 items-center gap-4 border-b bg-white px-6" style={{ left: sidebarCollapsed ? '72px' : '240px' }}>
      {/* Toggle Sidebar */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleSidebar}
        className="shrink-0 hover:bg-gray-100"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Filiale Selector */}
      <div className="relative" ref={dropdownRef}>
        <Button
          variant="outline"
          onClick={() => setShowFilialeDropdown(!showFilialeDropdown)}
          className="gap-2 h-9 px-3"
        >
          {selectedFiliale ? (
            <>
              <div className="flex items-center gap-2">
                {selectedFiliale.logo ? (
                  <img
                    src={selectedFiliale.logo}
                    alt={selectedFiliale.name}
                    className="h-5 w-5 rounded object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                ) : (
                  <Building2 className="h-4 w-4" />
                )}
                <span className="font-medium text-sm">{selectedFiliale.name}</span>
                <div className={`h-2 w-2 rounded-full ${getStatusColor(selectedFiliale.status)}`} />
              </div>
            </>
          ) : (
            <>
              <Building2 className="h-4 w-4" />
              <span className="text-sm">Toutes les filiales</span>
            </>
          )}
          <ChevronDown className="h-3 w-3 ml-1" />
        </Button>

        {showFilialeDropdown && (
          <div className="absolute top-full mt-2 left-0 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 max-h-96 overflow-hidden flex flex-col z-50">
            {/* Search */}
            <div className="px-3 pb-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher une filiale..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
            </div>

            {/* Option to clear selection */}
            {selectedFiliale && (
              <div
                onClick={() => handleSelectFiliale(null)}
                className="px-4 py-2 hover:bg-gray-50 cursor-pointer border-b flex items-center gap-2 text-sm text-gray-700"
              >
                <X className="h-4 w-4" />
                <span>Voir toutes les filiales</span>
              </div>
            )}

            {/* List */}
            <div className="overflow-y-auto flex-1">
              {filteredFiliales.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-gray-500">
                  Aucune filiale trouvée
                </div>
              ) : (
                filteredFiliales.map((filiale) => (
                  <div
                    key={filiale.id}
                    onClick={() => handleSelectFiliale(filiale)}
                    className={`px-4 py-2.5 hover:bg-gray-50 cursor-pointer flex items-center gap-3 ${
                      selectedFiliale?.id === filiale.id ? 'bg-gray-50' : ''
                    }`}
                  >
                    {filiale.logo ? (
                      <img
                        src={filiale.logo}
                        alt={filiale.name}
                        className="h-8 w-8 rounded object-cover border border-gray-200"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="h-8 w-8 rounded bg-gray-100 flex items-center justify-center">
                        <Building2 className="h-4 w-4 text-gray-600" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm text-gray-900 truncate">
                          {filiale.name}
                        </p>
                        <div className={`h-2 w-2 rounded-full shrink-0 ${getStatusColor(filiale.status)}`} />
                      </div>
                      <p className="text-xs text-gray-500 truncate">
                        {filiale.email}
                      </p>
                    </div>
                    {selectedFiliale?.id === filiale.id && (
                      <Badge variant="default" className="text-xs bg-green-600 hover:bg-green-600">
                        Active
                      </Badge>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 ml-auto">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-10 w-10 hover:bg-gray-100"
        >
          {theme === 'light' ? (
            <Sun className="h-[18px] w-[18px]" strokeWidth={2} />
          ) : (
            <Moon className="h-[18px] w-[18px]" strokeWidth={2} />
          )}
        </Button>

        {/* User Avatar */}
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gray-900 cursor-pointer hover:bg-gray-800 transition-colors">
          <span className="text-[11px] font-bold text-white">AD</span>
        </div>
      </div>
    </header>
  );
}

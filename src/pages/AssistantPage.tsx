import { useState, useEffect } from 'react';
import {
  Bot,
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  MessageSquare,
  TrendingUp,
  ExternalLink,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useFiliale } from '@/contexts/FilialeContext';

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

export default function AssistantPage() {
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { selectedFiliale, filiales } = useFiliale();

  useEffect(() => {
    fetch('/data/assistants/data.json')
      .then((response) => response.json())
      .then((data) => {
        setAssistants(data.assistants);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading assistants:', error);
        setLoading(false);
      });
  }, []);

  // Filter by selected filiale
  const filteredByFiliale = selectedFiliale
    ? assistants.filter((a) => a.filialeId === selectedFiliale.id)
    : assistants;

  // Then filter by search query
  const filteredAssistants = filteredByFiliale.filter(
    (assistant) =>
      assistant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assistant.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assistant.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Actif
          </Badge>
        );
      case 'inactive':
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100 gap-1">
            <XCircle className="h-3 w-3" />
            Inactif
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 gap-1">
            <Clock className="h-3 w-3" />
            En attente
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      Support: 'bg-blue-100 text-blue-700',
      Ventes: 'bg-purple-100 text-purple-700',
      Technique: 'bg-orange-100 text-orange-700',
      RH: 'bg-pink-100 text-pink-700',
      Marketing: 'bg-indigo-100 text-indigo-700',
      Finance: 'bg-emerald-100 text-emerald-700',
      Formation: 'bg-cyan-100 text-cyan-700',
      Logistique: 'bg-amber-100 text-amber-700',
      Qualité: 'bg-teal-100 text-teal-700',
      Innovation: 'bg-violet-100 text-violet-700',
    };

    return (
      <Badge className={`${colors[type] || 'bg-gray-100 text-gray-700'} hover:${colors[type] || 'bg-gray-100'}`}>
        {type}
      </Badge>
    );
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Jamais utilisé';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFilialeNameById = (filialeId: string) => {
    const filiale = filiales.find((f) => f.id === filialeId);
    return filiale ? filiale.name : 'N/A';
  };

  const handleAccessAssistant = () => {
    window.open('/acceder-assistant', '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Assistants</h1>
          <p className="text-gray-500 mt-2 text-sm">
            {selectedFiliale
              ? `Assistants de ${selectedFiliale.name}`
              : 'Gérez tous les assistants de toutes les filiales'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={handleAccessAssistant}>
            <ExternalLink className="h-4 w-4" />
            Accéder à l'assistant
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nouvel Assistant
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Assistants</p>
                <p className="text-2xl font-bold text-gray-900">{filteredByFiliale.length}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-gray-900 flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" strokeWidth={2} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Actifs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredByFiliale.filter((a) => a.status === 'active').length}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-gray-900 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-white" strokeWidth={2} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Conversations</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredByFiliale.reduce((acc, a) => acc + a.totalConversations, 0)}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-gray-900 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-white" strokeWidth={2} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Taux moyen</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredByFiliale.length > 0
                    ? Math.round(
                        filteredByFiliale.reduce((acc, a) => {
                          const rate = parseFloat(a.successRate.replace('%', ''));
                          return acc + (isNaN(rate) ? 0 : rate);
                        }, 0) / filteredByFiliale.filter((a) => a.successRate !== 'N/A').length
                      )
                    : 0}
                  %
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-gray-900 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" strokeWidth={2} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assistants Grid */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Liste des Assistants</CardTitle>
              <CardDescription>
                {filteredAssistants.length} assistant{filteredAssistants.length > 1 ? 's' : ''} trouvé{filteredAssistants.length > 1 ? 's' : ''}
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-[300px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un assistant..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAssistants.map((assistant) => (
              <Card
                key={assistant.id}
                className="hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-gray-300"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center shrink-0">
                        <Bot className="h-6 w-6 text-white" strokeWidth={2} />
                      </div>
                      <div>
                        <CardTitle className="text-base">{assistant.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          {getTypeBadge(assistant.type)}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 -mt-2 -mr-2">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {assistant.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Modèle:</span>
                      <span className="font-medium text-gray-900">{assistant.model}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Conversations:</span>
                      <span className="font-medium text-gray-900">{assistant.totalConversations}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Taux de succès:</span>
                      <span className="font-medium text-green-600">{assistant.successRate}</span>
                    </div>
                    {!selectedFiliale && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Filiale:</span>
                        <span className="font-medium text-gray-900 text-xs truncate max-w-[150px]">
                          {getFilialeNameById(assistant.filialeId)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    {getStatusBadge(assistant.status)}
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" title="Voir">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" title="Modifier">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 mt-3">
                    Dernière utilisation: {formatDate(assistant.lastUsed)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredAssistants.length === 0 && (
            <div className="text-center py-12">
              <Bot className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-sm">Aucun assistant trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

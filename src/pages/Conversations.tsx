import { useState, useEffect } from 'react';
import {
  MessageSquare,
  Search,
  Filter,
  Eye,
  Clock,
  CheckCircle2,
  User,
  Bot,
  Calendar,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFiliale } from '@/contexts/FilialeContext';

interface ConversationItem {
  id: string;
  assistantId: string;
  filialeId: string;
  title: string;
  lastMessage: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  messages: Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>;
}

interface Assistant {
  id: string;
  name: string;
  type: string;
}

interface Filiale {
  id: string;
  name: string;
}

export default function Conversations() {
  const { selectedFiliale } = useFiliale();
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [filiales, setFiliales] = useState<Filiale[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState<ConversationItem | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/data/conversations/data.json').then(res => res.json()),
      fetch('/data/assistants/data.json').then(res => res.json()),
      fetch('/data/filialle/data.json').then(res => res.json()),
    ])
      .then(([convData, assistData, filialeData]) => {
        setConversations(convData.conversations || []);
        setAssistants(assistData.assistants || []);
        setFiliales(filialeData.filialles || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading conversations:', error);
        setLoading(false);
      });
  }, []);

  // Filtrer par filiale si sélectionnée
  const filteredConversations = selectedFiliale
    ? conversations.filter(c => c.filialeId === selectedFiliale.id)
    : conversations;

  // Filtrer par recherche
  const searchedConversations = filteredConversations.filter(
    conv =>
      conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getAssistantName = (assistantId: string) => {
    const assistant = assistants.find(a => a.id === assistantId);
    return assistant ? assistant.name : 'Assistant inconnu';
  };

  const getAssistantType = (assistantId: string) => {
    const assistant = assistants.find(a => a.id === assistantId);
    return assistant ? assistant.type : '';
  };

  const getFilialeNameById = (filialeId: string) => {
    const filiale = filiales.find(f => f.id === filialeId);
    return filiale ? filiale.name : 'N/A';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'resolved':
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Résolue
          </Badge>
        );
      case 'in-progress':
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 gap-1">
            <Clock className="h-3 w-3" />
            En cours
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return date.toLocaleDateString('fr-FR');
  };

  const totalConversations = filteredConversations.length;
  const inProgressConversations = filteredConversations.filter(c => c.status === 'in-progress').length;
  const resolvedConversations = filteredConversations.filter(c => c.status === 'resolved').length;
  const totalMessages = filteredConversations.reduce((sum, c) => sum + c.messages.length, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Chargement des conversations...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Conversations</h1>
        <p className="text-gray-500 mt-2 text-sm">
          {selectedFiliale
            ? `Conversations de ${selectedFiliale.name}`
            : 'Consultez et gérez l\'historique des conversations'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">{totalConversations}</h3>
                <p className="text-xs text-gray-500 mt-1">Conversations</p>
              </div>
              <div className="p-3 rounded-lg bg-gray-900">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">En cours</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">{inProgressConversations}</h3>
                <p className="text-xs text-gray-500 mt-1">Actives</p>
              </div>
              <div className="p-3 rounded-lg bg-gray-900">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Résolues</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">{resolvedConversations}</h3>
                <p className="text-xs text-gray-500 mt-1">Terminées</p>
              </div>
              <div className="p-3 rounded-lg bg-gray-900">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Messages</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">{totalMessages}</h3>
                <p className="text-xs text-gray-500 mt-1">Total échangés</p>
              </div>
              <div className="p-3 rounded-lg bg-gray-900">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conversations List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Liste des Conversations</CardTitle>
              <CardDescription>
                {searchedConversations.length} conversation{searchedConversations.length > 1 ? 's' : ''} trouvée{searchedConversations.length > 1 ? 's' : ''}
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-[300px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher une conversation..."
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
          <div className="space-y-4">
            {searchedConversations.map((conversation) => (
              <div
                key={conversation.id}
                className="border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                onClick={() => setSelectedConversation(conversation)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4 flex-1 min-w-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 shrink-0">
                      <Bot className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {conversation.title}
                        </h3>
                        {getStatusBadge(conversation.status)}
                      </div>
                      <p className="text-xs text-gray-500 truncate mb-2">
                        {conversation.lastMessage}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Bot className="h-3 w-3" />
                          {getAssistantName(conversation.assistantId)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {conversation.messages.length} messages
                        </span>
                        {!selectedFiliale && (
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {getFilialeNameById(conversation.filialeId)}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {getTimeAgo(conversation.updatedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 text-[10px]">
                      {getAssistantType(conversation.assistantId)}
                    </Badge>
                    <Button variant="ghost" size="sm" className="h-7 text-xs">
                      <Eye className="h-3 w-3 mr-1" />
                      Voir
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {searchedConversations.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-sm">Aucune conversation trouvée</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      {selectedConversation && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedConversation(null)}
        >
          <div
            className="bg-white rounded-lg max-w-3xl w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {selectedConversation.title}
                  </h2>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span>{getAssistantName(selectedConversation.assistantId)}</span>
                    <span>•</span>
                    <span>{getFilialeNameById(selectedConversation.filialeId)}</span>
                    <span>•</span>
                    <span>{formatDate(selectedConversation.createdAt)}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {getStatusBadge(selectedConversation.status)}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedConversation(null)}
                  >
                    Fermer
                  </Button>
                </div>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
              <div className="space-y-4">
                {selectedConversation.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full shrink-0 ${
                        msg.role === 'user'
                          ? 'bg-gray-900'
                          : 'bg-gradient-to-br from-green-500 to-emerald-600'
                      }`}
                    >
                      {msg.role === 'user' ? (
                        <User className="h-4 w-4 text-white" />
                      ) : (
                        <Bot className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-gray-900">
                          {msg.role === 'user' ? 'Utilisateur' : getAssistantName(selectedConversation.assistantId)}
                        </span>
                        <span className="text-xs text-gray-400">
                          {formatDate(msg.timestamp)}
                        </span>
                      </div>
                      <div
                        className={`rounded-lg px-4 py-2 ${
                          msg.role === 'user'
                            ? 'bg-gray-100 text-gray-900'
                            : 'bg-white border border-gray-200 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

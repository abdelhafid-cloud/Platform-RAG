import { useState, useRef, useEffect } from 'react';
import { Send, Mic, Paperclip, Smile, StopCircle, Copy, ThumbsUp, ThumbsDown, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFiliale } from '@/contexts/FilialeContext';
import ChatSidebar, { Conversation } from '@/components/chat/ChatSidebar';
import ChatNavbar from '@/components/chat/ChatNavbar';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ConversationData {
  id: string;
  messages: Message[];
}

interface SavedConversation {
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

export default function AccederAssistant() {
  const { selectedFiliale } = useFiliale();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Gérer les assistants
  const [allAssistants, setAllAssistants] = useState<Assistant[]>([]);
  const [selectedAssistant, setSelectedAssistant] = useState<Assistant | null>(null);
  const [availableAssistants, setAvailableAssistants] = useState<Assistant[]>([]);
  
  // Gérer les conversations et leurs messages
  const [conversationsData, setConversationsData] = useState<ConversationData[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [savedConversations, setSavedConversations] = useState<SavedConversation[]>([]);
  
  // Messages actuels basés sur la conversation sélectionnée
  const getWelcomeMessage = () => {
    if (!selectedFiliale) {
      return "Bonjour ! Je suis l'assistant DigitGrow. Veuillez sélectionner une filiale pour commencer.";
    }
    if (selectedAssistant) {
      return `Bonjour ! Je suis **${selectedAssistant.name}**, votre assistant ${selectedAssistant.type.toLowerCase()} pour ${selectedFiliale.name}. Comment puis-je vous aider aujourd'hui ?`;
    }
    return `Bonjour ! Je suis l'assistant de **${selectedFiliale.name}**. Comment puis-je vous aider aujourd'hui ?`;
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: getWelcomeMessage(),
      timestamp: new Date(),
    },
  ]);

  // Mettre à jour le message de bienvenue quand l'assistant change
  useEffect(() => {
    if (messages.length === 1 && messages[0].id === '1') {
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: getWelcomeMessage(),
          timestamp: new Date(),
        },
      ]);
    }
  }, [selectedAssistant, selectedFiliale]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Charger les assistants et conversations depuis le JSON
  useEffect(() => {
    Promise.all([
      fetch('/data/assistants/data.json').then(res => res.json()),
      fetch('/data/conversations/data.json').then(res => res.json()),
    ])
      .then(([assistantsData, conversationsData]) => {
        setAllAssistants(assistantsData.assistants);
        setSavedConversations(conversationsData.conversations);
      })
      .catch((error) => {
        console.error('Error loading data:', error);
      });
  }, []);

  // Filtrer les assistants par filiale et sélectionner le premier par défaut
  useEffect(() => {
    if (selectedFiliale && allAssistants.length > 0) {
      const filtered = allAssistants.filter(
        (assistant) => assistant.filialeId === selectedFiliale.id && assistant.status === 'active'
      );
      setAvailableAssistants(filtered);
      
      // Sélectionner le premier assistant actif par défaut
      if (filtered.length > 0 && !selectedAssistant) {
        setSelectedAssistant(filtered[0]);
      }
      // Si l'assistant actuel n'est plus disponible, prendre le premier
      else if (selectedAssistant && !filtered.find(a => a.id === selectedAssistant.id)) {
        setSelectedAssistant(filtered[0] || null);
      }
    } else {
      setAvailableAssistants([]);
      setSelectedAssistant(null);
    }
  }, [selectedFiliale, allAssistants]);

  // Charger les conversations sauvegardées pour l'assistant sélectionné
  useEffect(() => {
    if (selectedAssistant && savedConversations.length > 0) {
      const assistantConversations = savedConversations.filter(
        conv => conv.assistantId === selectedAssistant.id
      );
      
      // Convertir les conversations sauvegardées au format utilisé par l'interface
      const formattedConversations: Conversation[] = assistantConversations.map(conv => ({
        id: conv.id,
        title: conv.title,
        lastMessage: conv.lastMessage,
        timestamp: getRelativeTime(new Date(conv.updatedAt)),
        unread: conv.status === 'in-progress',
      }));
      
      // Convertir les messages au format utilisé par l'interface
      const formattedConversationsData: ConversationData[] = assistantConversations.map(conv => ({
        id: conv.id,
        messages: conv.messages.map(msg => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          timestamp: new Date(msg.timestamp),
        })),
      }));
      
      setConversations(formattedConversations);
      setConversationsData(formattedConversationsData);
    } else {
      // Réinitialiser si pas d'assistant ou pas de conversations
      setConversations([]);
      setConversationsData([]);
    }
  }, [selectedAssistant, savedConversations]);

  // Fonction pour sélectionner une conversation
  const handleSelectConversation = (conversationId: string | null) => {
    setSelectedConversationId(conversationId);
    
    if (conversationId === null) {
      // Nouvelle conversation
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: getWelcomeMessage(),
          timestamp: new Date(),
        },
      ]);
    } else {
      // Charger la conversation existante
      const conversationData = conversationsData.find(c => c.id === conversationId);
      if (conversationData) {
        setMessages(conversationData.messages);
      }
    }
  };

  // Fonction pour supprimer une conversation
  const handleDeleteConversation = (conversationId: string) => {
    // On ne peut supprimer que les conversations créées dynamiquement (qui commencent par conv-new-)
    if (conversationId.startsWith('conv-new-')) {
      setConversationsData(prev => prev.filter(c => c.id !== conversationId));
      setConversations(prev => prev.filter(c => c.id !== conversationId));
      
      if (selectedConversationId === conversationId) {
        // Si on supprime la conversation active, créer une nouvelle
        handleSelectConversation(null);
      }
    }
  };

  // Fonction pour obtenir un extrait du message
  const truncateText = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Fonction pour formater le timestamp relatif
  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    return date.toLocaleDateString('fr-FR');
  };

  const handleSendMessage = () => {
    if (!message.trim() || !selectedFiliale) return;

    const userMessageContent = message;
    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessageContent,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setMessage('');
    setIsTyping(true);

    // Si c'est une nouvelle conversation (pas d'ID sélectionné)
    if (selectedConversationId === null) {
      const newConversationId = `conv-new-${Date.now()}`;
      const conversationTitle = truncateText(userMessageContent, 40);
      
      // Créer la nouvelle conversation
      const newConversation: Conversation = {
        id: newConversationId,
        title: conversationTitle,
        lastMessage: userMessageContent,
        timestamp: getRelativeTime(new Date()),
      };

      setConversations(prev => [newConversation, ...prev]);
      setSelectedConversationId(newConversationId);

      // Sauvegarder les messages de cette conversation
      const newConversationData: ConversationData = {
        id: newConversationId,
        messages: updatedMessages,
      };
      setConversationsData(prev => [newConversationData, ...prev]);
    } else {
      // Mettre à jour la conversation existante
      setConversationsData(prev => 
        prev.map(conv => 
          conv.id === selectedConversationId 
            ? { ...conv, messages: updatedMessages }
            : conv
        )
      );
      
      setConversations(prev =>
        prev.map(conv =>
          conv.id === selectedConversationId
            ? { ...conv, lastMessage: userMessageContent, timestamp: getRelativeTime(new Date()) }
            : conv
        )
      );
    }

    // Simulate assistant typing
    setTimeout(() => {
      const assistantName = selectedAssistant ? selectedAssistant.name : "l'assistant";
      const assistantResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Je comprends votre demande concernant "${userMessageContent}". En tant que ${assistantName}, je suis en train de traiter l'information et je vous reviendrai avec une réponse détaillée basée sur les données de ${selectedFiliale.name}.`,
        timestamp: new Date(),
      };
      
      const finalMessages = [...updatedMessages, assistantResponse];
      setMessages(finalMessages);
      setIsTyping(false);

      // Mettre à jour les données de conversation avec la réponse de l'assistant
      if (selectedConversationId) {
        setConversationsData(prev => 
          prev.map(conv => 
            conv.id === selectedConversationId 
              ? { ...conv, messages: finalMessages }
              : conv
          )
        );
      }
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Navbar */}
      <ChatNavbar 
        selectedAssistant={selectedAssistant}
        onSelectAssistant={(assistant) => setSelectedAssistant(assistant)}
        availableAssistants={availableAssistants}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <ChatSidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          selectedConversationId={selectedConversationId}
          onSelectConversation={handleSelectConversation}
          conversations={conversations}
          onDeleteConversation={handleDeleteConversation}
        />

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto px-4 py-8">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-8 flex gap-4 ${
                    msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                      msg.role === 'user'
                        ? 'bg-gray-900'
                        : 'bg-gradient-to-br from-green-500 to-emerald-600'
                    }`}
                  >
                    <span className="text-sm font-bold text-white">
                      {msg.role === 'user' ? 'AD' : 'AI'}
                    </span>
                  </div>

                  {/* Message Content */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">
                        {msg.role === 'user' ? 'Vous' : (selectedAssistant ? selectedAssistant.name : 'Assistant')}
                      </span>
                      {msg.role === 'assistant' && selectedAssistant && (
                        <Badge className="text-[10px] px-1.5 py-0 bg-green-100 text-green-700 hover:bg-green-100">
                          {selectedAssistant.type}
                        </Badge>
                      )}
                      <span className="text-xs text-gray-500">{formatTime(msg.timestamp)}</span>
                    </div>

                    <div
                      className={`rounded-lg px-4 py-3 ${
                        msg.role === 'user'
                          ? 'bg-gray-100 text-gray-900'
                          : 'bg-white border border-gray-200 text-gray-900'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    </div>

                    {/* Action Buttons (only for assistant messages) */}
                    {msg.role === 'assistant' && (
                      <div className="flex items-center gap-1 pt-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-gray-500 hover:text-gray-900"
                          onClick={() => handleCopyMessage(msg.content)}
                          title="Copier"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-gray-500 hover:text-green-600"
                          title="Bonne réponse"
                        >
                          <ThumbsUp className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-gray-500 hover:text-red-600"
                          title="Mauvaise réponse"
                        >
                          <ThumbsDown className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-gray-500 hover:text-gray-900"
                          title="Régénérer"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="mb-8 flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600">
                    <span className="text-sm font-bold text-white">AI</span>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">Assistant</span>
                      <span className="text-xs text-gray-500">En train d'écrire...</span>
                    </div>
                    <div className="rounded-lg px-4 py-3 bg-white border border-gray-200">
                      <div className="flex gap-1">
                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t bg-white">
            <div className="max-w-3xl mx-auto px-4 py-4">
              {!selectedFiliale && (
                <div className="mb-3 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                  Veuillez sélectionner une filiale pour activer le chat.
                </div>
              )}
              
              <div className="relative rounded-lg border border-gray-300 bg-white shadow-sm focus-within:border-gray-400 focus-within:shadow-md transition-all">
                <textarea
                  placeholder={
                    selectedFiliale
                      ? 'Posez votre question...'
                      : 'Sélectionnez une filiale pour commencer...'
                  }
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  disabled={!selectedFiliale || isTyping}
                  rows={3}
                  className="w-full resize-none px-4 py-3 pr-32 bg-transparent outline-none text-sm disabled:opacity-50"
                />
                
                {/* Bottom Toolbar */}
                <div className="flex items-center justify-between px-2 pb-2">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-500 hover:text-gray-900"
                      disabled={!selectedFiliale}
                    >
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-500 hover:text-gray-900"
                      disabled={!selectedFiliale}
                    >
                      <Smile className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-500 hover:text-gray-900"
                      disabled={!selectedFiliale}
                    >
                      <Mic className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">
                      {message.length} / 2000
                    </span>
                    {isTyping ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-3"
                        onClick={() => setIsTyping(false)}
                      >
                        <StopCircle className="h-3.5 w-3.5 mr-1.5" />
                        Arrêter
                      </Button>
                    ) : (
                      <Button
                        onClick={handleSendMessage}
                        disabled={!message.trim() || !selectedFiliale}
                        size="sm"
                        className="h-8 px-3 bg-gray-900 hover:bg-gray-800"
                      >
                        <Send className="h-3.5 w-3.5 mr-1.5" />
                        Envoyer
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-400 text-center mt-3">
                L'assistant peut faire des erreurs. Vérifiez les informations importantes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

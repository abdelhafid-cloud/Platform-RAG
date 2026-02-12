import { useState } from 'react';
import { MessageSquare, Plus, Trash2, Search, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  unread?: boolean;
}

interface ChatSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  selectedConversationId: string | null;
  onSelectConversation: (id: string | null) => void;
  conversations: Conversation[];
  onDeleteConversation: (id: string) => void;
}

export default function ChatSidebar({
  collapsed,
  onToggle,
  selectedConversationId,
  onSelectConversation,
  conversations,
  onDeleteConversation,
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter((conv) =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (collapsed) {
    return (
      <div className="w-16 h-full border-r bg-gray-50 flex flex-col items-center py-4 gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="h-10 w-10"
          title="Développer"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onSelectConversation(null)}
          className="h-10 w-10"
          title="Nouvelle conversation"
        >
          <Plus className="h-5 w-5" />
        </Button>
        {conversations.slice(0, 5).map((conv) => (
          <button
            key={conv.id}
            onClick={() => onSelectConversation(conv.id)}
            className={cn(
              'h-10 w-10 rounded-lg flex items-center justify-center transition-all relative',
              selectedConversationId === conv.id
                ? 'bg-gray-900 text-white'
                : 'bg-white hover:bg-gray-100 text-gray-700'
            )}
            title={conv.title}
          >
            <MessageSquare className="h-5 w-5" />
            {conv.unread && (
              <div className="absolute top-1 right-1 h-2 w-2 bg-green-500 rounded-full" />
            )}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="w-72 h-full border-r bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-white">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="h-8 w-8"
            title="Réduire"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        <Button
          onClick={() => onSelectConversation(null)}
          className="w-full gap-2 bg-gray-900 hover:bg-gray-800 text-white"
        >
          <Plus className="h-4 w-4" />
          Nouvelle conversation
        </Button>
      </div>

      {/* Search */}
      <div className="p-3 border-b bg-white">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 bg-gray-50"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-2">
        {filteredConversations.length === 0 ? (
          <div className="text-center py-12 px-4">
            <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500 font-medium mb-1">Aucune conversation</p>
            <p className="text-xs text-gray-400">
              Commencez une nouvelle conversation en envoyant un message
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className={cn(
                  'group relative p-3 rounded-lg cursor-pointer transition-all',
                  selectedConversationId === conv.id
                    ? 'bg-white shadow-sm border border-gray-200'
                    : 'hover:bg-white hover:shadow-sm'
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <MessageSquare
                      className={cn(
                        'h-5 w-5',
                        selectedConversationId === conv.id
                          ? 'text-gray-900'
                          : 'text-gray-500'
                      )}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3
                        className={cn(
                          'text-sm font-medium truncate',
                          selectedConversationId === conv.id
                            ? 'text-gray-900'
                            : 'text-gray-700'
                        )}
                      >
                        {conv.title}
                      </h3>
                      {conv.unread && (
                        <div className="h-2 w-2 bg-green-500 rounded-full shrink-0 ml-2" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate mb-1">
                      {conv.lastMessage}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="h-3 w-3" />
                      {conv.timestamp}
                    </div>
                  </div>
                </div>

                {/* Action buttons on hover (uniquement pour conversations créées dynamiquement) */}
                {conv.id.startsWith('conv-new-') && (
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 bg-white hover:bg-red-50 hover:text-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteConversation(conv.id);
                      }}
                      title="Supprimer"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t bg-white">
        <div className="text-xs text-gray-500 text-center">
          {conversations.length} conversation{conversations.length > 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
}


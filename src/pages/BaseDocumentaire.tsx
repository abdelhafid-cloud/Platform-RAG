import { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Filter,
  FileText,
  Bot,
  Link2,
  Upload,
  Calendar,
  Tag,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useFiliale } from '@/contexts/FilialeContext';

interface Document {
  id: string;
  name: string;
  type: string;
  description: string;
  uploadDate: string;
  size: string;
  format: string;
  category: string;
  filialeId: string;
  assistantIds?: string[];
  content?: string;
}

interface Assistant {
  id: string;
  name: string;
  type: string;
  status: string;
}

export default function BaseDocumentaire() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const { selectedFiliale } = useFiliale();

  useEffect(() => {
    Promise.all([
      fetch('/data/documents/data.json').then(res => res.json()),
      fetch('/data/assistants/data.json').then(res => res.json()),
    ])
      .then(([documentsData, assistantsData]) => {
        setDocuments(documentsData.documents || []);
        setAssistants(assistantsData.assistants || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading data:', error);
        setLoading(false);
      });
  }, []);

  // Filtrer les documents par filiale si une filiale est sélectionnée
  const filteredByFiliale = selectedFiliale
    ? documents.filter((doc) => doc.filialeId === selectedFiliale.id)
    : documents;

  // Filtrer par recherche, catégorie et type
  const filteredDocuments = filteredByFiliale.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || doc.category === filterCategory;
    const matchesType = filterType === 'all' || doc.type === filterType;
    return matchesSearch && matchesCategory && matchesType;
  });

  // Obtenir les assistants liés à un document
  const getLinkedAssistants = (document: Document) => {
    if (!document.assistantIds || document.assistantIds.length === 0) return [];
    return assistants.filter((assistant) => document.assistantIds?.includes(assistant.id));
  };

  // Obtenir toutes les catégories uniques
  const categories = Array.from(new Set(documents.map((doc) => doc.category)));
  const types = Array.from(new Set(documents.map((doc) => doc.type)));

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleLinkAssistants = (document: Document) => {
    setSelectedDocument(document);
    setShowLinkModal(true);
  };

  const handleSaveLinks = (assistantIds: string[]) => {
    if (!selectedDocument) return;

    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === selectedDocument.id ? { ...doc, assistantIds } : doc
      )
    );
    setShowLinkModal(false);
    setSelectedDocument(null);
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
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Base documentaire</h1>
          <p className="text-gray-500 mt-2 text-sm">
            Gérez votre base de connaissances
          </p>
        </div>
        <Button className="gap-2">
          <Upload className="h-4 w-4" />
          Ajouter un document
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Documents</p>
                <p className="text-2xl font-bold text-gray-900">{filteredByFiliale.length}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-gray-900 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" strokeWidth={2} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Cahiers techniques</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredByFiliale.filter((d) => d.type === 'Cahier technique').length}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-gray-900 flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" strokeWidth={2} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Documents liés</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredByFiliale.filter((d) => d.assistantIds && d.assistantIds.length > 0).length}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-gray-900 flex items-center justify-center">
                <Link2 className="h-5 w-5 text-white" strokeWidth={2} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Catégories</p>
                <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-gray-900 flex items-center justify-center">
                <Tag className="h-5 w-5 text-white" strokeWidth={2} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Liste des Documents</CardTitle>
              <CardDescription>
                {filteredDocuments.length} document{filteredDocuments.length > 1 ? 's' : ''} trouvé{filteredDocuments.length > 1 ? 's' : ''}
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-[300px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un document..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                  <option value="all">Toutes les catégories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                  <option value="all">Tous les types</option>
                  {types.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-sm">Aucun document trouvé</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocuments.map((document) => {
                const linkedAssistants = getLinkedAssistants(document);
                return (
                  <Card
                    key={document.id}
                    className="hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-gray-300"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center shrink-0">
                            <FileText className="h-6 w-6 text-white" strokeWidth={2} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-base truncate">{document.name}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className="text-[10px] px-1.5 py-0 bg-blue-100 text-blue-700 hover:bg-blue-100">
                                {document.type}
                              </Badge>
                              <Badge className="text-[10px] px-1.5 py-0 bg-green-100 text-green-700 hover:bg-green-100">
                                {document.category}
                              </Badge>
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
                        {document.description}
                      </p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Date:
                          </span>
                          <span className="font-medium text-gray-900">{formatDate(document.uploadDate)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Taille:</span>
                          <span className="font-medium text-gray-900">{document.size}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Format:</span>
                          <span className="font-medium text-gray-900">{document.format}</span>
                        </div>
                      </div>

                      {/* Assistants liés */}
                      <div className="mb-4 pt-4 border-t">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                            <Bot className="h-3 w-3" />
                            Assistants liés:
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs"
                            onClick={() => handleLinkAssistants(document)}
                          >
                            <Link2 className="h-3 w-3 mr-1" />
                            {linkedAssistants.length > 0 ? 'Modifier' : 'Lier'}
                          </Button>
                        </div>
                        {linkedAssistants.length > 0 ? (
                          <div className="space-y-1">
                            {linkedAssistants.map((assistant) => (
                              <div
                                key={assistant.id}
                                className="flex items-center gap-2 p-1.5 bg-gray-50 rounded text-xs"
                              >
                                <Bot className="h-3 w-3 text-gray-600" />
                                <span className="text-gray-700 font-medium">{assistant.name}</span>
                                <Badge className="text-[9px] px-1 py-0 ml-auto">
                                  {assistant.type}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-400 italic">Aucun assistant lié</p>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
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
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal pour lier les assistants */}
      {showLinkModal && selectedDocument && (
        <LinkAssistantsModal
          document={selectedDocument}
          assistants={assistants}
          onClose={() => {
            setShowLinkModal(false);
            setSelectedDocument(null);
          }}
          onSave={handleSaveLinks}
        />
      )}
    </div>
  );
}

// Composant Modal pour lier les assistants
interface LinkAssistantsModalProps {
  document: Document;
  assistants: Assistant[];
  onClose: () => void;
  onSave: (assistantIds: string[]) => void;
}

function LinkAssistantsModal({ document, assistants, onClose, onSave }: LinkAssistantsModalProps) {
  const [selectedAssistants, setSelectedAssistants] = useState<string[]>(
    document.assistantIds || []
  );

  const toggleAssistant = (assistantId: string) => {
    setSelectedAssistants((prev) =>
      prev.includes(assistantId)
        ? prev.filter((id) => id !== assistantId)
        : [...prev, assistantId]
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>Lier des assistants à "{document.name}"</CardTitle>
          <CardDescription>
            Sélectionnez les assistants qui pourront utiliser ce document
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {assistants.map((assistant) => (
              <div
                key={assistant.id}
                onClick={() => toggleAssistant(assistant.id)}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedAssistants.includes(assistant.id)
                    ? 'bg-green-50 border-green-300'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedAssistants.includes(assistant.id)}
                  onChange={() => toggleAssistant(assistant.id)}
                  className="h-4 w-4 text-gray-900 focus:ring-gray-900"
                />
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center shrink-0">
                  <Bot className="h-5 w-5 text-white" strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{assistant.name}</p>
                  <p className="text-xs text-gray-500">{assistant.type}</p>
                </div>
                <Badge
                  className={
                    assistant.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }
                >
                  {assistant.status}
                </Badge>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button onClick={() => onSave(selectedAssistants)}>
              Enregistrer ({selectedAssistants.length})
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { useState, useEffect } from 'react';
import {
  Users,
  Mail,
  Phone,
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Filter,
  UserCheck,
  UserX,
  Clock,
  User,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useFiliale } from '@/contexts/FilialeContext';

interface Utilisateur {
  id: string;
  filialeId: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: string;
  status: string;
  dateCreation: string;
  derniereConnexion: string | null;
  assistantIds?: string[];
}

export default function Utilisateurs() {
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { selectedFiliale, filiales } = useFiliale();

  useEffect(() => {
    fetch('/data/utilisateurs/data.json')
      .then((response) => response.json())
      .then((data) => {
        setUtilisateurs(data.utilisateurs);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading utilisateurs:', error);
        setLoading(false);
      });
  }, []);

  // Filter by selected filiale
  const filteredByFiliale = selectedFiliale
    ? utilisateurs.filter((u) => u.filialeId === selectedFiliale.id)
    : utilisateurs;

  // Then filter by search query
  const filteredUtilisateurs = filteredByFiliale.filter(
    (utilisateur) =>
      utilisateur.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      utilisateur.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      utilisateur.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      utilisateur.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Actif</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Inactif</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">En attente</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">Admin</Badge>;
      case 'manager':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Manager</Badge>;
      case 'utilisateur':
        return <Badge variant="outline">Utilisateur</Badge>;
      default:
        return <Badge variant="secondary">{role}</Badge>;
    }
  };

  const getInitials = (prenom: string, nom: string) => {
    return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Jamais';
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
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Utilisateurs</h1>
          <p className="text-gray-500 mt-2 text-sm">
            {selectedFiliale
              ? `Utilisateurs de ${selectedFiliale.name}`
              : 'Gérez tous les utilisateurs de toutes les filiales'}
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nouvel Utilisateur
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Utilisateurs</p>
                <p className="text-2xl font-bold text-gray-900">{filteredByFiliale.length}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-gray-900 flex items-center justify-center">
                <Users className="h-5 w-5 text-white" strokeWidth={2} />
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
                  {filteredByFiliale.filter((u) => u.status === 'active').length}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-gray-900 flex items-center justify-center">
                <UserCheck className="h-5 w-5 text-white" strokeWidth={2} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Inactifs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredByFiliale.filter((u) => u.status === 'inactive').length}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-gray-900 flex items-center justify-center">
                <UserX className="h-5 w-5 text-white" strokeWidth={2} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">En attente</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredByFiliale.filter((u) => u.status === 'pending').length}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-gray-900 flex items-center justify-center">
                <Clock className="h-5 w-5 text-white" strokeWidth={2} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Utilisateurs Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Liste des Utilisateurs</CardTitle>
              <CardDescription>
                {filteredUtilisateurs.length} utilisateur{filteredUtilisateurs.length > 1 ? 's' : ''} trouvé{filteredUtilisateurs.length > 1 ? 's' : ''}
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-[300px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un utilisateur..."
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  {!selectedFiliale && (
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Filiale
                    </th>
                  )}
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Rôle
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Dernière connexion
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUtilisateurs.map((utilisateur) => (
                  <tr key={utilisateur.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center shrink-0">
                          <span className="text-white text-xs font-bold">
                            {getInitials(utilisateur.prenom, utilisateur.nom)}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">
                            {utilisateur.prenom} {utilisateur.nom}
                          </p>
                          <p className="text-xs text-gray-500">
                            Créé le {formatDate(utilisateur.dateCreation)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-600">{utilisateur.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-600">{utilisateur.telephone}</span>
                        </div>
                      </div>
                    </td>
                    {!selectedFiliale && (
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-600">
                          {getFilialeNameById(utilisateur.filialeId)}
                        </div>
                      </td>
                    )}
                    <td className="py-4 px-4">{getRoleBadge(utilisateur.role)}</td>
                    <td className="py-4 px-4">{getStatusBadge(utilisateur.status)}</td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-600">
                        {formatDate(utilisateur.derniereConnexion)}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          title="Voir"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          title="Modifier"
                        >
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
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUtilisateurs.length === 0 && (
              <div className="text-center py-12">
                <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-sm">Aucun utilisateur trouvé</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

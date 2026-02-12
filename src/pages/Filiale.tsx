import { useState, useEffect } from 'react';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Filter,
  CheckCircle2,
  Users,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useFiliale } from '@/contexts/FilialeContext';

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

export default function Filiale() {
  const [searchQuery, setSearchQuery] = useState('');
  const { filiales, selectedFiliale, setSelectedFiliale, loading } = useFiliale();

  const filteredFiliales = filiales.filter((filiale) =>
    filiale.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    filiale.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    filiale.adresse.toLowerCase().includes(searchQuery.toLowerCase())
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
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Filiales</h1>
          <p className="text-gray-500 mt-2 text-sm">
            Gérez toutes vos filiales et leurs informations
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle Filiale
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Filiales</p>
                <p className="text-2xl font-bold text-gray-900">{filiales.length}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-gray-900 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-white" strokeWidth={2} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Actives</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filiales.filter((f) => f.status === 'active').length}
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
                <p className="text-sm text-gray-500">Total Employés</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filiales.reduce((acc, f) => acc + f.employees, 0)}
                </p>
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
                <p className="text-sm text-gray-500">En attente</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filiales.filter((f) => f.status === 'pending').length}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-gray-900 flex items-center justify-center">
                <Clock className="h-5 w-5 text-white" strokeWidth={2} />
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
              <CardTitle>Liste des Filiales</CardTitle>
              <CardDescription>
                {filteredFiliales.length} filiale{filteredFiliales.length > 1 ? 's' : ''} trouvée{filteredFiliales.length > 1 ? 's' : ''}
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-[300px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher une filiale..."
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
                    Filiale
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Adresse
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Employés
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredFiliales.map((filiale) => (
                  <tr
                    key={filiale.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-lg overflow-hidden shrink-0 border border-gray-200 bg-gray-50">
                          <img
                            src={filiale.logo}
                            alt={filiale.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700"><span class="text-white text-xs font-bold">${filiale.name.substring(0, 2).toUpperCase()}</span></div>`;
                              }
                            }}
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">
                            {filiale.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate max-w-[200px]">
                            {filiale.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-600">{filiale.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-600">{filiale.telephone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-start gap-2 max-w-[250px]">
                        <MapPin className="h-3 w-3 text-gray-400 mt-0.5 shrink-0" />
                        <span className="text-sm text-gray-600 line-clamp-2">
                          {filiale.adresse}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900">
                          {filiale.employees}
                        </span>
                        <span className="text-xs text-gray-500">employés</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(filiale.status)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        {selectedFiliale?.id === filiale.id ? (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Sélectionnée
                          </Badge>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs"
                            onClick={() => setSelectedFiliale(filiale)}
                            title="Sélectionner cette filiale"
                          >
                            Sélectionner
                          </Button>
                        )}
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
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

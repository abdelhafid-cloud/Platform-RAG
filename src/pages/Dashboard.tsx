import { useState, useEffect } from 'react';
import {
  Users,
  MessageSquare,
  Building2,
  ArrowUpRight,
  ArrowDownRight,
  Bot,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Filiale {
  id: string;
  name: string;
  status: string;
  employees: number;
  logo: string;
}

interface Utilisateur {
  id: string;
  filialeId: string;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  status: string;
  derniereConnexion: string | null;
}

interface Assistant {
  id: string;
  filialeId: string;
  name: string;
  type: string;
  status: string;
  totalConversations: number;
}

interface Conversation {
  id: string;
  assistantId: string;
  filialeId: string;
  status: string;
}

export default function Dashboard() {
  const [filiales, setFiliales] = useState<Filiale[]>([]);
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/data/filialle/data.json').then(res => res.json()),
      fetch('/data/utilisateurs/data.json').then(res => res.json()),
      fetch('/data/assistants/data.json').then(res => res.json()),
      fetch('/data/conversations/data.json').then(res => res.json()),
    ])
      .then(([filialesData, utilisateursData, assistantsData, conversationsData]) => {
        setFiliales(filialesData.filialles || []);
        setUtilisateurs(utilisateursData.utilisateurs || []);
        setAssistants(assistantsData.assistants || []);
        setConversations(conversationsData.conversations || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading data:', error);
        setLoading(false);
      });
  }, []);

  // Le Dashboard affiche toujours TOUTES les filiales (pas de filtrage)
  const totalUtilisateurs = utilisateurs.length;
  const utilisateursActifs = utilisateurs.filter(u => u.status === 'active').length;
  const totalAssistants = assistants.length;
  const assistantsActifs = assistants.filter(a => a.status === 'active').length;
  const totalConversations = conversations.length; // Nombre réel de conversations depuis le JSON
  const conversationsEnCours = conversations.filter(c => c.status === 'in-progress').length;
  const conversationsResolues = conversations.filter(c => c.status === 'resolved').length;
  const totalFiliales = filiales.length;
  const filialesActives = filiales.filter(f => f.status === 'active').length;

  // Calculer les pourcentages
  const tauxUtilisateursActifs = totalUtilisateurs > 0 
    ? ((utilisateursActifs / totalUtilisateurs) * 100).toFixed(1)
    : '0';
  
  const tauxAssistantsActifs = totalAssistants > 0
    ? ((assistantsActifs / totalAssistants) * 100).toFixed(1)
    : '0';

  const tauxConversationsResolues = totalConversations > 0
    ? ((conversationsResolues / totalConversations) * 100).toFixed(1)
    : '0';

  // Top filiales par nombre d'utilisateurs
  const filialesAvecStats = filiales.map(filiale => {
    const nbUtilisateurs = utilisateurs.filter(u => u.filialeId === filiale.id).length;
    const nbAssistants = assistants.filter(a => a.filialeId === filiale.id).length;
    return {
      ...filiale,
      nbUtilisateurs,
      nbAssistants,
    };
  }).sort((a, b) => b.nbUtilisateurs - a.nbUtilisateurs).slice(0, 5);

  // Activités récentes basées sur les dernières connexions
  const recentActivities = utilisateurs
    .filter(u => u.derniereConnexion)
    .sort((a, b) => {
      const dateA = a.derniereConnexion ? new Date(a.derniereConnexion).getTime() : 0;
      const dateB = b.derniereConnexion ? new Date(b.derniereConnexion).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 5)
    .map(u => {
      const filialeUser = filiales.find(f => f.id === u.filialeId);
      const timeAgo = getTimeAgo(u.derniereConnexion);
      return {
        user: `${u.prenom} ${u.nom}`,
        action: `Connexion depuis ${filialeUser?.name || 'N/A'}`,
        time: timeAgo,
        status: u.status,
        role: u.role,
      };
    });

  // Distribution des utilisateurs par rôle (tous les utilisateurs)
  const roleDistribution = {
    Admin: utilisateurs.filter(u => u.role === 'Admin').length,
    Manager: utilisateurs.filter(u => u.role === 'Manager').length,
    Utilisateur: utilisateurs.filter(u => u.role === 'Utilisateur').length,
  };

  function getTimeAgo(dateString: string | null) {
    if (!dateString) return 'Jamais';
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
  }

  const stats = [
    {
      title: 'Total Utilisateurs',
      value: totalUtilisateurs.toString(),
      subtitle: `${utilisateursActifs} actifs (${tauxUtilisateursActifs}%)`,
      change: tauxUtilisateursActifs,
      trend: parseFloat(tauxUtilisateursActifs) > 50 ? 'up' : 'down',
      icon: Users,
      color: 'blue',
    },
    {
      title: 'Total Assistants',
      value: totalAssistants.toString(),
      subtitle: `${assistantsActifs} actifs`,
      change: tauxAssistantsActifs,
      trend: parseFloat(tauxAssistantsActifs) > 50 ? 'up' : 'down',
      icon: Bot,
      color: 'green',
    },
    {
      title: 'Conversations',
      value: totalConversations.toString(),
      subtitle: `${conversationsEnCours} en cours, ${conversationsResolues} résolues`,
      change: tauxConversationsResolues,
      trend: parseFloat(tauxConversationsResolues) > 50 ? 'up' : 'down',
      icon: MessageSquare,
      color: 'purple',
    },
    {
      title: 'Total Filiales',
      value: totalFiliales.toString(),
      subtitle: `${filialesActives} actives`,
      change: `${((filialesActives / totalFiliales) * 100).toFixed(0)}`,
      trend: 'up',
      icon: Building2,
      color: 'orange',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Chargement des statistiques...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-2 text-sm">
          Vue d'ensemble de toutes vos filiales et données
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                    {stat.change && (
                      <span className={`flex items-center text-xs font-medium ${
                        stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {stat.change}%
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-50`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Activités Récentes</CardTitle>
            <CardDescription>Dernières connexions des utilisateurs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center gap-4 pb-4 border-b last:border-0 last:pb-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 shrink-0">
                    <span className="text-sm font-semibold text-gray-700">
                      {activity.user.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{activity.user}</p>
                    <p className="text-xs text-gray-500 truncate">{activity.action}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant={
                      activity.status === 'active' ? 'default' : 
                      activity.status === 'inactive' ? 'destructive' : 
                      'secondary'
                    } className="text-[10px]">
                      {activity.role}
                    </Badge>
                    <span className="text-xs text-gray-400">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Filiales */}
        <Card>
          <CardHeader>
            <CardTitle>Top Filiales</CardTitle>
            <CardDescription>Classement par nombre d'utilisateurs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filialesAvecStats.map((filiale, index) => (
                <div key={filiale.id} className="flex items-center gap-4">
                  <div className="relative shrink-0">
                    {filiale.logo ? (
                      <div className="h-12 w-12 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
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
                    ) : (
                      <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700">
                        <span className="text-white text-xs font-bold">
                          {filiale.name.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gray-900 text-white flex items-center justify-center text-[10px] font-bold border-2 border-white">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{filiale.name}</p>
                    <p className="text-xs text-gray-500">
                      {filiale.nbUtilisateurs} utilisateurs · {filiale.nbAssistants} assistants
                    </p>
                  </div>
                  <Badge variant={filiale.status === 'active' ? 'default' : 'secondary'}>
                    {filiale.status === 'active' ? (
                      <><CheckCircle2 size={12} className="mr-1" /> Actif</>
                    ) : (
                      <><XCircle size={12} className="mr-1" /> Inactif</>
                    )}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Distribution des rôles */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Administrateurs</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">{roleDistribution.Admin}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {totalUtilisateurs > 0 ? ((roleDistribution.Admin / totalUtilisateurs) * 100).toFixed(1) : 0}% du total
                </p>
              </div>
              <div className="p-3 rounded-lg bg-purple-50">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Managers</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">{roleDistribution.Manager}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {totalUtilisateurs > 0 ? ((roleDistribution.Manager / totalUtilisateurs) * 100).toFixed(1) : 0}% du total
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Utilisateurs</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">{roleDistribution.Utilisateur}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {totalUtilisateurs > 0 ? ((roleDistribution.Utilisateur / totalUtilisateurs) * 100).toFixed(1) : 0}% du total
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-50">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Lock, User, AlertCircle } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (login(username, password)) {
      // La redirection finale est gérée par LoginRedirect dans App.tsx
      navigate('/');
    } else {
      setError(
        "Identifiants incorrects. Utilisez admin/admin ou email utilisateur / 000000"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-900">
              <span className="text-lg font-bold text-white">DG</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Bienvenue</CardTitle>
          <CardDescription>
            Connectez-vous en tant qu'administrateur ou utilisateur
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Nom d'utilisateur ou email
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="admin ou jean.dupont@digitgrow.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Mot de passe / code
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="password"
                  placeholder="admin ou 000000"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-11 text-sm font-semibold">
              Se connecter
            </Button>

            <div className="text-center space-y-1 mt-2">
              <p className="text-xs text-gray-500">
                Administrateur : <span className="font-semibold">admin</span> /{' '}
                <span className="font-semibold">admin</span>
              </p>
              <p className="text-xs text-gray-500">
                Utilisateur :{' '}
                <span className="font-semibold">jean.dupont@digitgrow.com</span>{' '}
                / <span className="font-semibold">000000</span>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


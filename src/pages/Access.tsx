import { ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Access() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Access</CardTitle>
          <CardDescription>Gérez les droits d'accès et permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-muted p-6 mb-4">
              <ShieldCheck className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Gestion des accès</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Configurez les permissions et les niveaux d'accès pour vos utilisateurs.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

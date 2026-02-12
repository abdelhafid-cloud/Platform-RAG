import { Globe } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Reseaux() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Réseaux</CardTitle>
          <CardDescription>Gérez vos connexions et réseaux sociaux</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-muted p-6 mb-4">
              <Globe className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Gestion des réseaux</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Cette page vous permettra de gérer vos différents réseaux et connexions.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

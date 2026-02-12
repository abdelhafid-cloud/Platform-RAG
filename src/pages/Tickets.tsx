import { Ticket } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Tickets() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tickets</CardTitle>
          <CardDescription>Gérez les tickets de support</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-muted p-6 mb-4">
              <Ticket className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Gestion des tickets</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Créez, suivez et résolvez les tickets de support de vos clients.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

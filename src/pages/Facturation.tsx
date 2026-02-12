import { Receipt } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Facturation() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Facturation</h1>
        <p className="text-gray-500 mt-2 text-sm">
          Gérez vos factures et paiements
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Gestion de la Facturation</CardTitle>
          <CardDescription>Suivez vos factures et paiements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-muted p-6 mb-4">
              <Receipt className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Facturation</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Consultez l'historique de vos factures, gérez les paiements et téléchargez vos documents.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


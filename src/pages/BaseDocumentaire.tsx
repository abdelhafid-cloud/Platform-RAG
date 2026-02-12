import { BookOpen } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function BaseDocumentaire() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Base documentaire</CardTitle>
          <CardDescription>Gérez votre base de connaissances</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-muted p-6 mb-4">
              <BookOpen className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Base documentaire</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Centralisez et organisez vos documents et ressources pour l'assistant IA.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

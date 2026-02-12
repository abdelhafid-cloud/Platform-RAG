import { BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Reporting() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Reporting</CardTitle>
          <CardDescription>Analysez vos données et performances</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-muted p-6 mb-4">
              <BarChart3 className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Reporting & Analytics</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Visualisez vos KPIs et générez des rapports détaillés sur l'activité.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

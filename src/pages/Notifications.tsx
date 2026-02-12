import { Bell } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Notifications() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Restez informé de toute l'activité</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-muted p-6 mb-4">
              <Bell className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Centre de notifications</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Consultez toutes vos notifications et alertes au même endroit.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

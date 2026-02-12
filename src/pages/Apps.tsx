import { Grid3x3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Apps() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Apps</h1>
        <p className="text-muted-foreground mt-1">Browse and manage your applications</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Applications</CardTitle>
          <CardDescription>Your app directory</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-muted p-6 mb-4">
              <Grid3x3 className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Applications</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Browse and connect your favorite applications.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


import { HelpCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Help() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Help Center</h1>
        <p className="text-muted-foreground mt-1">Get help and support</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Help Center</CardTitle>
          <CardDescription>Find answers and get support</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-muted p-6 mb-4">
              <HelpCircle className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Help & Support</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Browse our help documentation and contact support.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


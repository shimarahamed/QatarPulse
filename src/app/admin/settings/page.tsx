import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function AdminSettingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Configuration options for the admin panel will be available here.
        </p>
      </CardContent>
    </Card>
  );
}

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function AdminBusinessesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Businesses</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          A table of all businesses will be displayed here for management.
        </p>
      </CardContent>
    </Card>
  );
}

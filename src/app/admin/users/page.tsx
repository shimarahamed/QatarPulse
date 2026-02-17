import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function AdminUsersPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Users</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          A list of all registered users will be displayed here.
        </p>
      </CardContent>
    </Card>
  );
}

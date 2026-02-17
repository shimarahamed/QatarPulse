import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function AdminReportsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Reports</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          A list of user-reported issues (e.g., incorrect data, spam) will be displayed here.
        </p>
      </CardContent>
    </Card>
  );
}

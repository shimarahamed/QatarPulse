import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function IngestionJobsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ingestion Jobs</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Viewing and managing ingestion jobs will be available here.
        </p>
      </CardContent>
    </Card>
  );
}

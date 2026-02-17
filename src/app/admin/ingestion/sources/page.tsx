import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function IngestionSourcesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ingestion Sources</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Management of data ingestion sources will be available here.
        </p>
      </CardContent>
    </Card>
  );
}

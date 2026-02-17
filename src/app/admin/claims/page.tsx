import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function AdminClaimsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Claims</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          A list of pending business claims will be displayed here for review.
        </p>
      </CardContent>
    </Card>
  );
}

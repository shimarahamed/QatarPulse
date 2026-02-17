import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function AdminModerationPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Moderation</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          A queue of user-submitted reviews and photos will be displayed here for moderation.
        </p>
      </CardContent>
    </Card>
  );
}

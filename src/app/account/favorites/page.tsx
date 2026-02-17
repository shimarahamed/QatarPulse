import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";

export default function FavoritesPage() {
  return (
    <div>
        <CardHeader>
            <CardTitle>My Favorites</CardTitle>
            <CardDescription>Businesses you've saved will appear here.</CardDescription>
        </CardHeader>
        <Card className="border-dashed">
            <CardContent className="p-10 text-center">
                <Heart className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium text-muted-foreground">No Favorites Yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                    Click the heart icon on a business page to save it here.
                </p>
            </CardContent>
        </Card>
    </div>
  )
}

import { Card, CardContent } from "@/components/ui/card";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-secondary">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <Card>
            <CardContent className="p-6 md:p-10">
                {children}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

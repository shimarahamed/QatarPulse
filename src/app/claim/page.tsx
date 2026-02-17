import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck } from "lucide-react";

export default function ClaimBusinessPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 flex justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
          <CardTitle className="font-headline text-3xl">Claim Your Business</CardTitle>
          <CardDescription>
            Verify ownership of your business listing to manage your page, respond to reviews, and update your information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="business-name">Business Name</Label>
                <Input id="business-name" placeholder="Enter your business name to search" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="your-name">Your Full Name</Label>
                <Input id="your-name" placeholder="e.g. Jane Doe" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="your-email">Your Email</Label>
                <Input id="your-email" type="email" placeholder="you@company.com" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="your-phone">Your Phone Number</Label>
                <Input id="your-phone" type="tel" placeholder="+974..." />
            </div>
          <Button className="w-full" size="lg">Search and Continue</Button>
        </CardContent>
      </Card>
    </div>
  );
}

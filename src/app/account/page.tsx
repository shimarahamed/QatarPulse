import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AccountPage() {
  return (
    <div>
        <CardHeader>
            <CardTitle>Public Profile</CardTitle>
            <CardDescription>This is how others will see you on the site.</CardDescription>
        </CardHeader>
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <Button variant="outline">Change Photo</Button>
            </div>
             <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" defaultValue="@username" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="user@example.com" disabled/>
            </div>
            <Button>Update Profile</Button>
        </div>
    </div>
  )
}

import { Button } from "@/components/ui/button";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


export default function SettingsPage() {
  return (
    <div>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Manage your account and site settings.</CardDescription>
      </CardHeader>
      <div className="p-6 space-y-6">
        <div className="space-y-2">
            <Label>Language</Label>
             <Select defaultValue="en">
                <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ar">العربية</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input id="current-password" type="password"/>
        </div>
         <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input id="new-password" type="password"/>
        </div>
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}

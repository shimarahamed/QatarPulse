'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth';
import { useFirebase } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { useLanguage, type Lang } from '@/hooks/use-language';

export default function SettingsPage() {
  const { toast } = useToast();
  const { user } = useFirebase();
  const { lang, setLang } = useLanguage();
  const hasPasswordProvider = user?.providerData.some((p) => p.providerId === 'password') ?? false;

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSavePassword = async () => {
    if (!user || !user.email) return;

    if (newPassword.length < 6) {
      toast({
        variant: 'destructive',
        title: 'Password too short',
        description: 'New password must be at least 6 characters.',
      });
      return;
    }

    setIsSaving(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      toast({
        title: 'Password Updated',
        description: 'Your password has been changed successfully.',
      });
      setCurrentPassword('');
      setNewPassword('');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Could Not Update Password',
        description:
          error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password'
            ? 'Your current password is incorrect.'
            : error.message || 'Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Manage your account and site settings.</CardDescription>
      </CardHeader>
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <Label>Language</Label>
          <Select value={lang} onValueChange={(value) => setLang(value as Lang)}>
            <SelectTrigger className="max-w-xs">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="ar">العربية</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            Switches business names, descriptions, and addresses to Arabic where available,
            and sets the page direction to right-to-left.
          </p>
        </div>

        <Separator />

        {hasPasswordProvider ? (
          <div className="space-y-4 max-w-sm">
            <div>
              <h3 className="font-medium">Change Password</h3>
              <p className="text-sm text-muted-foreground">
                Requires your current password to confirm the change.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>
            <Button
              onClick={handleSavePassword}
              disabled={isSaving || !currentPassword || !newPassword}
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            You signed in with Google, so there&apos;s no password to manage here.
          </p>
        )}
      </div>
    </div>
  );
}

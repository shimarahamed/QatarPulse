'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCollection, useFirestore, useMemoFirebase, WithId, updateDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export default function AdminUsersPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState<string | null>(null);


  const usersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'users');
  }, [firestore]);

  const { data: users, isLoading } = useCollection<UserProfile>(usersQuery);

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'user' | 'business-owner') => {
    if (!firestore) return;
    setIsUpdating(userId);
    try {
        const userRef = doc(firestore, 'users', userId);
        updateDocumentNonBlocking(userRef, { role: newRole });
        toast({
            title: 'User Role Updated',
            description: `User has been updated to ${newRole}.`
        });
    } catch (e: any) {
         toast({
            variant: "destructive",
            title: "Update Failed",
            description: e.message || "Could not update user role.",
        });
    } finally {
        setIsUpdating(null);
    }
  }

  const getRoleVariant = (role: UserProfile['role']) => {
    switch (role) {
      case 'admin':
        return 'default';
      case 'business-owner':
        return 'secondary';
      case 'user':
      default:
        return 'outline';
    }
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Users</CardTitle>
        <CardDescription>
          View and manage all registered users on the platform.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="hidden md:table-cell">Joined</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div>
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32 mt-1" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </TableCell>
                   <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-8" />
                  </TableCell>
                </TableRow>
              ))}
            {users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={user.photoURL || undefined} />
                      <AvatarFallback>{user.displayName?.[0] || user.email[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.displayName || 'N/A'}</div>
                      <div className="text-sm text-muted-foreground">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getRoleVariant(user.role)}>{user.role}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                    {user.createdAt ? user.createdAt.toDate().toLocaleDateString() : 'N/A'}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost" disabled={isUpdating === user.id}>
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                       <DropdownMenuSub>
                        <DropdownMenuSubTrigger>Change Role</DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'admin')} disabled={user.role === 'admin'}>Admin</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'business-owner')} disabled={user.role === 'business-owner'}>Business Owner</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'user')} disabled={user.role === 'user'}>User</DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                       </DropdownMenuSub>
                      <DropdownMenuSeparator />
                       <DropdownMenuItem className="text-destructive">
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
             {!isLoading && users?.length === 0 && (
                <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                        No users found.
                    </TableCell>
                </TableRow>
             )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

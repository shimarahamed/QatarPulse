'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
  Menu,
  Search,
  UserCircle,
  Globe,
  LayoutDashboard,
  LogOut,
} from 'lucide-react';
import { Logo } from './logo';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useFirebase } from '@/firebase';
import { signOut } from 'firebase/auth';
import { toast } from '@/hooks/use-toast';

const navLinks = [
  { href: '/search', label: 'Search' },
  { href: '/categories', label: 'Categories' },
  { href: '/submit-business', label: 'Add Business' },
];

export function Header() {
  const { user, isUserLoading, auth } = useFirebase();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Logout Failed',
        description: 'An error occurred during logout. Please try again.',
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo className="h-8 w-auto text-primary" />
            <span className="hidden font-bold sm:inline-block font-headline text-lg">
              QatarPulse
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden mr-2"
              aria-label="Toggle Navigation"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px]">
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation Menu</SheetTitle>
              <SheetDescription>Main navigation links for the website.</SheetDescription>
            </SheetHeader>
            <nav className="flex flex-col gap-4 mt-8">
              <Link href="/" className="mb-4 flex items-center gap-2">
                <Logo className="h-8 w-auto text-primary" />
                <span className="font-bold font-headline text-lg">
                  QatarPulse
                </span>
              </Link>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-lg font-medium transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <div className="flex md:hidden flex-1 justify-center">
           <Link href="/" className="flex items-center space-x-2">
            <Logo className="h-8 w-auto text-primary" />
          </Link>
        </div>


        <div className="flex flex-1 items-center justify-end space-x-2">
          <div className="w-full flex-1 md:w-auto md:flex-none">
             <Link href="/search" className="hidden md:flex">
                <Button
                variant="outline"
                className="w-full md:w-64 lg:w-80 justify-between text-muted-foreground"
                >
                Search...
                <Search className="h-4 w-4" />
                </Button>
            </Link>
          </div>
          
          <Button variant="ghost" size="icon" className="md:hidden" asChild>
            <Link href="/search"><Search className="h-5 w-5" /></Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="h-5 w-5" />
                <span className="sr-only">Change language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>English</DropdownMenuItem>
              <DropdownMenuItem>العربية</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {!isUserLoading && (
            <>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.email || ''} />
                        <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/account">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/account/favorites">Favorites</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button asChild className='hidden sm:inline-flex'>
                  <Link href="/login">Login</Link>
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}

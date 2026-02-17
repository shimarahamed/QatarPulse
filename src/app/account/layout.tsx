'use client';

import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Heart, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const accountNavItems = [
  { href: '/account', label: 'Profile', icon: User },
  { href: '/account/favorites', label: 'Favorites', icon: Heart },
  { href: '/account/settings', label: 'Settings', icon: Settings },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="text-left mb-8">
        <h1 className="font-headline text-4xl font-bold tracking-tight">
          My Account
        </h1>
      </div>
      <div className="grid md:grid-cols-4 gap-8">
        <aside className="md:col-span-1">
          <Card>
            <CardContent className="p-2">
                <nav className="flex flex-col gap-1">
                    {accountNavItems.map(item => (
                         <Link href={item.href} key={item.href}>
                            <Button variant={pathname === item.href ? 'secondary' : 'ghost'} className="w-full justify-start text-base py-6">
                                <item.icon className="mr-2 h-5 w-5" />
                                {item.label}
                            </Button>
                         </Link>
                    ))}
                </nav>
            </CardContent>
          </Card>
        </aside>
        <main className="md:col-span-3">
          <Card>
            <CardContent className="p-2 md:p-6">
                {children}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}

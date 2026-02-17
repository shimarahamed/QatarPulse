'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '../logo';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import {
  LayoutDashboard,
  Building2,
  FileCode,
  ListTodo,
  ShieldCheck,
  AlertTriangle,
  Users,
  Settings,
  DownloadCloud,
} from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/businesses', label: 'Businesses', icon: Building2 },
  { href: '/admin/ingestion', label: 'Ingestion', icon: DownloadCloud,
    subItems: [
        { href: '/admin/ingestion/sources', label: 'Sources'},
        { href: '/admin/ingestion/jobs', label: 'Jobs'},
    ]
   },
  { href: '/admin/moderation', label: 'Moderation', icon: ListTodo },
  { href: '/admin/claims', label: 'Claims', icon: ShieldCheck },
  { href: '/admin/reports', label: 'Reports', icon: AlertTriangle },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-background md:flex">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/admin" className="flex items-center gap-2 font-semibold">
          <Logo className="h-6 w-6 text-primary" />
          <span className="font-headline">QatarPulse Admin</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="grid items-start px-4 text-sm font-medium">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>
                <Button
                  variant={pathname === item.href ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

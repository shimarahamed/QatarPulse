'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '../logo';
import { Button } from '../ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronRight } from 'lucide-react';
import { adminNavItems } from '@/lib/admin-nav';

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
          {adminNavItems.map((item) =>
            item.subItems ? (
              <li key={item.label}>
                <Collapsible
                  defaultOpen={pathname.startsWith(item.href)}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant={
                        pathname.startsWith(item.href) ? 'secondary' : 'ghost'
                      }
                      className="w-full justify-start"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.label}
                      <ChevronRight className="ml-auto h-4 w-4 transition-transform data-[state=open]:rotate-90" />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-4 pt-2">
                    <ul className="grid gap-1">
                      <li>
                        <Link href={item.href}>
                          <Button
                            variant={pathname === item.href ? 'secondary' : 'ghost'}
                            className="w-full justify-start pl-8"
                          >
                           Manual Entry
                          </Button>
                        </Link>
                      </li>
                      {item.subItems.map((subItem) => (
                        <li key={subItem.href}>
                          <Link href={subItem.href}>
                            <Button
                              variant={
                                pathname === subItem.href ? 'secondary' : 'ghost'
                              }
                              className="w-full justify-start pl-8"
                            >
                              {subItem.label}
                            </Button>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </CollapsibleContent>
                </Collapsible>
              </li>
            ) : (
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
            )
          )}
        </ul>
      </nav>
    </aside>
  );
}

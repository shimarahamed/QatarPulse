import {
    LayoutDashboard,
    Building2,
    ListTodo,
    ShieldCheck,
    AlertTriangle,
    Users,
    Settings,
    DownloadCloud,
  } from 'lucide-react';
  
  export const adminNavItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/businesses', label: 'Businesses', icon: Building2 },
    {
      href: '/admin/ingestion',
      label: 'Ingestion',
      icon: DownloadCloud,
      subItems: [
        { href: '/admin/ingestion/sources', label: 'Sources' },
        { href: '/admin/ingestion/jobs', label: 'Jobs' },
      ],
    },
    { href: '/admin/moderation', label: 'Moderation', icon: ListTodo },
    { href: '/admin/claims', label: 'Claims', icon: ShieldCheck },
    { href: '/admin/reports', label: 'Reports', icon: AlertTriangle },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];
  
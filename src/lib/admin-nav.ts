import {
    LayoutDashboard,
    Building2,
    FilePlus2,
    ShieldCheck,
    AlertTriangle,
    Users,
    Settings,
    DownloadCloud,
    ListTodo,
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
    { href: '/admin/submissions', label: 'Submissions', icon: FilePlus2 },
    { href: '/admin/claims', label: 'Claims', icon: ShieldCheck },
    { href: '/admin/reports', label: 'Reports', icon: AlertTriangle },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];
  

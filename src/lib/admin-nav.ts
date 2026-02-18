import {
  Home,
  TrendingUp,
  Building2,
  FileText,
  ShieldCheck,
  Users,
  DatabaseZap,
  Filter,
  AlertTriangle,
  Settings,
} from 'lucide-react';

export const adminNavItems = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: Home,
  },
  {
    href: '/admin/analytics',
    label: 'Analytics',
    icon: TrendingUp,
  },
  {
    href: '/admin/businesses',
    label: 'Businesses',
    icon: Building2,
  },
  {
    href: '/admin/submissions',
    label: 'Submissions',
    icon: FileText,
  },
  {
    href: '/admin/claims',
    label: 'Claims',
    icon: ShieldCheck,
  },
  {
    href: '/admin/users',
    label: 'Users',
    icon: Users,
  },
  {
    href: '/admin/ingestion',
    label: 'Ingestion',
    icon: DatabaseZap,
    subItems: [
      {
        href: '/admin/ingestion/sources',
        label: 'Sources',
      },
      {
        href: '/admin/ingestion/jobs',
        label: 'Jobs',
      },
    ],
  },
  {
    href: '/admin/moderation',
    label: 'Moderation',
    icon: Filter,
  },
  {
    href: '/admin/reports',
    label: 'Reports',
    icon: AlertTriangle,
  },
  {
    href: '/admin/settings',
    label: 'Settings',
    icon: Settings,
  },
];

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Building2,
  FilePlus2,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const stats = [
    {
      title: 'Total Businesses',
      value: '12,450',
      icon: Building2,
      change: '+2.5%',
    },
    {
      title: 'New Submissions',
      value: '82',
      icon: FilePlus2,
      change: '+15%',
    },
    {
      title: 'Pending Claims',
      value: '12',
      icon: ShieldCheck,
      change: '-5%',
    },
    {
      title: 'Open Reports',
      value: '3',
      icon: AlertTriangle,
      change: '+1',
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-6">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Activity feed will be displayed here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

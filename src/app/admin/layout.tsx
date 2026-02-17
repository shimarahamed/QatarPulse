import { AdminSidebar } from '@/components/admin/sidebar';
import { AdminHeader } from '@/components/admin/header';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-secondary/50">
      <AdminSidebar />
      <div className="md:pl-64">
        <AdminHeader />
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}

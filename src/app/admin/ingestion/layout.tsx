'use client';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePathname, useRouter } from "next/navigation"
import Link from 'next/link';

export default function IngestionLayout({
  children,
}: {
  children: React.ReactNode
}) {
    const pathname = usePathname();
    const router = useRouter();
  return (
    <div>
        <Tabs value={pathname} onValueChange={(value) => router.push(value)} className="mb-6">
            <TabsList>
                <TabsTrigger value="/admin/ingestion" asChild>
                    <Link href="/admin/ingestion">Manual Entry</Link>
                </TabsTrigger>
                <TabsTrigger value="/admin/ingestion/sources" asChild>
                    <Link href="/admin/ingestion/sources">Sources</Link>
                </TabsTrigger>
                <TabsTrigger value="/admin/ingestion/jobs" asChild>
                    <Link href="/admin/ingestion/jobs">Jobs</Link>
                </TabsTrigger>
            </TabsList>
        </Tabs>
      {children}
    </div>
  )
}

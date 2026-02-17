import FiltersSidebar from '@/components/search/filters';

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="flex flex-col md:flex-row gap-8 py-6">
        <aside className="w-full md:w-1/4 lg:w-1/5">
          <FiltersSidebar />
        </aside>
        <main className="w-full md:w-3/4 lg:w-4/5">{children}</main>
      </div>
    </div>
  );
}

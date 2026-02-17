import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { categories } from '@/lib/data';

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
          All Categories
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Explore the wide variety of businesses and services available across Qatar.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
        {categories.map((category) => (
          <Link href={`/search?category=${category.id}`} key={category.id}>
            <Card className="group overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 h-full">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center aspect-square">
                <category.icon
                  className="h-10 w-10 text-primary mb-3 transition-transform group-hover:scale-110"
                  strokeWidth={1.5}
                />
                <h3 className="font-headline text-base font-semibold">
                  {category.name_en}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {category.name_ar}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

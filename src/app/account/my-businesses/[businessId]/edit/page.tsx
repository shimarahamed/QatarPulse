'use client';

import { useParams, useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  useFirestore,
  useDoc,
  useCollection,
  useMemoFirebase,
  updateDocumentNonBlocking,
  WithId,
} from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import type { Business, Category, Tag } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

const businessSchema = z.object({
  name_en: z.string().min(1, 'English name is required'),
  name_ar: z.string().min(1, 'Arabic name is required'),
  description_en: z.string().min(10, 'Description must be at least 10 characters'),
  description_ar: z.string().min(10, 'Description must be at least 10 characters'),
  address_en: z.string().min(1, 'English address is required'),
  address_ar: z.string().min(1, 'Arabic address is required'),
  phone: z.string().min(1, 'Phone number is required'),
  website: z.string().url().or(z.literal('')),
  price_range: z.enum(['$', '$$', '$$$', '$$$$']),
  category_id: z.string().min(1, 'Category is required'),
  tag_ids: z.array(z.string()).optional(),
});

type BusinessFormValues = z.infer<typeof businessSchema>;


export default function EditBusinessPage() {
  const params = useParams();
  const router = useRouter();
  const businessId = params.businessId as string;
  const firestore = useFirestore();
  const { toast } = useToast();

  const businessRef = useMemoFirebase(() => {
    if (!firestore || !businessId) return null;
    return doc(firestore, 'businesses', businessId);
  }, [firestore, businessId]);
  const { data: business, isLoading: isLoadingBusiness } = useDoc<Business>(businessRef);

  const categoriesQuery = useMemoFirebase(() => firestore ? collection(firestore, 'categories') : null, [firestore]);
  const { data: categories, isLoading: isLoadingCategories } = useCollection<Category>(categoriesQuery);

  const tagsQuery = useMemoFirebase(() => firestore ? collection(firestore, 'tags') : null, [firestore]);
  const { data: tags, isLoading: isLoadingTags } = useCollection<Tag>(tagsQuery);
  
  const form = useForm<BusinessFormValues>({
    resolver: zodResolver(businessSchema),
    defaultValues: {},
  });

  useEffect(() => {
    if (business) {
      form.reset({
        name_en: business.name_en,
        name_ar: business.name_ar,
        description_en: business.description_en,
        description_ar: business.description_ar,
        address_en: business.address_en,
        address_ar: business.address_ar,
        phone: business.phone,
        website: business.website,
        price_range: business.price_range,
        category_id: business.category_id,
        tag_ids: business.tag_ids || [],
      });
    }
  }, [business, form]);


  async function onSubmit(values: BusinessFormValues) {
    if (!businessRef) return;
    try {
      updateDocumentNonBlocking(businessRef, values);
      toast({
        title: 'Business Updated',
        description: `${values.name_en} has been successfully updated.`,
      });
      router.push('/account/my-businesses');
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Update Failed",
            description: error.message || "Could not update the business.",
        });
    }
  }
  
  const isLoading = isLoadingBusiness || isLoadingCategories || isLoadingTags;

  if (isLoading) {
    return (
        <div className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="name_en"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Business Name (English)</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g. The Coffee House" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
              <FormField
                control={form.control}
                name="name_ar"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Business Name (Arabic)</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g. بيت القهوة" {...field} dir="rtl"/>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
        </div>
          <FormField
            control={form.control}
            name="description_en"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Description (English)</FormLabel>
                <FormControl>
                    <Textarea placeholder="Describe your business..." {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        <FormField
            control={form.control}
            name="description_ar"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Description (Arabic)</FormLabel>
                <FormControl>
                    <Textarea placeholder="صف عملك..." {...field} dir="rtl"/>
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        <div className="grid md:grid-cols-2 gap-8">
            <FormField
                control={form.control}
                name="address_en"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Address (English)</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g. 123 Main St, Doha" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            <FormField
                control={form.control}
                name="address_ar"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Address (Arabic)</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g. ١٢٣ شارع الرئيسي، الدوحة" {...field} dir="rtl"/>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
        </div>
          <div className="grid md:grid-cols-2 gap-8">
            <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                        <Input placeholder="+974..." {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                        <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
        </div>
          <div className="grid md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {categories?.map(cat => (
                                <SelectItem key={cat.id} value={cat.id}>{cat.name_en}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
            <FormField
                control={form.control}
                name="price_range"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Price Range</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a price range" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="$">$</SelectItem>
                            <SelectItem value="$$">$$</SelectItem>
                            <SelectItem value="$$$">$$$</SelectItem>
                            <SelectItem value="$$$$">$$$$</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
        </div>
          <FormField
            control={form.control}
            name="tag_ids"
            render={({ field }) => (
                <FormItem>
                    <div className="mb-4">
                        <FormLabel className="text-base">Tags & Services</FormLabel>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {tags?.map((tag) => (
                        <FormField
                        key={tag.id}
                        control={form.control}
                        name="tag_ids"
                        render={({ field }) => {
                            return (
                            <FormItem
                                key={tag.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                            >
                                <FormControl>
                                <Checkbox
                                    checked={field.value?.includes(tag.id)}
                                    onCheckedChange={(checked) => {
                                    return checked
                                        ? field.onChange([...(field.value || []), tag.id])
                                        : field.onChange(
                                            field.value?.filter(
                                            (value) => value !== tag.id
                                            )
                                        )
                                    }}
                                />
                                </FormControl>
                                <FormLabel className="font-normal">
                                {tag.name_en}
                                </FormLabel>
                            </FormItem>
                            )
                        }}
                        />
                    ))}
                    </div>
                    <FormMessage />
                </FormItem>
                )}
            />
        
        <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
        </Button>
      </form>
    </Form>
  );
}

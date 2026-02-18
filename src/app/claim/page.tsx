'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Search } from "lucide-react";
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from "@/hooks/use-toast";
import { useUser, useFirestore, addDocumentNonBlocking } from "@/firebase";
import { collection, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense, useState } from "react";
import type { Business } from '@/lib/types';
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

const claimSchema = z.object({
    businessName: z.string().min(1, "Business name is required"),
    yourName: z.string().min(1, "Your name is required"),
    yourEmail: z.string().email(),
    yourPhone: z.string().min(1, "Phone number is required"),
});

type ClaimFormValues = z.infer<typeof claimSchema>;

function ClaimForm() {
    const { toast } = useToast();
    const { user } = useUser();
    const firestore = useFirestore();
    const router = useRouter();
    const searchParams = useSearchParams();
    const businessId = searchParams.get('businessId');
    const [isBusinessLoading, setIsBusinessLoading] = useState(true);

    const { register, handleSubmit, setValue, formState: { errors, isSubmitting, isValid } } = useForm<ClaimFormValues>({
        resolver: zodResolver(claimSchema),
        mode: "onChange",
    });

    useEffect(() => {
        if (user) {
            setValue('yourName', user.displayName || '');
            setValue('yourEmail', user.email || '');
        }
        
        if (businessId && firestore) {
            setIsBusinessLoading(true);
            const businessRef = doc(firestore, 'businesses', businessId);
            getDoc(businessRef).then(docSnap => {
                if (docSnap.exists()) {
                    const business = docSnap.data() as Business;
                    setValue('businessName', business.name_en, { shouldValidate: true });
                } else {
                    toast({ title: "Business not found", description: "The business you are trying to claim does not exist.", variant: "destructive" });
                    router.push('/search');
                }
            }).catch(err => {
                 toast({ title: "Error", description: "Could not fetch business details.", variant: "destructive" });
            }).finally(() => {
                setIsBusinessLoading(false);
            });
        } else if (!businessId) {
            setIsBusinessLoading(false);
        }
    }, [user, setValue, businessId, firestore, router, toast]);

    const onSubmit: SubmitHandler<ClaimFormValues> = async (data) => {
        if (!user) {
            toast({ title: "Please sign in", description: "You must be signed in to claim a business.", variant: "destructive" });
            return;
        }

        if (!businessId) {
             toast({ title: "Invalid Claim", description: "Please find your business on our site and use the 'Claim this Business' button on its profile page.", variant: "destructive" });
             return;
        }

        try {
            const claimsCollection = collection(firestore, 'claims');
            await addDocumentNonBlocking(claimsCollection, {
                businessId: businessId,
                businessName: data.businessName,
                claimerId: user.uid,
                claimerName: data.yourName,
                claimerEmail: data.yourEmail,
                claimerPhone: data.yourPhone,
                status: 'pending',
                createdAt: serverTimestamp(),
            });

            toast({
                title: "Claim Submitted",
                description: "Your claim has been submitted for review. We will get back to you shortly.",
            });
            router.push('/account');

        } catch (error) {
            console.error("Failed to submit claim", error);
            toast({ title: "Submission Failed", description: "Could not submit your claim. Please try again.", variant: "destructive" });
        }
    };

  if (!businessId && !isBusinessLoading) {
    return (
        <Card className="w-full max-w-2xl">
            <CardHeader className="text-center">
                 <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
                    <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="font-headline text-3xl">How to Claim a Business</CardTitle>
            </CardHeader>
             <CardContent className="text-center">
                <p className="text-muted-foreground">
                    To claim an existing business, please find it on our website first. Then, click the "Claim this Business" button on its profile page.
                </p>
                <Button className="w-full mt-6" asChild>
                    <Link href="/search">
                        <Search className="mr-2 h-4 w-4" />
                        Search For Your Business
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
          <CardTitle className="font-headline text-3xl">Claim Your Business</CardTitle>
          <CardDescription>
            Verify ownership of your business listing to manage your page, respond to reviews, and update your information.
          </CardDescription>
        </CardHeader>
        <CardContent>
            {isBusinessLoading ? (
                <div className="space-y-6">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="business-name">Business Name</Label>
                    <Input id="business-name" {...register("businessName")} readOnly className="bg-muted"/>
                    {errors.businessName && <p className="text-destructive text-xs">{errors.businessName.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="your-name">Your Full Name</Label>
                    <Input id="your-name" placeholder="e.g. Jane Doe" {...register("yourName")} />
                    {errors.yourName && <p className="text-destructive text-xs">{errors.yourName.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="your-email">Your Email</Label>
                    <Input id="your-email" type="email" placeholder="you@company.com" {...register("yourEmail")} disabled={!!user?.email}/>
                     {errors.yourEmail && <p className="text-destructive text-xs">{errors.yourEmail.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="your-phone">Your Phone Number</Label>
                    <Input id="your-phone" type="tel" placeholder="+974..." {...register("yourPhone")}/>
                     {errors.yourPhone && <p className="text-destructive text-xs">{errors.yourPhone.message}</p>}
                </div>
              <Button className="w-full" size="lg" type="submit" disabled={isSubmitting || !isValid}>
                {isSubmitting ? "Submitting..." : "Submit Claim for Review"}
              </Button>
            </form>
            )}
        </CardContent>
      </Card>
  )
}

export default function ClaimBusinessPage() {
    return (
        <div className="container mx-auto px-4 md:px-6 py-12 flex justify-center">
            <Suspense fallback={<Skeleton className="h-96 w-full max-w-2xl" />}>
                <ClaimForm />
            </Suspense>
        </div>
    )
}

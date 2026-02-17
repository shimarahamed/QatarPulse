import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, Users, Handshake } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="text-center">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
          About QatarPulse
        </h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
          Your ultimate guide to businesses, services, and places in Doha and beyond. Our mission is to connect communities and support local businesses.
        </p>
      </div>

      <div className="mt-16 grid gap-8 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Info className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="font-headline text-xl">Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              To provide the most comprehensive and up-to-date business directory for Qatar, making it easy for residents and visitors to find what they need.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="font-headline text-xl">For the Community</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Discover new places, read honest reviews, and share your experiences. QatarPulse is a platform built for and by the community.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Handshake className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="font-headline text-xl">For Businesses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Claim your listing, connect with customers, and grow your business. We offer tools to help you succeed in the local market.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, Pie, PieChart } from 'recharts';

const chartData = [
  { month: 'January', desktop: 186 },
  { month: 'February', desktop: 305 },
  { month: 'March', desktop: 237 },
  { month: 'April', desktop: 73 },
  { month: 'May', desktop: 209 },
  { month: 'June', desktop: 214 },
];

const chartConfig: ChartConfig = {
  desktop: {
    label: 'Submissions',
    color: 'hsl(var(--chart-1))',
  },
};

const categoryData = [
    { name: 'Restaurants', value: 400, fill: 'hsl(var(--chart-1))' },
    { name: 'Shopping', value: 300, fill: 'hsl(var(--chart-2))' },
    { name: 'Health', value: 200, fill: 'hsl(var(--chart-3))' },
    { name: 'Services', value: 278, fill: 'hsl(var(--chart-4))' },
    { name: 'Other', value: 189, fill: 'hsl(var(--chart-5))' },
];

const categoryConfig: ChartConfig = {
    Restaurants: { label: 'Restaurants', color: 'hsl(var(--chart-1))' },
    Shopping: { label: 'Shopping', color: 'hsl(var(--chart-2))' },
    Health: { label: 'Health', color: 'hsl(var(--chart-3))' },
    Services: { label: 'Services', color: 'hsl(var(--chart-4))' },
    Other: { label: 'Other', color: 'hsl(var(--chart-5))' },
}

const claimsData = [
    { name: 'Approved', value: 150, fill: 'hsl(var(--chart-2))' },
    { name: 'Pending', value: 50, fill: 'hsl(var(--chart-4))' },
    { name: 'Rejected', value: 25, fill: 'hsl(var(--chart-5))' },
];
const claimsConfig: ChartConfig = {
    Approved: { label: 'Approved', color: 'hsl(var(--chart-2))' },
    Pending: { label: 'Pending', color: 'hsl(var(--chart-4))' },
    Rejected: { label: 'Rejected', color: 'hsl(var(--chart-5))' },
}


export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="text-3xl font-bold font-headline mb-6">Platform Analytics</div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Business Submissions</CardTitle>
            <CardDescription>January - June 2024</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle>Categories Distribution</CardTitle>
             <CardDescription>A breakdown of businesses by primary category.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ChartContainer config={categoryConfig} className="mx-auto aspect-square max-h-[250px]">
              <PieChart>
                 <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
                <Pie data={categoryData} dataKey="value" nameKey="name" />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle>Claims by Status</CardTitle>
             <CardDescription>The current status of all ownership claims.</CardDescription>
          </CardHeader>
           <CardContent className="flex items-center justify-center">
            <ChartContainer config={claimsConfig} className="mx-auto aspect-square max-h-[250px]">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
                <Pie data={claimsData} dataKey="value" nameKey="name" />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

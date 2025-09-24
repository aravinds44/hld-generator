'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowRight, Bot } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center text-center">
        <div className="p-3 bg-primary/10 rounded-full border border-primary/20 mb-4">
          <Bot className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl font-headline">
          HLD Autopilot
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-muted-foreground sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Streamline your High-Level Design creation process for vDSR. Let AI do the heavy lifting.
        </p>
      </div>

      <Card className="mt-12 w-full max-w-lg mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Start a New Project</CardTitle>
          <CardDescription>
            Select a Network Function to begin generating your HLD.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="nf-select" className="text-sm font-medium text-foreground">
              Network Function
            </label>
            <Select defaultValue="vdsr" disabled>
              <SelectTrigger id="nf-select">
                <SelectValue placeholder="Select a Network Function" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vdsr">vDSR (Virtual DSR)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Link href="/generate" className="w-full">
            <Button size="lg" className="w-full">
              Start Generation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

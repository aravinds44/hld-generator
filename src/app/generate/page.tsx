'use client';

import { parseRequirementDocument } from '@/ai/flows/parse-requirement-document';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { hldDataSchema } from '@/lib/schema';
import type { HldData } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Bot, Check, ChevronRight, FileUp, Loader2, FileCheck, RefreshCw } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const steps = [
  { id: '01', name: 'Upload Document', status: 'current' },
  { id: '02', name: 'Verify Details', status: 'upcoming' },
  { id: '03', name: 'Review HLD', status: 'upcoming' },
];

type FormData = z.infer<typeof hldDataSchema>;

export default function GeneratePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [finalData, setFinalData] = useState<FormData | null>(null);

  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(hldDataSchema),
    defaultValues: {
      isIdihRequired: false,
      isUdrRequired: false,
      isSpareSoamRequired: false,
      isSbrRequired: false,
    },
  });

  const handleFileUpload = async (file: File) => {
    if (!file) {
      toast({
        title: 'No file selected',
        description: 'Please select a document to upload.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setFileName(file.name);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const dataUri = reader.result as string;
      try {
        const parsedData = await parseRequirementDocument({ documentDataUri: dataUri });
        form.reset(parsedData);
        setCurrentStep(2);
      } catch (error) {
        console.error('Failed to parse document:', error);
        toast({
          title: 'Parsing Failed',
          description: 'Could not parse the document. Please check the file and try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
      setIsLoading(false);
      toast({
        title: 'File Read Error',
        description: 'There was an error reading the file.',
        variant: 'destructive',
      });
    };
  };

  const onDetailsSubmit = (data: FormData) => {
    setFinalData(data);
    setCurrentStep(3);
  };
  
  const handleStartOver = () => {
    setCurrentStep(1);
    setFinalData(null);
    setFileName(null);
    form.reset();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1Upload onFileUpload={handleFileUpload} isLoading={isLoading} fileName={fileName} />;
      case 2:
        return <Step2Details form={form} onSubmit={onDetailsSubmit} />;
      case 3:
        return <Step3Review data={finalData!} onStartOver={handleStartOver} />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 sm:px-6 lg:px-8">
      <nav aria-label="Progress">
        <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
          {steps.map((step, index) => (
            <li key={step.name} className="md:flex-1">
              <div
                className={`group flex flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pl-0 md:pt-4 md:pb-0 ${
                  index + 1 < currentStep
                    ? 'border-primary'
                    : index + 1 === currentStep
                    ? 'border-primary'
                    : 'border-gray-200'
                }`}
              >
                <span className={`text-sm font-medium ${
                  index + 1 <= currentStep ? 'text-primary' : 'text-gray-500'
                }`}>{step.id}</span>
                <span className="text-sm font-medium">{step.name}</span>
              </div>
            </li>
          ))}
        </ol>
      </nav>

      <Card className="mt-8 shadow-lg">
        {renderStepContent()}
      </Card>
    </div>
  );
}

const Step1Upload = ({ onFileUpload, isLoading, fileName }: { onFileUpload: (file: File) => void, isLoading: boolean, fileName: string | null }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDragEvents = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Upload Requirement Document</CardTitle>
        <CardDescription>Upload your requirement document in .doc, .docx, or .pdf format.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
            <p className="text-lg font-medium">Parsing document with AI...</p>
            <p className="text-sm text-muted-foreground">{fileName}</p>
          </div>
        ) : (
          <div
            className={`flex justify-center rounded-lg border-2 border-dashed ${isDragging ? 'border-primary bg-primary/10' : 'border-border'} px-6 py-10`}
            onDrop={handleDrop}
            onDragEnter={handleDragEvents}
            onDragOver={handleDragEvents}
            onDragLeave={handleDragEvents}
          >
            <div className="text-center">
              <FileUp className="mx-auto h-12 w-12 text-muted-foreground" />
              <div className="mt-4 flex text-sm leading-6 text-foreground">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-primary/80"
                >
                  <span>Upload a file</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".doc,.docx,.pdf" />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs leading-5 text-muted-foreground">DOC, DOCX, PDF up to 10MB</p>
            </div>
          </div>
        )}
      </CardContent>
    </>
  );
};

const Step2Details = ({ form, onSubmit }: { form: any, onSubmit: (data: FormData) => void }) => {
  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Verify Extracted Details</CardTitle>
        <CardDescription>Review and complete the information extracted by the AI.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Acme Corporation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vdsrVersion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>vDSR Version</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 24.1.0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a platform" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Openstack">Openstack</SelectItem>
                        <SelectItem value="KVM">KVM</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="openstackVersion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Openstack Version</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Wallaby" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="numberOfSites"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Sites</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="numberOfNoams"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of NOAMs</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              <FormField
                control={form.control}
                name="isIdihRequired"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>IDIH Required?</FormLabel>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="isUdrRequired"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>UDR Required?</FormLabel>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isSpareSoamRequired"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Spare SOAM?</FormLabel>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isSbrRequired"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>SBR Required?</FormLabel>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end pt-6">
              <Button type="submit" size="lg">
                Generate HLD <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </>
  );
};

const Step3Review = ({ data, onStartOver }: { data: FormData, onStartOver: () => void }) => {
  const DetailItem = ({ label, value }: { label: string, value: React.ReactNode }) => (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm text-foreground sm:col-span-2 sm:mt-0">{value}</dd>
    </div>
  );

  return (
    <>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-headline">Generated HLD Details</CardTitle>
            <CardDescription>This is a summary of the information for your HLD.</CardDescription>
          </div>
          <Button variant="outline" onClick={onStartOver}><RefreshCw className="mr-2 h-4 w-4"/> Start Over</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border-t border-border">
          <dl className="divide-y divide-border">
            <DetailItem label="Customer Name" value={data.customerName} />
            <DetailItem label="vDSR Version" value={data.vdsrVersion} />
            <DetailItem label="Platform" value={data.platform} />
            {data.platform === 'Openstack' && <DetailItem label="Openstack Version" value={data.openstackVersion || 'Not Provided'} />}
            <DetailItem label="Number of Sites" value={data.numberOfSites} />
            <DetailItem label="Number of NOAMs" value={data.numberOfNoams} />
            <DetailItem label="IDIH Required" value={data.isIdihRequired ? 'Yes' : 'No'} />
            <DetailItem label="UDR Required" value={data.isUdrRequired ? 'Yes' : 'No'} />
            <DetailItem label="Spare SOAM Required" value={data.isSpareSoamRequired ? 'Yes' : 'No'} />
            <DetailItem label="SBR Required" value={data.isSbrRequired ? 'Yes' : 'No'} />
          </dl>
        </div>
      </CardContent>
    </>
  );
};

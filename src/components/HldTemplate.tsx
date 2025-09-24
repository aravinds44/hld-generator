'use client';

import React from 'react';
import type { HldData } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

interface HldTemplateProps {
  data: HldData;
}

const HldTemplate: React.FC<HldTemplateProps> = ({ data }) => {
  return (
    <div className="bg-background p-8 rounded-lg shadow-md max-w-4xl mx-auto my-8 font-serif">
      <header className="text-center mb-12 border-b-4 border-primary pb-4">
        <h1 className="text-5xl font-bold text-primary mb-2">High-Level Design</h1>
        <h2 className="text-3xl font-semibold text-foreground">vDSR Deployment for {data.customerName}</h2>
      </header>

      <section className="mb-10">
        <h3 className="text-2xl font-bold text-primary border-b-2 border-primary/30 pb-2 mb-4">1. Introduction</h3>
        <p className="text-lg leading-relaxed">
          This document outlines the High-Level Design (HLD) for the deployment of Oracle vDSR (Virtual Diameter Signaling Router) version {data.vdsrVersion} for {data.customerName}. The solution is designed to be deployed on {data.platform} {data.platform === 'Openstack' ? `version ${data.openstackVersion}` : ''}.
        </p>
      </section>
      
      <section className="mb-10">
        <h3 className="text-2xl font-bold text-primary border-b-2 border-primary/30 pb-2 mb-4">2. Deployment Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
          <div className="bg-card p-4 rounded-md border"><strong>Customer:</strong> {data.customerName}</div>
          <div className="bg-card p-4 rounded-md border"><strong>vDSR Version:</strong> {data.vdsrVersion}</div>
          <div className="bg-card p-4 rounded-md border"><strong>Platform:</strong> {data.platform}</div>
          {data.platform === 'Openstack' && <div className="bg-card p-4 rounded-md border"><strong>Openstack Version:</strong> {data.openstackVersion}</div>}
          <div className="bg-card p-4 rounded-md border"><strong>Number of Sites:</strong> {data.numberOfSites}</div>
          <div className="bg-card p-4 rounded-md border"><strong>Number of NOAMs:</strong> {data.numberOfNoams}</div>
          <div className="bg-card p-4 rounded-md border"><strong>IDIH Required:</strong> {data.isIdihRequired ? 'Yes' : 'No'}</div>
          <div className="bg-card p-4 rounded-md border"><strong>UDR Required:</strong> {data.isUdrRequired ? 'Yes' : 'No'}</div>
          <div className="bg-card p-4 rounded-md border"><strong>Spare SOAM:</strong> {data.isSpareSoamRequired ? 'Yes' : 'No'}</div>
          <div className="bg-card p-4 rounded-md border"><strong>SBR Required:</strong> {data.isSbrRequired ? 'Yes' : 'No'}</div>
        </div>
      </section>

      <section className="mb-10">
        <h3 className="text-2xl font-bold text-primary border-b-2 border-primary/30 pb-2 mb-4">3. High-Level Architecture</h3>
        <p className="text-lg leading-relaxed mb-6">
          The proposed architecture consists of {data.numberOfSites} geo-redundant sites. Each site will host a full stack of vDSR components to ensure high availability and disaster recovery. The diagram below provides a conceptual overview of the deployment.
        </p>
        <div className="flex justify-center p-4 border rounded-lg bg-card">
          <Image
            src="https://picsum.photos/seed/arch/800/450"
            alt="High-Level Architecture Diagram"
            width={800}
            height={450}
            className="rounded-md"
            data-ai-hint="architecture diagram"
          />
        </div>
        <p className="text-center text-sm text-muted-foreground mt-2">Figure 1: Conceptual Architecture Diagram</p>
      </section>

      <section>
        <h3 className="text-2xl font-bold text-primary border-b-2 border-primary/30 pb-2 mb-4">4. Included Features</h3>
         <ul className="list-disc list-inside text-lg space-y-3">
          {data.isIdihRequired && <li><strong>Integrated Diameter Intelligence Hub (IDIH):</strong> Will be deployed for advanced analytics and reporting capabilities.</li>}
          {data.isSbrRequired && <li><strong>Subscriber Binding Repository (SBR):</strong> Included to maintain session state and subscriber data binding.</li>}
          <li><strong>Geo-Redundancy:</strong> The {data.numberOfSites}-site deployment model provides robust failover capabilities.</li>
          <li><strong>Centralized Management:</strong> {data.numberOfNoams} NOAMs provide a centralized point for network operations and management.</li>
        </ul>
      </section>
    </div>
  );
};

export default HldTemplate;

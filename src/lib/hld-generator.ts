'use client';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, ImageRun } from 'docx';
import { saveAs } from 'file-saver';
import type { HldData } from './types';

const fetchImageAsBase64 = async (url: string) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

export const generateHldDocument = async (data: HldData) => {
  const doc = new Document({
    sections: [],
  });

  const addSection = (title: string, children: any[]) => {
    const sectionChildren = [
      new Paragraph({
        text: title,
        heading: HeadingLevel.HEADING_1,
      }),
      ...children,
    ];
    doc.addSection({
      properties: {},
      children: sectionChildren,
    });
  };

  const archImageUrl = 'https://picsum.photos/seed/arch/800/450';
  const archImageBase64 = await fetchImageAsBase64(archImageUrl) as string;

  const sections = [
    {
      title: 'Introduction',
      content: [
        new Paragraph({
          children: [
            new TextRun(`This document outlines the High-Level Design (HLD) for the deployment of Oracle vDSR (Virtual Diameter Signaling Router) version ${data.vdsrVersion} for ${data.customerName}. The solution is designed to be deployed on ${data.platform} ${data.platform === 'Openstack' ? `version ${data.openstackVersion}` : ''}.`),
          ],
        }),
      ],
    },
    {
      title: 'Deployment Summary',
      content: [
        new Paragraph(`Customer: ${data.customerName}`),
        new Paragraph(`vDSR Version: ${data.vdsrVersion}`),
        new Paragraph(`Platform: ${data.platform}`),
        ...(data.platform === 'Openstack' ? [new Paragraph(`Openstack Version: ${data.openstackVersion}`)] : []),
        new Paragraph(`Number of Sites: ${data.numberOfSites}`),
        new Paragraph(`Number of NOAMs: ${data.numberOfNoams}`),
        new Paragraph(`IDIH Required: ${data.isIdihRequired ? 'Yes' : 'No'}`),
        new Paragraph(`UDR Required: ${data.isUdrRequired ? 'Yes' : 'No'}`),
        new Paragraph(`Spare SOAM: ${data.isSpareSoamRequired ? 'Yes' : 'No'}`),
        new Paragraph(`SBR Required: ${data.isSbrRequired ? 'Yes' : 'No'}`),
      ],
    },
    {
        title: 'High-Level Architecture',
        content: [
            new Paragraph({
                children: [
                    new TextRun(`The proposed architecture consists of ${data.numberOfSites} geo-redundant sites. Each site will host a full stack of vDSR components to ensure high availability and disaster recovery. The diagram below provides a conceptual overview of the deployment.`),
                ],
            }),
            new Paragraph({
                children: [
                    new ImageRun({
                        data: archImageBase64.split(',')[1],
                        transformation: {
                            width: 600,
                            height: 337.5,
                        },
                    }),
                ],
            }),
             new Paragraph({
                text: "Figure 1: Conceptual Architecture Diagram",
                style: "Caption"
            }),
        ],
    },
    {
      title: 'Included Features',
      content: [
        ...(data.isIdihRequired ? [new Paragraph({ text: 'Integrated Diameter Intelligence Hub (IDIH): Will be deployed for advanced analytics and reporting capabilities.', bullet: { level: 0 } })] : []),
        ...(data.isSbrRequired ? [new Paragraph({ text: 'Subscriber Binding Repository (SBR): Included to maintain session state and subscriber data binding.', bullet: { level: 0 } })] : []),
        new Paragraph({ text: `Geo-Redundancy: The ${data.numberOfSites}-site deployment model provides robust failover capabilities.`, bullet: { level: 0 } }),
        new Paragraph({ text: `Centralized Management: ${data.numberOfNoams} NOAMs provide a centralized point for network operations and management.`, bullet: { level: 0 } }),
      ],
    },
  ];

  doc.addSection({
    children: [
      new Paragraph({
        text: 'High-Level Design',
        heading: HeadingLevel.TITLE,
      }),
      new Paragraph({
        text: `vDSR Deployment for ${data.customerName}`,
        heading: HeadingLevel.HEADING_2,
      }),
    ],
  });

  sections.forEach(section => {
    addSection(section.title, section.content);
  });

  Packer.toBlob(doc).then(blob => {
    saveAs(blob, `HLD_${data.customerName}_vDSR.docx`);
  });
};

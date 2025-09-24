'use client';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  ImageRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
} from 'docx';
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

const createSummaryRow = (label: string, value: string) => {
  return new TableRow({
    children: [
      new TableCell({
        children: [
          new Paragraph({
            children: [new TextRun({ text: label, bold: true })],
          }),
        ],
        borders: {
          top: { style: BorderStyle.SINGLE, size: 1, color: 'D3D3D3' },
          bottom: { style: BorderStyle.SINGLE, size: 1, color: 'D3D3D3' },
          left: { style: BorderStyle.SINGLE, size: 1, color: 'D3D3D3' },
          right: { style: BorderStyle.SINGLE, size: 1, color: 'D3D3D3' },
        },
        margins: { top: 100, bottom: 100, left: 100, right: 100 },
      }),
      new TableCell({
        children: [new Paragraph(value)],
        borders: {
          top: { style: BorderStyle.SINGLE, size: 1, color: 'D3D3D3' },
          bottom: { style: BorderStyle.SINGLE, size: 1, color: 'D3D3D3' },
          left: { style: BorderStyle.SINGLE, size: 1, color: 'D3D3D3' },
          right: { style: BorderStyle.SINGLE, size: 1, color: 'D3D3D3' },
        },
        margins: { top: 100, bottom: 100, left: 100, right: 100 },
      }),
    ],
  });
};

export const generateHldDocument = async (data: HldData) => {
  const archImageUrl = 'https://picsum.photos/seed/arch/800/450';
  const archImageBase64 = (await fetchImageAsBase64(archImageUrl)) as string;

  const summaryRows = [
    createSummaryRow('Customer:', data.customerName),
    createSummaryRow('vDSR Version:', data.vdsrVersion),
    createSummaryRow('Platform:', data.platform),
    ...(data.platform === 'Openstack' ? [createSummaryRow('Openstack Version:', data.openstackVersion || 'N/A')] : []),
    createSummaryRow('Number of Sites:', String(data.numberOfSites)),
    createSummaryRow('Number of NOAMs:', String(data.numberOfNoams)),
    createSummaryRow('IDIH Required:', data.isIdihRequired ? 'Yes' : 'No'),
    createSummaryRow('UDR Required:', data.isUdrRequired ? 'Yes' : 'No'),
    createSummaryRow('Spare SOAM:', data.isSpareSoamRequired ? 'Yes' : 'No'),
    createSummaryRow('SBR Required:', data.isSbrRequired ? 'Yes' : 'No'),
  ];
  
  const summaryTable = new Table({
    columnWidths: [4500, 4500],
    rows: summaryRows,
    width: {
        size: 9000,
        type: WidthType.DXA,
    },
  });


  const doc = new Document({
    styles: {
      paragraphStyles: [
        {
          id: 'Caption',
          name: 'Caption',
          basedOn: 'Normal',
          next: 'Normal',
          run: {
            italics: true,
          },
          paragraph: {
            spacing: {
              after: 120,
            },
          },
        },
      ],
    },
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: 'High-Level Design',
            heading: HeadingLevel.TITLE,
          }),
          new Paragraph({
            text: `vDSR Deployment for ${data.customerName}`,
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 240 },
          }),
          new Paragraph({
            text: '1. Introduction',
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            children: [
              new TextRun(
                `This document outlines the High-Level Design (HLD) for the deployment of Oracle vDSR (Virtual Diameter Signaling Router) version ${data.vdsrVersion} for ${data.customerName}. The solution is designed to be deployed on ${data.platform} ${data.platform === 'Openstack' ? `version ${data.openstackVersion}` : ''}.`
              ),
            ],
            spacing: { after: 240 },
          }),
          new Paragraph({
            text: '2. Deployment Summary',
            heading: HeadingLevel.HEADING_1,
          }),
          summaryTable,
          new Paragraph({
              text: '',
              spacing: { after: 240 },
          }),
          new Paragraph({
            text: '3. High-Level Architecture',
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            children: [
              new TextRun(
                `The proposed architecture consists of ${data.numberOfSites} geo-redundant sites. Each site will host a full stack of vDSR components to ensure high availability and disaster recovery. The diagram below provides a conceptual overview of the deployment.`
              ),
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
            spacing: { after: 120 },
          }),
          new Paragraph({
            text: 'Figure 1: Conceptual Architecture Diagram',
            style: 'Caption',
          }),
          new Paragraph({
            text: '4. Included Features',
            heading: HeadingLevel.HEADING_1,
          }),
          ...(data.isIdihRequired
            ? [
                new Paragraph({
                  text: 'Integrated Diameter Intelligence Hub (IDIH): Will be deployed for advanced analytics and reporting capabilities.',
                  bullet: { level: 0 },
                }),
              ]
            : []),
          ...(data.isSbrRequired
            ? [
                new Paragraph({
                  text: 'Subscriber Binding Repository (SBR): Included to maintain session state and subscriber data binding.',
                  bullet: { level: 0 },
                }),
              ]
            : []),
          new Paragraph({
            text: `Geo-Redundancy: The ${data.numberOfSites}-site deployment model provides robust failover capabilities.`,
            bullet: { level: 0 },
          }),
          new Paragraph({
            text: `Centralized Management: ${data.numberOfNoams} NOAMs provide a centralized point for network operations and management.`,
            bullet: { level: 0 },
          }),
        ],
      },
    ],
  });

  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, `HLD_${data.customerName}_vDSR.docx`);
  });
};

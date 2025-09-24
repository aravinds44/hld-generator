'use server';

/**
 * @fileOverview Parses a requirement document to extract key details for HLD generation.
 *
 * - parseRequirementDocument - A function that handles the document parsing process.
 * - ParseRequirementDocumentInput - The input type for the parseRequirementDocument function.
 * - ParseRequirementDocumentOutput - The return type for the parseRequirementDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ParseRequirementDocumentInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "The requirement document as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ParseRequirementDocumentInput = z.infer<
  typeof ParseRequirementDocumentInputSchema
>;

const ParseRequirementDocumentOutputSchema = z.object({
  customerName: z.string().describe('The name of the customer.'),
  platform: z
    .string()
    .describe('The platform on which vDSR is to be deployed (e.g., KVM, Openstack).'),
  openstackVersion: z
    .string()
    .optional()
    .describe('The version of Openstack, if applicable.'),
  vdsrVersion: z.string().describe('The version of vDSR.'),
  isIdihRequired: z.boolean().describe('Whether IDIH is required.'),
  isUdrRequired: z.boolean().describe('Whether UDR is required.'),
  numberOfSites: z.number().describe('The total number of sites.'),
  numberOfNoams: z.number().describe('Total number of NOAMs.'),
  isSpareSoamRequired: z.boolean().describe('Whether a spare SOAM is required.'),
  isSbrRequired: z.boolean().describe('Whether SBR is required.'),
});
export type ParseRequirementDocumentOutput = z.infer<
  typeof ParseRequirementDocumentOutputSchema
>;

export async function parseRequirementDocument(
  input: ParseRequirementDocumentInput
): Promise<ParseRequirementDocumentOutput> {
  return parseRequirementDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'parseRequirementDocumentPrompt',
  input: {schema: ParseRequirementDocumentInputSchema},
  output: {schema: ParseRequirementDocumentOutputSchema},
  prompt: `You are an expert system analyst specializing in parsing requirement documents for vDSR deployments.

You will extract key details from the provided document to populate an HLD template. Please identify and extract the following information:

- Customer Name
- Platform (e.g., KVM, Openstack)
- Openstack Version (if applicable)
- vDSR Version
- Is IDIH required?
- Is UDR required?
- Total number of sites
- Total number of NOAMs
- Is Spare SOAM required?
- Is SBR required?

If a specific detail is not found, provide a best guess or indicate that it is unknown. The output should be structured according to the provided output schema.

Document: {{media url=documentDataUri}}`,
});

const parseRequirementDocumentFlow = ai.defineFlow(
  {
    name: 'parseRequirementDocumentFlow',
    inputSchema: ParseRequirementDocumentInputSchema,
    outputSchema: ParseRequirementDocumentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

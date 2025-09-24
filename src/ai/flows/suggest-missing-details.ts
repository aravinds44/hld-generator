'use server';

/**
 * @fileOverview This flow suggests missing details for HLD generation based on the requirement document.
 *
 * - suggestMissingDetails - A function that suggests missing details based on the provided document and checklist.
 * - SuggestMissingDetailsInput - The input type for the suggestMissingDetails function.
 * - SuggestMissingDetailsOutput - The output type for the suggestMissingDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestMissingDetailsInputSchema = z.object({
  documentText: z
    .string()
    .describe('The text content of the requirement document.'),
  missingDetails: z.array(z.string()).describe('A list of missing details to be suggested.'),
});
export type SuggestMissingDetailsInput = z.infer<typeof SuggestMissingDetailsInputSchema>;

const SuggestMissingDetailsOutputSchema = z.record(z.string(), z.string())
  .describe('A map of missing detail to suggested value');
export type SuggestMissingDetailsOutput = z.infer<typeof SuggestMissingDetailsOutputSchema>;

export async function suggestMissingDetails(input: SuggestMissingDetailsInput): Promise<SuggestMissingDetailsOutput> {
  return suggestMissingDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestMissingDetailsPrompt',
  input: {schema: SuggestMissingDetailsInputSchema},
  output: {schema: SuggestMissingDetailsOutputSchema},
  prompt: `You are an AI assistant that helps suggest missing details for generating a High-Level Design (HLD) document based on a requirement document.

Given the following requirement document:

{{documentText}}

And the following missing details:

{{#each missingDetails}}
- {{this}}
{{/each}}

Please suggest a reasonable value or option for each missing detail based on the context of the document. Return a JSON object where the keys are the missing details and the values are the suggested values.

Ensure the suggested values are consistent with the information available in the requirement document.

Output format:
{
  "missingDetail1": "suggestedValue1",
  "missingDetail2": "suggestedValue2",
  ...
}
`,
});

const suggestMissingDetailsFlow = ai.defineFlow(
  {
    name: 'suggestMissingDetailsFlow',
    inputSchema: SuggestMissingDetailsInputSchema,
    outputSchema: SuggestMissingDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

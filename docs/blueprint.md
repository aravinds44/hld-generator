# **App Name**: HLD Autopilot

## Core Features:

- NF Selection: Allow the user to select the Network Function (NF) from a dropdown list (e.g., vDSR).
- Document Upload: Enable users to upload requirement documents in .word or .pdf format.
- AI-Powered Document Parsing: Leverage AI to parse the uploaded document and extract key details required for HLD generation, acting as a tool to identify pre-defined checklist items (questions).
- Checklist Verification & Input: Present a checklist of unfilled details. If any information is missing from the requirement document, prompt the user to fill in the missing details via text boxes.
- Review and Edit Details: Provide a review screen where the user can review all the extracted and inputted details, with the ability to edit them before proceeding.
- HLD Generation: Populate the HLD template with the extracted details from the document and user input to automatically generate the HLD.
- HLD Review: Present the generated HLD to the user for final review.

## Style Guidelines:

- Primary color: Deep blue (#3F51B5) to align with a professional, enterprise application feel.
- Background color: Light gray (#F5F5F5), creating a clean and neutral base.
- Accent color: Teal (#009688), provides visual interest and highlights interactive elements without overwhelming the UI.
- Body and headline font: 'Inter', a sans-serif font, providing a modern and readable aesthetic suitable for both headings and body text.
- Note: currently only Google Fonts are supported.
- Use Oracle Redwood-style icons to maintain visual consistency with the requested theme.
- Incorporate a clean, structured layout with clear sections for each step of the HLD generation process.
import { z } from 'zod';

export const hldDataSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required.'),
  platform: z.string().min(1, 'Platform is required.'),
  openstackVersion: z.string().optional(),
  vdsrVersion: z.string().min(1, 'vDSR version is required.'),
  isIdihRequired: z.boolean(),
  isUdrRequired: z.boolean(),
  numberOfSites: z.coerce.number().min(1, 'At least one site is required.'),
  numberOfNoams: z.coerce.number().min(1, 'At least one NOAM is required.'),
  isSpareSoamRequired: z.boolean(),
  isSbrRequired: z.boolean(),
});

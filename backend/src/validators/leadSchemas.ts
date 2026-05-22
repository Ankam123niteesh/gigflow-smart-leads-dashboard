import { z } from 'zod';

export const leadStatusValues = ['New', 'Contacted', 'Qualified', 'Lost'] as const;
export const leadSourceValues = ['Website', 'Instagram', 'Referral'] as const;

export const leadCreateSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Enter a valid email'),
    status: z.enum(leadStatusValues).optional(),
    source: z.enum(leadSourceValues).optional(),
  }),
});

export const leadUpdateSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name is required').optional(),
    email: z.string().email('Enter a valid email').optional(),
    status: z.enum(leadStatusValues).optional(),
    source: z.enum(leadSourceValues).optional(),
  }),
});

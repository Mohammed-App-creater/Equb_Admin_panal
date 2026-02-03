import { z } from 'zod';

export const equbSchema = z.object({
    id: z.string(),
    name: z.string().min(3, "Name must be at least 3 characters"),
    contributionAmount: z.number().positive("Contribution must be a positive number"),
    frequency: z.enum(['daily', 'weekly', 'monthly']),
    totalMembers: z.number().int().min(1, "Must have at least 1 member"),
    status: z.enum(['active', 'completed', 'pending']),
    createdAt: z.string(),
});

export const createEqubSchema = equbSchema.omit({
    id: true,
    status: true,
    createdAt: true
});

export type Equb = z.infer<typeof equbSchema>;
export type CreateEqubInput = z.infer<typeof createEqubSchema>;

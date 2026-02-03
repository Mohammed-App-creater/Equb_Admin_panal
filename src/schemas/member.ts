import { z } from 'zod';

export const memberStatusSchema = z.enum(['pending', 'approved', 'rejected']);

export const memberSchema = z.object({
    id: z.string(),
    fullName: z.string(),
    phone: z.string(),
    joinedAt: z.string(),
    status: memberStatusSchema,
    totalContributed: z.number(),
});

export const memberActionSchema = z.object({
    reason: z.string().optional(),
});

export type Member = z.infer<typeof memberSchema>;
export type MemberStatus = z.infer<typeof memberStatusSchema>;

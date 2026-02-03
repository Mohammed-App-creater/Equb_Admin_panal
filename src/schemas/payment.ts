import { z } from 'zod';
import { memberStatusSchema } from './member';

export const paymentSchema = z.object({
    id: z.string(),
    memberId: z.string(),
    memberName: z.string(),
    amount: z.number().positive(),
    date: z.string(),
    status: memberStatusSchema,
    receiptUrl: z.string().url().optional(),
    isManual: z.boolean(),
});

export const recordPaymentSchema = z.object({
    memberId: z.string().min(1, "Member is required"),
    amount: z.number().positive("Amount must be positive"),
    receipt: z.any().refine((file) => file instanceof File && file.size <= 10 * 1024 * 1024, {
        message: "Receipt must be an image less than 10MB",
    }).optional(),
});

export type Payment = z.infer<typeof paymentSchema>;
export type RecordPaymentInput = z.infer<typeof recordPaymentSchema>;

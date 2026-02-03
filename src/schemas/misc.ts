import { z } from 'zod';

export const roundSchema = z.object({
    id: z.string(),
    roundNumber: z.number(),
    status: z.enum(['pending', 'completed']),
    winnerName: z.string().optional(),
    drawDate: z.string().optional(),
});

export const activitySchema = z.object({
    id: z.string(),
    type: z.enum(['payment', 'draw', 'new_member']),
    message: z.string(),
    timestamp: z.string(),
});

export const dashboardSummarySchema = z.object({
    totalEqubs: z.number().optional(), // Adding flexible types for safety
    totalMembers: z.number().optional(),
    activeCycles: z.number().optional(),
    totalSavings: z.number().optional(),
    recentActivity: z.array(activitySchema).default([]),
});

export type Round = z.infer<typeof roundSchema>;
export type Activity = z.infer<typeof activitySchema>;
export type DashboardSummary = z.infer<typeof dashboardSummarySchema>;

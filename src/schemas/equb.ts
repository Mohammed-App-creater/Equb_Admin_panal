import { z } from "zod";

/**
 * Full Equb object (as returned by backend)
 */
export const equbSchema = z.object({
  id: z.string().uuid(),

  name: z.string().min(3, "Name must be at least 3 characters"),

  category: z.string().uuid(),
  equb_type: z.string().uuid().nullable().optional(),

  contribution_amount: z.coerce
    .number()
    .positive("Contribution must be a positive number"),

  total_members: z
    .number()
    .int()
    .min(2, "Equb must have at least 2 members"),

  payout_system: z.enum([
    "random",
    "first_come_first_serve",
  ]),

  start_date: z.string(),
  end_date: z.string(),

  rules: z.string().min(10, "Rules must be at least 10 characters"),

  total_payout: z.string(),
  total_equb_value: z.string(),

  status: z.enum([
    "draft",
    "active",
    "completed",
    "cancelled",
  ]),

  created_at: z.string(),
  updated_at: z.string(),
});

/**
 * Input when creating a new Equb
 * (matches what your form submits)
 */
export const createEqubSchema = equbSchema.omit({
  id: true,
  total_payout: true,
  total_equb_value: true,
  status: true,
  created_at: true,
  updated_at: true,
});


/**
 * STEP 1: Basic info
 */
export const step1Schema = createEqubSchema.pick({
  name: true,
  contribution_amount: true,
  total_members: true,
});

/**
 * STEP 2: Structure
 */
export const step2Schema = createEqubSchema.pick({
  category: true,
  payout_system: true,
  start_date: true,
  end_date: true,
}).refine(
  (data) => new Date(data.end_date) > new Date(data.start_date),
  {
    message: "End date must be after start date",
    path: ["end_date"],
  }
);

/**
 * STEP 3: Rules
 */
export const step3Schema = createEqubSchema.pick({
  rules: true,
});

export type Equb = z.infer<typeof equbSchema>;
export type CreateEqubInput = z.infer<typeof createEqubSchema>;

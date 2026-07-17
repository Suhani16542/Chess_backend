import { z } from "zod";

export const demoLeadSchema = z.object({
  studentName: z
    .string()
    .min(2, "Student name must be at least 2 characters")
    .max(100, "Student name cannot exceed 100 characters")
    .trim(),

  parentName: z
    .string()
    .min(2, "Parent name must be at least 2 characters")
    .max(100, "Parent name cannot exceed 100 characters")
    .trim(),

  email: z
    .string()
    .email("Please provide a valid email address")
    .trim()
    .toLowerCase(),

  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Please provide a valid 10-digit Indian phone number"),

  age: z
    .number({ error: "Age must be a number" })
    .int("Age must be a whole number")
    .min(4, "Minimum age is 4")
    .max(18, "Maximum age is 18"),

  city: z
    .string()
    .min(2, "City must be at least 2 characters")
    .max(100, "City cannot exceed 100 characters")
    .trim(),

  chessExperience: z.enum(["None", "Beginner", "Intermediate", "Advanced"]),

  preferredTime: z
    .string()
    .min(2, "Preferred time must be at least 2 characters")
    .max(100, "Preferred time cannot exceed 100 characters")
    .trim(),

  message: z
    .string()
    .max(1000, "Message cannot exceed 1000 characters")
    .trim()
    .optional(),
});

export type DemoLeadInput = z.infer<typeof demoLeadSchema>;

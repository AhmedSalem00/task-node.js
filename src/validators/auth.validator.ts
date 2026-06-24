import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').max(120),
    email: z.string().trim().email('Invalid email address'),
    // Role is intentionally excluded — the server always assigns 'member' on registration.
    password: z.string().min(8, 'Password must be at least 8 characters').max(100),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const updateMeSchema = z.object({
  body: z
    .object({
      name:            z.string().trim().min(2).max(120).optional(),
      currentPassword: z.string().min(1).optional(),
      password:        z.string().min(8).max(100).optional(),
    })
    .refine((d) => Object.keys(d).length > 0, {
      message: 'At least one field must be provided',
    })
    .refine((d) => !(d.password && !d.currentPassword), {
      message: 'Current password is required when changing your password',
      path: ['currentPassword'],
    }),
});

export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];

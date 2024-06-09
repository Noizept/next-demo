import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email().min(5, { message: 'min 5' }),
  password: z.string(),
});
export type LoginSchemaType = z.infer<typeof registerSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(5, { message: 'min 5' }),
    email: z.string().email({ message: 'Not Valid Email' }),
    password: z
      .string()
      .min(8, { message: 'Password is too short' })
      .max(20, { message: 'Password is too long' }),
    confirmPassword: z.string(),
    // enabled: z.coerce.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'], // path of error
  });
export type RegisterSchemaType = z.infer<typeof registerSchema>;

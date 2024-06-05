import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(5),
  email: z.string().email().min(5),
  password: z.string().min(5),
  // enabled: z.coerce.boolean(),
});

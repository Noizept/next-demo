import { z } from "zod";

export type RegisterForm = {
  name: string;
  email: string;
  phoneNumber: number;
  password: string;
};
export const registerSchema = z.object({
  name: z.string(),
  email: z.string().email().min(5),
  phoneNumber: z.number().min(9).optional().or(z.literal(null)),
  password: z.string().min(5),
  // enabled: z.coerce.boolean(),
});

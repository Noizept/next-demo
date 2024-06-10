'use server';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SignJWT } from 'jose';

import postgres from '@/databases/postgres';
import { registerSchema, loginSchema } from '@/schemas/authSchemas';
const SALT_ROUNDS = 10;
import { signIn } from '@/auth';

export const onRegister = async (
  state: { status: 'SUCCESS' | 'DEFAULT' | 'FAILURE'; userId?: string },
  payload: z.infer<typeof registerSchema>,
): Promise<{ status: 'SUCCESS' | 'DEFAULT' | 'FAILURE'; userId?: string }> => {
  const { error } = registerSchema.safeParse(payload);
  if (error) return { status: 'FAILURE' };

  const { confirmPassword, ...userData } = payload;
  userData.password = bcrypt.hashSync(payload.password, SALT_ROUNDS);
  const user = await postgres.user.create({ data: userData });

  return { status: 'SUCCESS', userId: user.id };
};

export const onLoginAction = async (
  state: { status: 'SUCCESS' | 'DEFAULT' | 'FAILURE'; error?: string },
  payload: z.infer<typeof loginSchema>,
): Promise<{ status: 'SUCCESS' | 'DEFAULT' | 'FAILURE'; error?: string }> => {
  // try {
  const dataToSubmit = loginSchema.safeParse(payload);
  if (!dataToSubmit.success)
    return { ...state, status: 'FAILURE', error: 'Invalid credentials' };
  const a = await signIn('credentials', {
    email: dataToSubmit.data.email,
    password: dataToSubmit.data.password,
    redirectTo: '/',
  });

  
  return { status: 'SUCCESS' };
};

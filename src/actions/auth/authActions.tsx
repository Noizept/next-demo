'use server';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SignJWT } from 'jose';

import postgres from '@/databases/postgres';
import { registerSchema, loginSchema } from '@/schemas/authSchemas';
const SALT_ROUNDS = 10;

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

//!NOTE: redirect(/) works as throwing an exception under the hood
//! when using the try catch, the catch will not allow the error to propagate
//! therefore the redirect won't work

export const onSubmitAction = async (
  state: { status: 'SUCCESS' | 'DEFAULT' | 'FAILURE'; error?: string },
  payload: z.infer<typeof loginSchema>,
): Promise<{ status: 'SUCCESS' | 'DEFAULT' | 'FAILURE'; error?: string }> => {
  // try {
  const dataToSubmit = loginSchema.safeParse(payload);
  if (!dataToSubmit.success)
    return { ...state, status: 'FAILURE', error: 'Invalid credentials' };

  const user = await postgres.user.findUnique({
    where: {
      email: dataToSubmit.data.email,
    },
  });

  if (!user) return { ...state, status: 'FAILURE', error: 'Invalid credentials' };
  const isValidPassword = await bcrypt.compare(payload.password, user.password!);
  if (!isValidPassword)
    return { ...state, status: 'FAILURE', error: 'Invalid credentials' };

  const jwtCreate = new SignJWT({
    id: user.id,
    email: user.email,
    name: user.name,
  })
    .setExpirationTime(process.env.JWT_EXPIRES_IN!)
    .setProtectedHeader({ alg: 'HS256' });

  const token = await jwtCreate.sign(new TextEncoder().encode(process.env.AUTH_SECRET!));

  //! usefull for blacklist tokens. so we dont need keep session data for token revoke
  // await redis.setex('REVOKED_TOKENS', 7776000, token);
  cookies().set('next_demo_cookie', token, { httpOnly: true });
  redirect('/');
  // } catch (error: any) {
  //   console.error(error);
  //   console.error('Validation error', error.message as string);
  //   return { status: 'FAILURE', error: error.message as string };
  // }
};

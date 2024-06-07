'use server';
import { loginSchema } from './loginSchema';
import bcrypt from 'bcrypt';
import postgres from '@/databases/postgres';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

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
  const isValidPassword = await bcrypt.compare(payload.password, user.password);
  if (!isValidPassword)
    return { ...state, status: 'FAILURE', error: 'Invalid credentials' };

  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    //@ts-ignore
    process.env.DATABASE_URL,
    { expiresIn: process.env.JWT_EXPIRES_IN },
  );

  await postgres.token.create({
    data: {
      token,
    },
  });

  cookies().set('next_demo_cookie', token, { httpOnly: true });
  redirect('/');
  // } catch (error: any) {
  //   console.error(error);
  //   console.error('Validation error', error.message as string);
  //   return { status: 'FAILURE', error: error.message as string };
  // }
};

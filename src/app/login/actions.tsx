'use server';
import { loginSchema } from './loginSchema';
import bcrypt from 'bcrypt';
import postgres from '@/databases/postgres';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const onSubmitAction = async (
  state: { status: 'SUCCESS' | 'DEFAULT' | 'FAILURE'; error?: string },
  payload: z.infer<typeof loginSchema>,
): Promise<{ status: 'SUCCESS' | 'DEFAULT' | 'FAILURE'; error?: string }> => {
  try {
    loginSchema.parse(payload);
    const user = await postgres.user.findUnique({
      where: {
        email: payload.email,
      },
    });
    if (!user) throw new Error('Invalid credentials');
    const isValidPassword = await bcrypt.compare(payload.password, user.password);
    if (!isValidPassword) throw new Error('Invalid credentials');

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      //@ts-ignore
      process.env.DATABASE_URL,
      {
        expiresIn: 3000,
      },
    );

    await postgres.token.create({
      data: {
        token,
      },
    });

    cookies().set('jwt', token, { httpOnly: true });
    console.log('dick');
    redirect('/');
    return { status: 'SUCCESS' };
  } catch (error: any) {
    console.error(error);
    console.error('Validation error', error.message as string);
    return { status: 'FAILURE', error: error.message as string };
  }
};

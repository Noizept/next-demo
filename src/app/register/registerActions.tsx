'use server';
import { z } from 'zod';
import bcrypt from 'bcrypt';

import postgres from '../../databases/postgres';
import { registerSchema } from './registerValitors';

const SALT_ROUNDS = 10;

export const onSubmitAction = async (
  state: { status: 'SUCCESS' | 'DEFAULT' | 'FAILURE'; userId?: number },
  payload: z.infer<typeof registerSchema>,
): Promise<{ status: 'SUCCESS' | 'DEFAULT' | 'FAILURE'; userId?: number }> => {
  try {
    registerSchema.parse(payload);
    const { confirmPassword, ...userData } = payload;
    userData.password = bcrypt.hashSync(payload.password, SALT_ROUNDS);
    const user = await postgres.user.create({ data: userData });
    return { status: 'SUCCESS', userId: user.id };
  } catch (error) {
    console.error('Validation error', error);
    return { status: 'FAILURE' };
  }
};

'use server';
import postgres from '../../databases/postgres';
import { registerSchema } from './registerValitors';

export const onSubmitAction = async (state: any, payload: FormData): Promise<boolean> => {
  console.log(state, payload);
  return false;
};

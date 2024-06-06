'use client';
import React from 'react';
import { z } from 'zod';

import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';
import { zodResolver } from '@hookform/resolvers/zod';

import { onSubmitAction } from './actions';
import { loginSchema } from './loginSchema';

type FormValues = z.infer<typeof loginSchema>;

export default function SignupForm() {
  const [state, formAction, isPending] = React.useActionState(onSubmitAction, {
    status: 'DEFAULT',
  });

  const {
    control,
    register,
    formState: { errors, isDirty, isValid },
    handleSubmit,
  } = useForm<FormValues>({
    mode: 'all',
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [isClient, setIsClient] = React.useState(false);
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    formAction(data);
  };
  React.useEffect(() => {
    if (state.error) toast.error(state.error);
  }, [state]);

  return isClient ? (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col max-w-screen-md justify-center">
        <h1 className="pb-10">Login</h1>
        <div>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <div className="flex w-full flex-col  pb-5">
                {' '}
                <label htmlFor="email">Email:</label>
                <input
                  placeholder="email"
                  {...field}
                  {...register('email')}
                  id={'email'}
                  value={field.value ?? ''}
                  type="email"
                />
                {errors.email && (
                  <span className="error-message">{errors.email.message}</span>
                )}
              </div>
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <div className="flex w-full flex-col  pb-5">
                {' '}
                <label htmlFor="password">Password:</label>
                <input
                  placeholder="password"
                  {...field}
                  {...register('password')}
                  id={'password'}
                  value={field.value ?? ''}
                  type="password"
                />
                {errors.password && (
                  <span className="error-message">{errors.password.message}</span>
                )}
              </div>
            )}
          />

          <div className="flex w-full flex-col  pb-5">
            <button
              type="submit"
              className="flex bg-sky-500 hover:bg-sky-700 w-full disabled:opacity-50 justify-center"
              disabled={!isDirty || !isValid || isPending} // here
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </form>
  ) : null;
}

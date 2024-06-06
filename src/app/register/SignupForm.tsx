'use client';
import React from 'react';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';
import { zodResolver } from '@hookform/resolvers/zod';

import { registerSchema } from './registerValitors';
import { onSubmitAction } from './registerActions';

type FormValues = z.infer<typeof registerSchema>;

export default function SignupForm() {
  const router = useRouter(); // Get the router instance

  const [state, formAction, isPending] = React.useActionState(onSubmitAction, {
    status: 'DEFAULT',
  });

  const {
    control,
    register,
    formState: { errors, isDirty, isValid },
    handleSubmit,
    watch,
  } = useForm<FormValues>({
    mode: 'all',
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });
  const email = watch('email');

  React.useEffect(() => {
    if (state.status === 'SUCCESS' && router) {
      toast.success(`success user: ${state.userId} email sent to: ${email}`);
      router.push('/dick');
    }
    if (state.status === 'FAILURE') toast.error('FAILURE');
  }, [state, router, email]);

  const [isClient, setIsClient] = React.useState(false);
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Render nothing on the server-side
  }

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    // const formData = new FormData();
    // Object.entries(data).forEach(([key, value]) => {
    //   formData.append(key, value !== null ? String(value) : '');
    // });
    formAction(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col max-w-screen-md justify-center">
        <h1 className="pb-10">Register</h1>
        <div>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <div className="flex w-full flex-col pb-5">
                <label htmlFor="name">Name:</label>
                <input
                  placeholder="name"
                  id={'name'}
                  {...field}
                  {...register('name')}
                  value={field.value ?? ''}
                />
                {errors.name && (
                  <span className="error-message">{errors.name.message}</span>
                )}
              </div>
            )}
          />
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
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <div className="flex w-full flex-col  pb-5">
                <label htmlFor="confirmPassword">Password:</label>
                <input
                  placeholder="Confirm Password"
                  {...field}
                  {...register('confirmPassword')}
                  id={'confirmPassword'}
                  value={field.value ?? ''}
                  type="password"
                  autoComplete="off"
                />
                {errors.confirmPassword && (
                  <span className="error-message">{errors.confirmPassword.message}</span>
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
  );
}

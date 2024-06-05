'use client';
import React from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { registerSchema } from './registerValitors';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';

import { onSubmitAction } from './registerActions';

type FormValues = z.infer<typeof registerSchema>;

export default function SignupForm() {
  const [state, formAction, isPending] = React.useActionState(onSubmitAction, false);

  const {
    control,
    register,
    formState: { errors, isDirty, isValid },
    handleSubmit,
  } = useForm<FormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  console.log(errors);
  React.useEffect(() => {
    if (state) toast.success('success');
    // else toast.error('error');
  }, [state]);

  const [isClient, setIsClient] = React.useState(false);
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Render nothing on the server-side
  }

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log('Form Data Submitted:', data); // Log submitted data

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value !== null ? String(value) : '');
    });
    formAction(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div style={{ maxWidth: '600px' }}>
        <h1>Register</h1>
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <>
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
              </>
            )}
          />
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <>
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
              </>
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <>
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
              </>
            )}
          />

          <button
            type="submit"
            className="submit-button"
            disabled={!isDirty || !isValid || isPending} // here
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  );
}

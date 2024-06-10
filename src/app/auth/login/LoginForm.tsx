'use client';
import React from 'react';
import { z } from 'zod';

import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';
import { zodResolver } from '@hookform/resolvers/zod';

import { onLoginAction } from '@/actions/auth';
import { loginSchema } from '@/schemas/authSchemas';

type FormValues = z.infer<typeof loginSchema>;

export default function SignupForm() {
  const [state, formAction, isPending] = React.useActionState(onLoginAction, {
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
    <div className="flex w-full justify-center h-fit">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body items-center">
          <h2 className="card-title">Login</h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col max-w-screen-md justify-center">
              <div>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <>
                      <label
                        className={`input input-bordered flex items-center gap-4 mt-2 ${
                          errors.email && 'input-error'
                        } `}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                          className="w-4 h-4 opacity-70"
                        >
                          <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                          <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                        </svg>
                        <input
                          type="text"
                          className="input input-md"
                          placeholder="Email"
                          {...field}
                          {...register('email')}
                          id={'email'}
                        />
                      </label>
                      {errors.email ? (
                        <span>{errors.email.message}</span>
                      ) : (
                        <span>&nbsp;</span>
                      )}
                    </>
                  )}
                />

                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <>
                      <label
                        className={`input input-bordered flex items-center gap-4 mt-1 ${
                          errors.password && 'input-error'
                        } `}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                          className="w-4 h-4 opacity-70"
                        >
                          <path
                            fillRule="evenodd"
                            d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <input
                          type="password"
                          className=""
                          placeholder="Password"
                          {...field}
                          {...register('password')}
                          id={'password'}
                        />
                      </label>
                      {errors.password ? (
                        <span>{errors.password.message}</span>
                      ) : (
                        <span>&nbsp;</span>
                      )}
                    </>
                  )}
                />

                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={!isDirty || !isValid || isPending} // here
                >
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  ) : null;
}

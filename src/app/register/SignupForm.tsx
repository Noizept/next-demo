"use client";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { registerSchema, RegisterForm } from "./registerValitors";
import { zodResolver } from "@hookform/resolvers/zod";

export default function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    control,
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema), // Apply the zodResolver
  });
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Render nothing on the server-side
  }

  const onSubmit = async (data: RegisterForm) => {
    console.log("SUCCESS", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div style={{ maxWidth: "600px" }}>
        <h1>Register</h1>
        <div
          style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
          <Controller
            name='name'
            control={control}
            render={({ field }) => (
              <>
                Name
                <input {...field} value={field.value ?? ""} />
                {errors.name && (
                  <span className='error-message'>{errors.name.message}</span>
                )}
              </>
            )}
          />
          <Controller
            name='email'
            control={control}
            render={({ field }) => (
              <>
                Email
                <input {...field} value={field.value ?? ""} type='email' />
                {errors.email && (
                  <span className='error-message'>{errors.email.message}</span>
                )}
              </>
            )}
          />

          <Controller
            name='password'
            control={control}
            render={({ field }) => (
              <>
                password
                <input {...field} value={field.value ?? ""} type='password' />
                {errors.password && (
                  <span className='error-message'>
                    {errors.password.message}
                  </span>
                )}
              </>
            )}
          />

          <button type='submit' className='submit-button'>
            Submit
          </button>
        </div>
      </div>
    </form>
  );
}

/**
 * src/features/auth/hooks/useRegister.ts
 *
 * Registration form logic. On success, Supabase sends an email confirmation.
 * The profile row is NOT created here — it will be created in the onboarding
 * username step, after the user confirms their email.
 */
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '../services';

const registerSchema = z
  .object({
    email: z.string().email('Enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Must contain at least one number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

interface UseRegisterReturn {
  form: ReturnType<typeof useForm<RegisterFormData>>;
  submit: (data: RegisterFormData) => Promise<void>;
  isLoading: boolean;
  serverError: string | null;
  isSuccess: boolean;
}

export function useRegister(): UseRegisterReturn {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
  });

  const submit = useCallback(async (data: RegisterFormData) => {
    setServerError(null);
    setIsLoading(true);
    try {
      const { error } = await authService.signUp({
        email: data.email.trim().toLowerCase(),
        password: data.password,
      });

      if (error) {
        setServerError(
          error.message.includes('already registered')
            ? 'This email is already in use. Try logging in.'
            : error.message,
        );
        return;
      }

      setIsSuccess(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { form, submit, isLoading, serverError, isSuccess };
}

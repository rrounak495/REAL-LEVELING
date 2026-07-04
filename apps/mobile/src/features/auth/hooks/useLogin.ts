/**
 * src/features/auth/hooks/useLogin.ts
 *
 * Login form logic using React Hook Form + Zod.
 * Calls Supabase auth directly (auth is not behind a repository — it's an
 * infrastructure concern, not a domain concern). Supabase's own typed client
 * is the interface here.
 */
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@lib/supabase';
import { useAuthStore } from '@store';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

interface UseLoginReturn {
  form: ReturnType<typeof useForm<LoginFormData>>;
  submit: (data: LoginFormData) => Promise<void>;
  isLoading: boolean;
  serverError: string | null;
}

export function useLogin(): UseLoginReturn {
  const setSession = useAuthStore((s) => s.setSession);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  const submit = useCallback(
    async (data: LoginFormData) => {
      setServerError(null);
      setIsLoading(true);
      try {
        const { data: authData, error } = await supabase.auth.signInWithPassword({
          email: data.email.trim().toLowerCase(),
          password: data.password,
        });

        if (error) {
          setServerError(
            error.message === 'Invalid login credentials'
              ? 'Incorrect email or password. Try again.'
              : error.message,
          );
          return;
        }

        setSession(authData.session);
      } finally {
        setIsLoading(false);
      }
    },
    [setSession],
  );

  return { form, submit, isLoading, serverError };
}

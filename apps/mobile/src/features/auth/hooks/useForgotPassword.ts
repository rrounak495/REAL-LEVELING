/**
 * src/features/auth/hooks/useForgotPassword.ts
 */
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@lib/supabase';

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
});

export type ForgotPasswordFormData = z.infer<typeof schema>;

export function useForgotPassword() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
  });

  const submit = useCallback(async (data: ForgotPasswordFormData) => {
    setServerError(null);
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email.trim().toLowerCase(), {
        redirectTo: 'realleveling://reset-password',
      });

      if (error) {
        setServerError(error.message);
        return;
      }

      setIsSuccess(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { form, submit, isLoading, serverError, isSuccess };
}

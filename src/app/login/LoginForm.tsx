import { Form, FormButtons, FormField, FormSubmitButton, PasswordField, TextField } from '@umami/react-zen';
import { ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useRouter } from 'next/navigation';
import { useMessages, useUpdateQuery } from '@/components/hooks';
import { Logo } from '@/components/svg';
import { setClientAuthToken } from '@/lib/client';
import { consumeReturnUrl } from '@/lib/return-url';
import { setUser } from '@/store/app';

export function LoginForm() {
  const { t, labels, getErrorMessage } = useMessages();
  const router = useRouter();
  const { mutateAsync, error } = useUpdateQuery('/auth/login');

  const handleSubmit = async (data: any) => {
    await mutateAsync(data, {
      onSuccess: async (response: any) => {
        if (response.requiresTwoFactor) {
          sessionStorage.setItem('umami.partial-token', response.partialToken);
          router.push('/login/two-factor');
          return;
        }
        setClientAuthToken(response.token);
        setUser(response.user);
        router.push(consumeReturnUrl() ?? '/');
      },
    });
  };

  return (
    <div className="tw:flex tw:flex-col tw:gap-6">
      <div className="tw:flex tw:flex-col tw:items-center tw:gap-3 tw:text-center">
        <span className="tw:flex tw:size-12 tw:items-center tw:justify-center tw:rounded-xl tw:bg-primary/10 tw:text-primary tw:ring-1 tw:ring-primary/20">
          <Logo width={26} height={26} />
        </span>
        <div className="tw:flex tw:flex-col tw:gap-1">
          <h1 className="tw:text-xl tw:font-semibold tw:tracking-tight">Welcome back</h1>
          <p className="tw:text-sm tw:text-muted-foreground">Sign in to your analytics</p>
        </div>
      </div>
      <Form
        onSubmit={handleSubmit}
        error={getErrorMessage(error)}
        defaultValues={{ username: '', password: '' }}
        style={{ width: '100%' }}
      >
        <FormField
          label={t(labels.username)}
          data-test="input-username"
          name="username"
          rules={{ required: t(labels.required) }}
        >
          <TextField autoComplete="username" />
        </FormField>

        <FormField
          label={t(labels.password)}
          data-test="input-password"
          name="password"
          rules={{ required: t(labels.required) }}
        >
          <PasswordField autoComplete="current-password" />
        </FormField>
        <FormButtons>
          <FormSubmitButton
            data-test="button-submit"
            variant="primary"
            style={{ flex: 1 }}
            isDisabled={false}
          >
            <span className="tw:inline-flex tw:items-center tw:gap-1.5">
              {t(labels.login)}
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={2} />
            </span>
          </FormSubmitButton>
        </FormButtons>
      </Form>
    </div>
  );
}

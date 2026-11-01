'use client';
import { Loading } from '@umami/react-zen';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { PropsWithChildren, useEffect } from 'react';
import { useLoginQuery } from '@/components/hooks';
import { LoginForm } from './LoginForm';

export function LoginPageWrapper({ children }: PropsWithChildren) {
  const { user, isLoading } = useLoginQuery();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace('/');
    }
  }, [user, router]);

  if (isLoading || user) {
    return <Loading placement="absolute" />;
  }

  return (
    <main className="tw:relative tw:flex tw:min-h-screen tw:items-center tw:justify-center tw:overflow-hidden tw:bg-background tw:px-4">
      <div
        aria-hidden
        className="tw:pointer-events-none tw:absolute tw:-top-40 tw:left-1/2 tw:size-[36rem] tw:-translate-x-1/2 tw:rounded-full tw:bg-primary/20 tw:blur-3xl"
      />
      <div
        aria-hidden
        className="tw:pointer-events-none tw:absolute tw:inset-0 tw:opacity-[0.35] tw:[background-image:radial-gradient(var(--zen-border)_1px,transparent_1px)] tw:[background-size:22px_22px] tw:[mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
      />
      <motion.div
        initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="tw:relative tw:w-full tw:max-w-sm tw:rounded-2xl tw:border tw:border-border tw:bg-card/80 tw:p-7 tw:shadow-xl tw:backdrop-blur-xl"
      >
        {children}
      </motion.div>
    </main>
  );
}

export function LoginPage() {
  return (
    <LoginPageWrapper>
      <LoginForm />
    </LoginPageWrapper>
  );
}

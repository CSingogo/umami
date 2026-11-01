'use client';
/**
 * Drop-in replacement for `@umami/react-zen`.
 *
 * next.config.ts and tsconfig.json alias that package name to this file, and `zen-original` to the
 * real package. Everything is re-exported as-is except the components below, which are swapped for
 * Animate UI versions. Upstream Umami code keeps importing from '@umami/react-zen' unchanged, so
 * merging upstream stays painless.
 */
export * from 'zen-original';
export { Dialog, DialogTrigger, Modal } from '@/components/animate/dialog';
export { useToast } from '@/components/animate/toast';

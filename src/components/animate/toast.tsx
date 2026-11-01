'use client';
import { Toast as ToastPrimitive } from '@animate-ui/react/primitives/base-ui/toast';
import {
  Alert02Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  InformationCircleIcon,
  Loading03Icon,
  MultiplicationSignCircleIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useCallback } from 'react';
import { cn } from '@/lib/cn';

export const toastManager = ToastPrimitive.createToastManager();

const ICONS = {
  success: { icon: CheckmarkCircle02Icon, className: 'tw:text-emerald-500' },
  error: { icon: MultiplicationSignCircleIcon, className: 'tw:text-destructive' },
  warning: { icon: Alert02Icon, className: 'tw:text-amber-500' },
  info: { icon: InformationCircleIcon, className: 'tw:text-primary' },
  loading: { icon: Loading03Icon, className: 'tw:animate-spin' },
} as const;

function ToastList() {
  const { toasts } = ToastPrimitive.useToastManager();

  return toasts.map(item => {
    const kind = ICONS[item.type as keyof typeof ICONS];

    return (
      <ToastPrimitive.Root
        key={item.id}
        toast={item}
        data-slot="toast"
        className={cn(
          'tw:pointer-events-auto tw:absolute tw:right-0 tw:bottom-0 tw:z-[calc(1000-var(--toast-index))] tw:w-full tw:origin-bottom tw:select-none tw:rounded-2xl tw:border tw:border-border tw:bg-popover tw:text-popover-foreground tw:shadow-xl tw:outline-none tw:will-change-transform',
          'tw:[--gap:0.75rem] tw:[--height:var(--toast-frontmost-height,var(--toast-height))] tw:h-(--height)',
          "tw:after:absolute tw:after:top-full tw:after:left-0 tw:after:h-[calc(var(--gap)+1px)] tw:after:w-full tw:after:content-['']",
          'tw:data-expanded:h-(--toast-height) tw:data-limited:opacity-0',
        )}
      >
        <ToastPrimitive.Content className="tw:flex tw:h-full tw:items-center tw:gap-3 tw:overflow-hidden tw:p-4 tw:data-behind:opacity-0 tw:data-expanded:opacity-100">
          {kind && (
            <span className={cn('tw:shrink-0', kind.className)}>
              <HugeiconsIcon icon={kind.icon} size={20} strokeWidth={2} aria-hidden />
            </span>
          )}
          <div className="tw:flex tw:min-w-0 tw:flex-1 tw:flex-col tw:gap-0.5">
            <ToastPrimitive.Title className="tw:text-sm tw:font-medium" />
            <ToastPrimitive.Description className="tw:text-sm tw:text-muted-foreground" />
          </div>
          <ToastPrimitive.Action className="tw:shrink-0 tw:rounded-md tw:border tw:border-border tw:px-2.5 tw:py-1 tw:text-xs tw:font-medium tw:hover:bg-accent" />
          <ToastPrimitive.Close
            aria-label="Close"
            className="tw:relative tw:shrink-0 tw:rounded-md tw:p-1 tw:text-muted-foreground tw:after:absolute tw:after:-inset-2 tw:after:content-[''] tw:hover:bg-accent tw:hover:text-foreground"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={2} aria-hidden />
          </ToastPrimitive.Close>
        </ToastPrimitive.Content>
      </ToastPrimitive.Root>
    );
  });
}

/** Mount once, near the root. Replaces react-zen's toaster. */
export function AnimatedToaster() {
  return (
    <ToastPrimitive.Provider toastManager={toastManager} progressBar>
      <ToastPrimitive.Portal>
        <ToastPrimitive.Viewport className="tw:pointer-events-none tw:fixed tw:inset-x-4 tw:bottom-4 tw:z-[10000] tw:mx-auto tw:w-auto tw:max-w-sm tw:outline-none tw:sm:right-4 tw:sm:left-auto tw:sm:mx-0 tw:sm:w-full">
          <ToastList />
        </ToastPrimitive.Viewport>
      </ToastPrimitive.Portal>
    </ToastPrimitive.Provider>
  );
}

type ToastOptions = {
  duration?: number;
  title?: string;
  actions?: string[];
  allowClose?: boolean;
  variant?: 'success' | 'error';
  onClose?: (action?: string) => void;
};

/** Same signature as react-zen's `useToast`, so existing call sites work unchanged. */
export function useToast() {
  const toast = useCallback((message: string, options: ToastOptions = {}) => {
    const { title, variant = 'success', duration, actions, onClose } = options;
    const [action] = actions ?? [];

    toastManager.add({
      title: title ?? message,
      description: title ? message : undefined,
      type: variant,
      timeout: duration || 4000,
      onClose: () => onClose?.(),
      actionProps: action
        ? { children: action, onClick: () => onClose?.(action) }
        : undefined,
    });
  }, []);

  return { toast, toasts: [] as never[] };
}

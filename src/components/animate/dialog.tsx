'use client';
import { Dialog as DialogPrimitive } from '@animate-ui/react/primitives/base-ui/dialog';
import { Cancel01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Children,
  createContext,
  isValidElement,
  type ComponentProps,
  type ReactElement,
  useContext,
  useState,
} from 'react';
import {
  Dialog as ZenDialog,
  type DialogProps,
  DialogTrigger as ZenDialogTrigger,
  Modal as ZenModal,
  type ModalProps,
} from 'zen-original';
import { cn } from '@/lib/cn';

/**
 * Animated replacements for react-zen's Modal / Dialog / DialogTrigger.
 *
 * They only take over for plain dialogs (`<DialogTrigger><Button/><Modal>…`). Alert dialogs,
 * popovers and anything else fall through to the original zen components, so the props Umami
 * already passes keep working.
 */

type Kind = 'alert-dialog' | 'dialog' | 'popover';

const AnimatedContext = createContext<{ close: () => void } | null>(null);

const ownKind = (node: unknown): Kind | undefined => (node as any)?.type?.zenOverlayType;

function nestedKind(node: unknown, depth = 0): Kind | undefined {
  if (depth > 12) return undefined;
  let found: Kind | undefined;

  for (const child of Children.toArray(node as any)) {
    if (!isValidElement(child)) continue;
    const own = ownKind(child);
    if (own === 'alert-dialog') return own;
    found ??= own ?? nestedKind((child.props as any)?.children, depth + 1);
  }
  return found;
}

function overlayKind(target: unknown): Kind | undefined {
  try {
    const own = ownKind(target);
    if (own === 'alert-dialog') return own;
    const nested = nestedKind((target as any)?.props?.children);
    return nested === 'alert-dialog' ? nested : (own ?? nested);
  } catch {
    return undefined;
  }
}

export function DialogTrigger(props: ComponentProps<typeof ZenDialogTrigger>) {
  const { children, overlayType, isOpen, defaultOpen, onOpenChange } = props;
  const [trigger, target] = Children.toArray(children) as ReactElement<any>[];
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen ?? false);

  const kind = overlayType ?? overlayKind(target) ?? 'dialog';
  const animated = kind === 'dialog' && isValidElement(target) && target.type === Modal;

  if (!animated) return <ZenDialogTrigger {...props} />;

  const targetProps: any = target.props;
  const controlled = isOpen ?? targetProps?.isOpen;
  const open = controlled ?? uncontrolledOpen;
  const setOpen = (next: boolean) => {
    if (controlled === undefined) setUncontrolledOpen(next);
    onOpenChange?.(next);
    targetProps?.onOpenChange?.(next);
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger data-slot="dialog-trigger" render={trigger} />
      <AnimatedContext.Provider value={{ close: () => setOpen(false) }}>
        {target}
      </AnimatedContext.Provider>
    </DialogPrimitive.Root>
  );
}

export function Modal(props: ModalProps) {
  const context = useContext(AnimatedContext);
  if (!context) return <ZenModal {...props} />;

  const {
    placement = 'center',
    children,
    className,
    style,
    showCloseButton = false,
    isOpen: _isOpen,
    defaultOpen: _defaultOpen,
    onOpenChange: _onOpenChange,
    ...rest
  } = props;

  return (
    <DialogPrimitive.Portal {...rest}>
      <DialogPrimitive.Backdrop className="zen-layer-backdrop tw:fixed tw:inset-0 tw:bg-black/50 tw:backdrop-blur-[3px]" />
      <DialogPrimitive.Viewport className="zen-layer-modal tw:fixed tw:inset-0 tw:flex tw:items-center tw:justify-center tw:overflow-y-auto tw:p-4">
        <DialogPrimitive.Popup
          data-slot="modal"
          data-placement={placement}
          from="top"
          className={cn(
            'tw:relative tw:isolate tw:max-w-full tw:outline-none',
            placement === 'fullscreen' && 'tw:size-full',
            className,
          )}
          style={style}
        >
          {children}
          {showCloseButton && <CloseButton />}
        </DialogPrimitive.Popup>
      </DialogPrimitive.Viewport>
    </DialogPrimitive.Portal>
  );
}
Modal.zenOverlayType = 'dialog';

function CloseButton() {
  return (
    <DialogPrimitive.Close
      data-slot="modal-close"
      aria-label="Close"
      className="tw:absolute tw:top-3 tw:right-3 tw:z-10 tw:rounded-md tw:p-1.5 tw:text-muted-foreground tw:transition-colors tw:hover:bg-accent tw:hover:text-foreground"
    >
      <HugeiconsIcon icon={Cancel01Icon} size={18} strokeWidth={2} aria-hidden />
    </DialogPrimitive.Close>
  );
}

export function Dialog(props: DialogProps) {
  const context = useContext(AnimatedContext);
  if (!context) return <ZenDialog {...props} />;

  const { title, description, children, className, ...rest } = props;

  return (
    <div
      {...rest}
      data-slot="dialog"
      className={cn(
        'tw:relative tw:flex tw:max-h-[calc(100dvh-2rem)] tw:flex-col tw:gap-4 tw:overflow-auto tw:rounded-2xl tw:border tw:border-border tw:bg-popover tw:p-6 tw:text-popover-foreground tw:shadow-2xl tw:outline-none',
        className,
      )}
    >
      {(title || description) && (
        <div className="tw:flex tw:flex-col tw:gap-1 tw:pr-6">
          {title && (
            <DialogPrimitive.Title className="tw:text-lg tw:font-semibold tw:leading-tight tw:tracking-tight">
              {title}
            </DialogPrimitive.Title>
          )}
          {description && (
            <DialogPrimitive.Description className="tw:text-sm tw:text-muted-foreground">
              {description}
            </DialogPrimitive.Description>
          )}
        </div>
      )}
      <CloseButton />
      {typeof children === 'function' ? children({ close: context.close }) : children}
    </div>
  );
}

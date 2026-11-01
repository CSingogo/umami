import { Tooltip, TooltipTrigger, useTheme } from '@umami/react-zen';
import {
  BookOpen01Icon,
  Globe02Icon,
  Logout01Icon,
  PaintBoardIcon,
  Settings01Icon,
  Shield01Icon,
  UserCircleIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/animate/dropdown-menu';
import { useConfig, useLocale, useLoginQuery, useMessages } from '@/components/hooks';
import { DOCS_URL } from '@/lib/constants';
import { languages } from '@/lib/lang';

export interface UserButtonProps {
  showText?: boolean;
  onClose?: () => void;
}

const icon = (data: any) => <HugeiconsIcon icon={data} size={18} strokeWidth={1.75} />;

export function UserButton({ showText = true, onClose }: UserButtonProps) {
  const { user } = useLoginQuery();
  const { cloudMode } = useConfig();
  const { t, labels } = useMessages();
  const { locale, saveLocale } = useLocale();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const getUrl = (url: string) => (cloudMode ? `${process.env.cloudUrl}${url}` : url);

  const handleNavigate = (url: string, target?: string) => {
    onClose?.();

    if (target) {
      window.open(url, target);
    } else if (url.startsWith('http')) {
      window.location.href = url;
    } else {
      router.push(url);
    }
  };

  const item = (id: string, label: ReactNode, glyph: any, onClick: () => void) => (
    <DropdownMenuItem key={id} onClick={onClick}>
      {icon(glyph)}
      {label}
    </DropdownMenuItem>
  );

  const menu = (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={showText ? undefined : user.username}
        className="tw:flex tw:min-h-10 tw:w-full tw:items-center tw:gap-2 tw:overflow-hidden tw:whitespace-nowrap tw:rounded-lg tw:px-3 tw:text-left tw:text-sm tw:outline-none tw:transition-colors tw:hover:bg-accent tw:focus-visible:ring-2 tw:focus-visible:ring-ring tw:data-popup-open:bg-accent"
      >
        {icon(UserCircleIcon)}
        {showText && <span className="tw:truncate">{user.username}</span>}
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="start" className="tw:w-56">
        {item('settings', t(labels.settings), Settings01Icon, () =>
          handleNavigate(getUrl('/settings')),
        )}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            {icon(Globe02Icon)}
            {t(labels.language)}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="tw:max-h-72">
            <DropdownMenuRadioGroup
              value={locale}
              onValueChange={(value: string) => {
                saveLocale(value);
                onClose?.();
              }}
            >
              {Object.keys(languages).map(key => (
                <DropdownMenuRadioItem key={key} value={key}>
                  {languages[key].label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            {icon(PaintBoardIcon)}
            {t(labels.theme)}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup
              value={theme}
              onValueChange={(value: string) => {
                setTheme(value as 'light' | 'dark');
                onClose?.();
              }}
            >
              <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        {cloudMode &&
          item('docs', t(labels.documentation), BookOpen01Icon, () =>
            handleNavigate(DOCS_URL, '_blank'),
          )}
        {!cloudMode &&
          user.isAdmin &&
          item('admin', t(labels.admin), Shield01Icon, () => handleNavigate('/admin'))}
        <DropdownMenuSeparator />
        {item('logout', t(labels.logout), Logout01Icon, () => handleNavigate(getUrl('/logout')))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  if (showText) {
    return <div style={{ width: '100%' }}>{menu}</div>;
  }

  return (
    <TooltipTrigger delay={0}>
      <div style={{ width: '100%' }}>{menu}</div>
      <Tooltip placement="right">{user.username}</Tooltip>
    </TooltipTrigger>
  );
}

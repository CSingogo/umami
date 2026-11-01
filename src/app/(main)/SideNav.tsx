import { Highlight, HighlightItem } from '@animate-ui/react/primitives/effects/highlight';
import {
  DashboardSquare01Icon,
  Globe02Icon,
  Grid02Icon,
  Layout01Icon,
  Link01Icon,
  SidebarLeftIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Tooltip, TooltipTrigger } from '@umami/react-zen';
import { motion } from 'motion/react';
import { AdminNav } from '@/app/(main)/admin/AdminNav';
import { SettingsNav } from '@/app/(main)/settings/SettingsNav';
import { WebsiteNav } from '@/app/(main)/websites/[websiteId]/WebsiteNav';
import Link from '@/components/common/Link';
import { OverlayScrollArea } from '@/components/common/OverlayScrollArea';
import styles from '@/components/common/OverlayScrollArea.module.css';
import { useGlobalState, useMessages, useNavigation } from '@/components/hooks';
import { UserButton } from '@/components/input/UserButton';
import { Logo } from '@/components/svg';
import { cn } from '@/lib/cn';

const SPRING = { type: 'spring', stiffness: 320, damping: 32 } as const;

const glyph = (icon: any) => <HugeiconsIcon icon={icon} size={18} strokeWidth={1.75} />;

export function SideNav(props: any) {
  const { t, labels } = useMessages();
  const { pathname, renderUrl, websiteId, teamId } = useNavigation();
  const [isCollapsed] = useGlobalState('sidenav-collapsed', false);

  const links = [
    ...(!teamId
      ? [
          {
            id: 'dashboard',
            label: t(labels.dashboard),
            path: '/dashboard',
            icon: glyph(DashboardSquare01Icon),
          },
        ]
      : []),
    { id: 'boards', label: t(labels.boards), path: '/boards', icon: glyph(Layout01Icon) },
    { id: 'websites', label: t(labels.websites), path: '/websites', icon: glyph(Globe02Icon) },
    { id: 'links', label: t(labels.links), path: '/links', icon: glyph(Link01Icon) },
    { id: 'pixels', label: t(labels.pixels), path: '/pixels', icon: glyph(Grid02Icon) },
  ];

  return (
    <motion.aside
      {...props}
      initial={false}
      animate={{ width: isCollapsed ? 64 : 240 }}
      transition={SPRING}
      className="tw:m-2 tw:flex tw:min-h-0 tw:grow tw:flex-col tw:overflow-hidden tw:rounded-2xl tw:border tw:border-border tw:bg-card tw:p-2"
    >
      <div className={cn('tw:flex tw:min-h-10 tw:shrink-0 tw:items-center', isCollapsed ? 'tw:justify-center' : 'tw:justify-between tw:pl-3')}>
        {!isCollapsed && (
          <span className="tw:flex tw:items-center tw:gap-2 tw:font-semibold tw:tracking-tight">
            <Logo />
            umami
          </span>
        )}
        <PanelButton />
      </div>
      <OverlayScrollArea
        className={isCollapsed ? styles.collapsed : undefined}
        style={{ flexGrow: 1, minHeight: 0 }}
      >
        {websiteId ? (
          <WebsiteNav websiteId={websiteId} isCollapsed={isCollapsed} />
        ) : pathname.includes('/settings') ? (
          <SettingsNav isCollapsed={isCollapsed} />
        ) : pathname.includes('/admin') ? (
          <AdminNav />
        ) : (
          <Highlight
            hover
            transition={SPRING}
            className="tw:rounded-lg tw:bg-accent"
            controlledItems
          >
            <nav className="tw:flex tw:flex-col tw:gap-1">
              {links.map(({ id, path, label, icon }) => {
                const isSelected = pathname.startsWith(renderUrl(path, false));
                const content = (
                  <span
                    className={cn(
                      'tw:relative tw:z-10 tw:flex tw:min-h-9 tw:items-center tw:gap-2.5 tw:rounded-lg tw:px-3 tw:text-sm tw:transition-colors',
                      isCollapsed && 'tw:justify-center tw:px-0',
                      isSelected ? 'tw:bg-accent tw:font-semibold' : 'tw:text-foreground/80',
                    )}
                  >
                    {icon}
                    {!isCollapsed && <span className="tw:truncate">{label}</span>}
                  </span>
                );
                return (
                  <HighlightItem key={id} value={id}>
                    <Link href={renderUrl(path, false)} role="button" className="tw:block">
                      {isCollapsed ? (
                        <TooltipTrigger delay={0}>
                          {content}
                          <Tooltip placement="right">{label}</Tooltip>
                        </TooltipTrigger>
                      ) : (
                        content
                      )}
                    </Link>
                  </HighlightItem>
                );
              })}
            </nav>
          </Highlight>
        )}
      </OverlayScrollArea>
      <div className={cn('tw:flex tw:w-full tw:shrink-0 tw:pt-2', isCollapsed && 'tw:justify-center')}>
        <UserButton showText={!isCollapsed} />
      </div>
    </motion.aside>
  );
}

function PanelButton() {
  const [isCollapsed, setIsCollapsed] = useGlobalState('sidenav-collapsed', false);

  return (
    <button
      type="button"
      aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      onClick={() => setIsCollapsed(!isCollapsed)}
      className="tw:flex tw:size-8 tw:items-center tw:justify-center tw:rounded-lg tw:text-muted-foreground tw:outline-none tw:transition-colors tw:hover:bg-accent tw:hover:text-foreground tw:focus-visible:ring-2 tw:focus-visible:ring-ring"
    >
      <motion.span animate={{ rotate: isCollapsed ? 180 : 0 }} transition={SPRING} className="tw:flex">
        {glyph(SidebarLeftIcon)}
      </motion.span>
    </button>
  );
}

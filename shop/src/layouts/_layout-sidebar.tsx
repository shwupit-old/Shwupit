import { useDrawer } from '@/components/drawer-views/context';
import { CloseIcon } from '@/components/icons/close-icon';
import { DiscoverIcon } from '@/components/icons/discover-icon';
import { SwapIcon } from '@/components/icons/swap-icon';
import { HelpIcon } from '@/components/icons/help-icon';
import { HomeIcon } from '@/components/icons/home-icon';
import { PaperPlaneIcon } from '@/components/icons/paper-plane-icon';
import { ExclamationCircleIcon } from '@/components/icons/exclamation-circle-icon';
import { PeopleIcon } from '@/components/icons/people-icon';
import { ProductIcon } from '@/components/icons/product-icon';
import { SettingIcon } from '@/components/icons/setting-icon';
import ActiveLink from '@/components/ui/links/active-link';
import { ThemeLightIcon } from '@/components/icons/theme-light-icon';
import { ThemeDarkIcon } from '@/components/icons/theme-dark-icon';
import Logo from '@/components/ui/logo';
import Scrollbar from '@/components/ui/scrollbar';
import routes from '@/config/routes';
import Copyright from '@/layouts/_copyright';
import cn from 'classnames';
import ThemeSwitcher from '@/components/ui/theme-switcher';
import { useTranslation } from 'next-i18next';
import { useTheme } from 'next-themes';
import { useWindowSize } from 'react-use';
import { useState, useEffect } from 'react';
import {
  isMultiLangEnable,
  checkIsMaintenanceModeComing,
  checkIsScrollingStart,
  RESPONSIVE_WIDTH,
} from '@/lib/constants';
import { useAtom } from 'jotai';
import { twMerge } from 'tailwind-merge';



interface NavLinkProps {
  href: string;
  title: string;
  icon: React.ReactNode;
  isCollapse?: boolean;
}


function NavLink({ href, icon, title, isCollapse }: NavLinkProps) {
  return (
    <ActiveLink
      href={href}
      className="my-0.5 flex items-center gap-1 px-4 py-3 hover:bg-light-300 hover:dark:bg-dark-300 xs:px-6 sm:my-1 sm:gap-1.5 sm:px-7 lg:gap-2 xl:my-0.5"
      activeClassName="text-dark-100 active-text-dark dark:active-text-light dark:text-light-400 font-medium bg-light-400 dark:bg-dark-400 hover:bg-light-600 hover:dark:bg-dark-500"
    >
      <span
        className={cn(
          'flex flex-shrink-0 items-center justify-start',
          isCollapse ? 'w-8 xl:w-auto' : 'w-auto xl:w-8'
        )}
      >
        {icon}
      </span>
      <span
        className={cn(
          'text-dark-100 dark:text-light-400',
          isCollapse ? 'inline-flex xl:hidden' : 'hidden xl:inline-flex'
        )}
      >
        {title}
      </span>
    </ActiveLink>
  );
}

export function Sidebar({
  isCollapse,
  className = 'hidden sm:flex fixed bottom-0 z-20',
}: {
  isCollapse?: boolean;
  className?: string;
}) {
  const { t } = useTranslation('common');
  const { width } = useWindowSize();
  const [underMaintenanceIsComing] = useAtom(checkIsMaintenanceModeComing);
  const [isScrolling] = useAtom(checkIsScrollingStart);
  const { resolvedTheme, setTheme, systemTheme } = useTheme();
  const [isClient, setIsClient] = useState(false);



  useEffect(() => {
    // Mark that we are now on the client and can access themes safely
    setIsClient(true);
  }, []);

  const isDarkMode = isClient ? resolvedTheme === 'dark' : systemTheme === 'dark';
  const themeSwitchText = isDarkMode ? t('text-theme-light') : t('text-theme-dark');

  
  
const toggleTheme = () => {
  setTheme(isDarkMode ? 'light' : 'dark');
};
return (
  <aside
    className={twMerge(
      cn(
        'h-full flex-col justify-between overflow-y-auto border-r border-light-400 bg-light-100 text-dark-900 dark:border-0 dark:bg-dark-200',
        'pt-4',
        isCollapse ? 'sm:w-60 xl:w-[75px]' : 'sm:w-[75px] xl:w-60',
        width >= RESPONSIVE_WIDTH && underMaintenanceIsComing && !isScrolling
          ? 'md:pt-[9.625rem]'  
          : 'md:pt-20', 
        className
      )
    )}
  >
      <Scrollbar className="relative h-full w-full">
        <div className="flex h-full w-full flex-col">
          <nav className="flex flex-col">
            <NavLink
              title={t('text-home')}
              href={routes.home}
              isCollapse={isCollapse}
              icon={<HomeIcon className="h-[18px] w-[18px] text-current" />}
            /> 
            

            {/* <NavLink
              title={t('text-top-authors')}
              href={routes.authors}
              isCollapse={isCollapse}
              icon={<PeopleIcon className="h-[18px] w-[18px] text-current" />}
            /> */}

            <NavLink
              title={t('text-my-swaps')}
              href={routes.mySwaps}
              isCollapse={isCollapse}
              icon={<SwapIcon className="h-[17px] w-[17px] text-current" />}
            />

            <NavLink
              title={t('text-messages')}
              href={routes.messages}
              isCollapse={isCollapse}
              icon={
                <PaperPlaneIcon className="h-[18px] w-[18px] text-current" />
              }
            />
             <NavLink
              title={t('text-disputes')}
              href={routes.contact}
              isCollapse={isCollapse}
              icon={
                <ExclamationCircleIcon className="h-[18px] w-[18px] text-current" />
              }
            />
      {/* <div
  className="my-0.5 flex items-center gap-1 px-4 py-3 hover:bg-light-300 hover:dark:bg-dark-300 xs:px-6 sm:my-1 sm:gap-1.5 sm:px-7 lg:gap-2 xl:my-0.5 cursor-pointer"
  onClick={toggleTheme}
>
  {isDarkMode ? (
    <ThemeLightIcon className="h-5 w-5" />
  ) : (
    <ThemeDarkIcon className="h-[19px] w-[19px]" />
  )}
  <span
    className={cn(
      'ml-2 text-dark-100 dark:text-light-400',
      isCollapse ? 'inline-flex xl:hidden' : 'hidden xl:inline-flex'
    )}
  >
    {themeSwitchText}
  </span>
</div> */}

          </nav>

          <nav className="mt-auto flex flex-col pb-4">
            <NavLink
              title={t('text-settings')}
              href={routes.profile}
              isCollapse={isCollapse}
              icon={<SettingIcon className="h-[18px] w-[18px] text-current" />}
            />
            <NavLink
              title={t('text-help-page-title')}
              href={routes.help}
              isCollapse={isCollapse}
              icon={<HelpIcon className="h-[18px] w-[18px] text-current" />}
            />
            
          </nav>
        </div>
      </Scrollbar>

      <footer
        className={cn(
          'flex-col border-t border-light-400 pt-3 pb-4 text-center dark:border-dark-400',
          isCollapse ? 'flex xl:hidden' : 'hidden xl:flex'
        )}
      >
        <nav className="flex items-center justify-center gap-5 pb-1.5 text-13px font-medium capitalize tracking-[0.2px]">
          <ActiveLink
            href={routes.terms}
            className="block py-2 text-dark-700 hover:text-dark-100 dark:hover:text-brand"
          >
            {t('text-terms')}
          </ActiveLink>
          <ActiveLink
            href={routes.privacy}
            className="block py-2 text-dark-700 hover:text-dark-100 dark:hover:text-brand"
          >
            {t('text-privacy')}
          </ActiveLink>
          <ActiveLink
            href={routes.help}
            className="block py-2 text-dark-700 hover:text-dark-100 dark:hover:text-brand"
          >
            {t('text-help-page-title')}
          </ActiveLink>
        </nav>
        <Copyright className="px-1 text-xs font-medium text-dark-800/80 dark:text-dark-700" />
      </footer>
    </aside>
  );
}

export default function SidebarDrawerView() {
  const { closeDrawer } = useDrawer();
  const { t } = useTranslation();
  return (
    <>
      <div className="flex h-[70px] items-center justify-between py-2 px-5 xs:px-7">
        <Logo />
        <div className="ml-3 flex h-7 items-center">
          <button
            type="button"
            className="-m-2 p-2 text-dark-900 outline-none transition-all hover:text-dark dark:text-dark-800 hover:dark:text-light-200"
            onClick={closeDrawer}
          >
            <span className="sr-only">{t('text-close-panel')}</span>
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
      <Sidebar isCollapse={true} className="flex text-13px" />
    </>
  );
}

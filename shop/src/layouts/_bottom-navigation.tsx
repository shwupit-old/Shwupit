import { useRouter } from 'next/router';
import routes from '@/config/routes';
import Button from '@/components/ui/button';
import SearchButton from '@/components/search/search-button';
import CartButton from '@/components/cart/cart-button';
import Hamburger from '@/components/ui/hamburger';
import { HomeIcon } from '@/components/icons/home-icon';
import { PaperPlaneIcon } from '@/components/icons/paper-plane-icon';
import { useDrawer } from '@/components/drawer-views/context';
import ChatIcon from '@/components/icons/chat-icon';

export default function BottomNavigation() {
  const router = useRouter();
  const { openDrawer } = useDrawer();
  return (
    <nav className="sticky bottom-0 z-30 grid h-14 w-full auto-cols-fr grid-flow-col items-center bg-light py-2 text-center shadow-bottom-nav dark:bg-dark-250 sm:hidden">
      <Button
        variant="icon"
        aria-label="Home"
        onClick={() => router.push(routes.home)}
      >
        <HomeIcon className="h-5 w-5" />
      </Button>
      <Button
        variant="icon"
        aria-label="Messages"
        onClick={() => router.push(routes.messages)}
      >
        <ChatIcon className="h-5 w-5" />
      </Button>
      <SearchButton />
   
      <Hamburger onClick={() => openDrawer('MOBILE_MENU')} />
    </nav>
  );
}
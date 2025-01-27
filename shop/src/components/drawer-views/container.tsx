import { Fragment, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Dialog } from '@/components/ui/dialog';
import { Transition } from '@/components/ui/transition';
import { DRAWER_VIEW, useDrawer } from '@/components/drawer-views/context';
const CartDrawerView = dynamic(
  () => import('@/components/cart/cart-drawer-view')
);
const SidebarDrawerView = dynamic(() => import('@/layouts/_layout-sidebar'));
const MaintenanceMoreInfo = dynamic(
  () => import('@/components/maintenance/more-info')
);

function renderDrawerContent(view: DRAWER_VIEW | string) {
  switch (view) {
    case 'MOBILE_MENU':
      return <SidebarDrawerView />;
    case 'MAINTENANCE_MORE_INFO':
      return <MaintenanceMoreInfo />;
    default:
      return <CartDrawerView />;
  }
}

export default function DrawersContainer() {
  const router = useRouter();
  const { view, isOpen, closeDrawer } = useDrawer();
  useEffect(() => {
    // close search modal when route change
    router.events.on('routeChangeStart', closeDrawer);
    return () => {
      router.events.off('routeChangeStart', closeDrawer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-[51] overflow-hidden"
        onClose={closeDrawer}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 cursor-pointer bg-dark bg-opacity-60 backdrop-blur transition-opacity dark:bg-opacity-80" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="transform transition ease-in-out duration-300"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="transform transition ease-in-out duration-300"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
        >
          <div className="fixed inset-y-0 right-0 flex max-w-full">
            <div
              className={
                ['MAINTENANCE_MORE_INFO']?.includes(view)
                  ? 'max-w-sm md:max-w-3xl lg:max-w-5xl xl:max-w-7xl' // even wider on medium, large, and extra-large screens
                  : 'w-screen max-w-md md:max-w-xl lg:max-w-3xl' // adjust this line to increase width on tablet and desktop screens
              }
            >
              <div className="flex h-full flex-col bg-light shadow-xl dark:bg-dark-300">
                {view && renderDrawerContent(view)}
              </div>
            </div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}

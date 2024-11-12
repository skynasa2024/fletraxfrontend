/* eslint-disable react-hooks/exhaustive-deps */
import { Drawer } from '@/components';
import { useEffect } from 'react';
import { useResponsive } from '@/hooks';
import { SidebarPrimary, SidebarSecondary } from './';
import { usePathname } from '@/providers';
import { useDemo4Layout } from '../';

const Sidebar = () => {
  const desktopMode = useResponsive('up', 'lg');
  const mobileMode = useResponsive('down', 'lg');
  const { pathname, prevPathname } = usePathname();
  const { mobileSidebarOpen, setMobileSidebarOpen } = useDemo4Layout();

  const handleMobileSidebarClose = () => {
    setMobileSidebarOpen(false);
  };

  const renderContent = () => {
    return (
      <div className="fixed top-0 bottom-0 z-20 lg:flex items-stretch shrink-0 w-[--tw-sidebar-width] bg-[--tw-page-bg] dark:bg-[--tw-page-bg-dark]">
        <SidebarPrimary />
        <SidebarSecondary />
      </div>
    );
  };

  useEffect(() => {
    // Hide drawer on route chnage after menu link click
    if (mobileMode && prevPathname !== pathname) {
      handleMobileSidebarClose();
    }
  }, [mobileMode, pathname, prevPathname]);

  if (desktopMode) {
    return renderContent();
  } else {
    return (
      <Drawer
        open={mobileSidebarOpen}
        onClose={handleMobileSidebarClose}
        ModalProps={{
          keepMounted: true
        }}
      >
        {renderContent()}
      </Drawer>
    );
  }
};

export { Sidebar };

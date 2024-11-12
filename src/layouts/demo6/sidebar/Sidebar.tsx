/* eslint-disable react-hooks/exhaustive-deps */
import { Drawer } from '@/components';
import { useEffect, useRef, useState } from 'react';
import { useResponsive, useViewport } from '@/hooks';
import { useDemo6Layout } from '../';
import { SidebarHeader, SidebarMenu, SidebarFooter } from './';
import { getHeight } from '@/utils';
import { usePathname } from '@/providers';

const Sidebar = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const desktopMode = useResponsive('up', 'lg');
  const { pathname, prevPathname } = usePathname();
  const [viewportHeight] = useViewport();
  const { mobileSidebarOpen, setMobileSidebarOpen } = useDemo6Layout();
  const [scrollableHeight, setScrollableHeight] = useState<number>(0);
  const scrollableOffset = 50;

  const handleMobileSidebarClose = () => {
    setMobileSidebarOpen(false);
  };

  const renderContent = () => {
    return (
      <div className="fixed top-0 bottom-0 z-20 lg:flex flex-col shrink-0 w-[--tw-sidebar-width] bg-[--tw-page-bg] dark:bg-[--tw-page-bg-dark]">
        <SidebarHeader ref={headerRef} />
        <SidebarMenu height={scrollableHeight} />
        <SidebarFooter ref={footerRef} />
      </div>
    );
  };

  useEffect(() => {
    if (headerRef.current && footerRef.current) {
      const headerHeight = getHeight(headerRef.current);
      const footerHeight = getHeight(footerRef.current);
      const availableHeight = viewportHeight - headerHeight - footerHeight - scrollableOffset;
      setScrollableHeight(availableHeight);
    } else {
      setScrollableHeight(viewportHeight);
    }
  }, [viewportHeight]);

  useEffect(() => {
    if (!desktopMode && prevPathname !== pathname) {
      handleMobileSidebarClose();
    }
  }, [desktopMode, pathname, prevPathname]);

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

import { Fragment, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Outlet, useLocation } from 'react-router';
import { useMenuCurrentItem } from '@/components/menu';
import { Footer, Header, Sidebar, useDemo1Layout } from '../';
import { useMenus } from '@/providers';
import { useIntl } from 'react-intl';

const Main = () => {
  const intl = useIntl();
  const { layout } = useDemo1Layout();
  const { pathname } = useLocation();
  const { getMenuConfig } = useMenus();
  const menuConfig = getMenuConfig('primary');
  const menuItem = useMenuCurrentItem(pathname, menuConfig);

  useEffect(() => {
    const bodyClass = document.body.classList;

    // Add a class to the body element
    bodyClass.add('demo1');

    if (layout.options.sidebar.fixed) bodyClass.add('sidebar-fixed');
    if (layout.options.sidebar.collapse) bodyClass.add('sidebar-collapse');
    if (layout.options.header.fixed) bodyClass.add('header-fixed');

    // Remove the class when the component is unmounted
    return () => {
      bodyClass.remove('demo1');
      bodyClass.remove('sidebar-fixed');
      bodyClass.remove('sidebar-collapse');
      bodyClass.remove('header-fixed');
    };
  }, [layout]);

  useEffect(() => {
    const timer = setTimeout(() => {
      document.body.classList.add('layout-initialized');
    }, 1000); // 1000 milliseconds

    // Remove the class when the component is unmounted
    return () => {
      document.body.classList.remove('layout-initialized');
      clearTimeout(timer);
    };
  }, []);

  return (
    <Fragment>
      <Helmet>
        <title>
          {menuItem?.title
            ? `${intl.formatMessage({ id: menuItem.title })} | ${intl.formatMessage({ id: 'APP.DEFAULT_TITLE' })}`
            : intl.formatMessage({ id: 'APP.DEFAULT_TITLE' })}
        </title>
      </Helmet>

      <Sidebar />

      {menuItem?.fullScreen ? (
        <main className="grow content wrapper !py-0" role="content">
          <Header floating={true} />
          <Outlet />
        </main>
      ) : (
        <div className="wrapper flex grow flex-col">
          <Header />

          <main className="grow content pt-5" role="content">
            <Outlet />
          </main>

          <Footer />
        </div>
      )}
    </Fragment>
  );
};

export { Main };

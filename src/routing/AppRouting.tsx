import { ReactElement, useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { useAuthContext } from '@/auth';
import { useLoaders } from '@/providers';
import { AppRoutingSetup } from '.';

const AppRouting = (): ReactElement => {
  const { setProgressBarLoader } = useLoaders();
  const { verify } = useAuthContext();
  const [previousLocation, setPreviousLocation] = useState('');
  const location = useLocation();
  const path = location.pathname.trim();

  const init = async () => {
    try {
      if (verify) {
        await verify();
      }
    } catch {
      throw new Error('Something went wrong!');
    }
  };

  const initLocation = async () => {
    setProgressBarLoader(true);

    setPreviousLocation(path);

    if (path === previousLocation) {
      setPreviousLocation('');
    }
  };

  useEffect(() => {
    initLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setProgressBarLoader(false);

    // Scroll to page top on route change if URL does not contain a hash
    if (!CSS.escape(window.location.hash)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previousLocation]);

  return <AppRoutingSetup />;
};

export { AppRouting };

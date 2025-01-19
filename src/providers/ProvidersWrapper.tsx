import { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import { AuthProvider } from '@/auth/providers/JWTProvider';
import {
  LayoutProvider,
  LoadersProvider,
  MenusProvider,
  SettingsProvider,
  SnackbarProvider,
  TranslationProvider
} from '@/providers';
import { HelmetProvider } from 'react-helmet-async';
import { MqttProvider } from './MqttProvider';

const queryClient = new QueryClient();

const ProvidersWrapper = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider>
        <AuthProvider>
          <SettingsProvider>
            <TranslationProvider>
              <HelmetProvider>
                <LayoutProvider>
                  <LoadersProvider>
                    <MqttProvider>
                      <MenusProvider>{children}</MenusProvider>
                    </MqttProvider>
                  </LoadersProvider>
                </LayoutProvider>
              </HelmetProvider>
            </TranslationProvider>
          </SettingsProvider>
        </AuthProvider>
      </SnackbarProvider>
    </QueryClientProvider>
  );
};

export { ProvidersWrapper };

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
import { DeviceProvider } from './DeviceProvider';

const queryClient = new QueryClient();

const ProvidersWrapper = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SettingsProvider>
          <TranslationProvider>
            <SnackbarProvider>
              <HelmetProvider>
                <LayoutProvider>
                  <LoadersProvider>
                    <DeviceProvider>
                      <MqttProvider>
                        <MenusProvider>{children}</MenusProvider>
                      </MqttProvider>
                    </DeviceProvider>
                  </LoadersProvider>
                </LayoutProvider>
              </HelmetProvider>
            </SnackbarProvider>
          </TranslationProvider>
        </SettingsProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export { ProvidersWrapper };

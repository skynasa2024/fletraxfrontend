import { createContext, useContext, ReactNode, useState } from 'react';

interface LayerContextProps {
  layerUrl: string;
  attribution: string;
  layer: 'normal' | 'satellite';
  // eslint-disable-next-line no-unused-vars
  setLayer: (layer: 'normal' | 'satellite') => void;
}

const layerInfo = {
  normal: {
    layerUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    layer: 'normal'
  },
  satellite: {
    layerUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    layer: 'satellite'
  }
};

const LayerContext = createContext<LayerContextProps>({
  layerUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  layer: 'normal',
  setLayer: () => {}
});

export const LayerProvider = ({ children }: { children: ReactNode }) => {
  const [layer, setLayer] = useState<LayerContextProps['layer']>('normal');

  return (
    <LayerContext.Provider
      value={{
        ...layerInfo[layer],
        layer,
        setLayer
      }}
    >
      {children}
    </LayerContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLayer = () => useContext(LayerContext);

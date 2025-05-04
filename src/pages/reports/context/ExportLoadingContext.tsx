import React, { createContext, useContext, useState } from 'react';

interface ExportLoadingContextType {
  isExporting: boolean;
  setIsExporting: (isExporting: boolean) => void;
  exportingReportId: string | null;
  startExporting: (reportId: string) => void;
  stopExporting: () => void;
}

const ExportLoadingContext = createContext<ExportLoadingContextType | undefined>(undefined);

export const ExportLoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportingReportId, setExportingReportId] = useState<string | null>(null);

  const startExporting = (reportId: string) => {
    setIsExporting(true);
    setExportingReportId(reportId);
  };

  const stopExporting = () => {
    setIsExporting(false);
    setExportingReportId(null);
  };

  return (
    <ExportLoadingContext.Provider
      value={{
        isExporting,
        setIsExporting,
        exportingReportId,
        startExporting,
        stopExporting
      }}
    >
      {children}
    </ExportLoadingContext.Provider>
  );
};

export const useExportLoading = (): ExportLoadingContextType => {
  const context = useContext(ExportLoadingContext);
  if (context === undefined) {
    throw new Error('useExportLoading must be used within an ExportLoadingProvider');
  }
  return context;
};

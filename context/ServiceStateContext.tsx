import React, { createContext, useState, useContext, useEffect, FunctionComponent } from 'react';
import { useLocalStorage } from 'utils/useLocalStorage';

interface ServiceStateData {
  serviceType: string | null;
  setServiceType: React.Dispatch<React.SetStateAction<string | null>>;
  charging: boolean | null;
  setCharging: React.Dispatch<React.SetStateAction<boolean | null>>;
}

interface ServiceStateProviderProps {
  children: React.ReactNode;
}

const ServiceStateContext = createContext<ServiceStateData | undefined>(undefined);

export const ServiceStateProvider: FunctionComponent<ServiceStateProviderProps> = ({ children }) => {
  const [storedServiceType, setStoredServiceType] = useLocalStorage<string>('service_type', 'PARKING');
  const [storedCharging, setStoredCharging] = useLocalStorage<string>('charging', 'false');
  
  const [serviceType, setServiceType] = useState<string | null>(null);
  const [charging, setCharging] = useState<boolean | null>(null);

  useEffect(() => {
    if (storedServiceType !== null) {
      setServiceType(storedServiceType);
    }
    if (storedCharging !== null) {
      setCharging(storedCharging === 'true');
    }
  }, [storedServiceType, storedCharging]);

  useEffect(() => {
    if (serviceType !== null && serviceType !== storedServiceType) {
      setStoredServiceType(serviceType);
    }
    if (charging !== null && (charging ? 'true' : 'false') !== storedCharging) {
      setStoredCharging(charging ? 'true' : 'false');
    }
  }, [serviceType, charging]);

  return (
    <ServiceStateContext.Provider value={{ serviceType, setServiceType, charging, setCharging }}>
      {children}
    </ServiceStateContext.Provider>
  );
};

export const useServiceState = (): ServiceStateData => {
  const context = useContext(ServiceStateContext);
  if (context === undefined) {
    throw new Error('useServiceState must be used within a ServiceStateProvider');
  }
  return context;
};
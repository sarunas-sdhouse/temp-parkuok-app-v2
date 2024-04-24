import React, { createContext, useState, useContext, useEffect, FunctionComponent } from 'react';
import { useLocalStorage } from 'utils/useLocalStorage';
import ChargingLots from 'services/chargingLots';

interface InbalanceContextProps {
  accessToken: string | null;
  setAccessToken: React.Dispatch<React.SetStateAction<string | null>>;
  sessionId: string | null;
  setSessionId: React.Dispatch<React.SetStateAction<string | null>>;
}

interface InbalanceProviderProps {
  children: React.ReactNode;
}

const InbalanceContext = createContext<InbalanceContextProps | undefined>(undefined);

export const InbalanceProvider: FunctionComponent<InbalanceProviderProps> = ({ children }) => {
  const [storedSessionId, setStoredSessionId] = useLocalStorage<string>('session_id', '');
  
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(storedSessionId);

  const fetchAccessToken = async () => {
    try {
      const response = await ChargingLots.getAccessToken();
      setAccessToken(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAccessToken();
  }, []);

  useEffect(() => {
    if (sessionId !== null && sessionId !== storedSessionId) {
      setStoredSessionId(sessionId);
    }
  }, [sessionId]);

  useEffect(() => {
    setSessionId(storedSessionId);
  }, [storedSessionId]);

  return (
    <InbalanceContext.Provider value={{ accessToken, setAccessToken, sessionId, setSessionId }}>
      {children}
    </InbalanceContext.Provider>
  );
};

export const useInbalance = (): InbalanceContextProps => {
  const context = useContext(InbalanceContext);
  if (context === undefined) {
    throw new Error('useInbalance must be used within a InbalanceProvider');
  }
  return context;
};
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Keyboard } from 'react-native';

const KeyboardVisibleContext = createContext(false);

interface KeyboardVisibleProviderProps {
  children: ReactNode;
}

export const KeyboardVisibleProvider: React.FC<KeyboardVisibleProviderProps> = ({ children }) => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true)
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <KeyboardVisibleContext.Provider value={isKeyboardVisible}>
      {children}
    </KeyboardVisibleContext.Provider>
  );
};

export default KeyboardVisibleContext;
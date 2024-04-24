import { MD3LightTheme, useTheme } from 'react-native-paper';

export interface IStyles {
  colors: {
    primary: string;
    secondary: string;
    sidebarDark: string;
    warning: string;
    success: string;
    info: string;
    background: string;
    text: string;
    black: string;
    white: string;
    grey: string;
    darkGrey: string;
    activeMenuItem: string;
    mediumGreen: string;
    mediumRed: string,
    lightGreen: string;
  },
  text?: {
    regular: {
      color: string;
      fontSize: number;
      fontFamily: string;
    },
    montseratRegular: {
      color: string;
      fontSize: number;
      fontFamily: string;
    },
    interExtraLight: {
      color: string;
      fontSize: number;
      fontFamily: string;
    },
    interLight: {
      color: string;
      fontSize: number;
      fontFamily: string;
    },
    interRegular: {
      color: string;
      fontSize: number;
      fontFamily: string;
    },
    regularBold: {
      color: string;
      fontSize: number;
      fontFamily: string;
    },
    interBold: {
      color: string;
      fontSize: number;
      fontFamily: string;
    },
    regularSemiBold: {
      fontSize: number;
      fontFamily: string;
    },
    header: {
      color: string;
      fontSize: number;
      fontFamily: string;
      textAlign: string;
    },
    title: {
      color: string;
      fontSize: number;
      fontFamily: string;
    },
    titleInformation: {
      color: string;
      fontSize: number;
      fontFamily: string;
    },
    subtitle: {
      color: string;
      fontSize: number;
      fontFamily: string;
    }
  }
}

type FontWeight =
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900'
  | 'bold'
  | 'normal';
  
type TextAlign = 'center' | 'auto' | 'left' | 'right' | 'justify';

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#28A745',
    secondary: '#00A858',
    sidebarDark: '#353535',
    warning: '#FFDD31',
    success: '#49C96D',
    info: '#0288d1',
    danger: '#EC696A',
    background: '#F5F5F5',
    text: '#3F434A',
    black: '#000',
    white: '#FFFFFF',
    grey: "#B3B3B3",
    darkGrey: "#7F7F7F",
    activeMenuItem: '#daf6e5',
    mediumGreen: "#D9F1CD",
    mediumRed: "#F1CDD9",
    lightGreen: "#EEF8F0",
    placeholder: "#B3B3B3",
  },
  text: {
    regular: {
      color: '#000',
      fontSize: 16,
      fontFamily: 'MontserratMedium',
    },
    montseratRegular: {
      color: '#000',
      fontSize: 16,
      fontFamily: 'MontserratRegular',
    },
    interLight: {
      color: '#000',
      fontSize: 14,
      fontFamily: 'InterLight',
    },
    interExtraLight: {
      color: '#000',
      fontSize: 14,
      fontFamily: 'InterExtraLight',
    },
    interRegular: {
      color: '#86878B',
      fontSize: 14,
      fontFamily: 'InterRegular',
    },
    regularBold: {
      color: '#FFFFFF',
      fontSize: 18,
      fontFamily: 'MontserratBold',
    },
    regularSemiBold: {
      fontSize: 16,
      fontFamily: 'InterSemiBold',
    },
    interBold: {
      color: '#000',
      fontSize: 16,
      fontFamily: 'InterBold',
    },
    header: {
      color: '#000',
      fontSize: 20,
      fontFamily: 'MontserratSemiBold',
      textAlign: 'center' as TextAlign,
    },
    title: {
      color: '#000',
      fontSize: 18,
      fontFamily: 'InterMedium',
    },
    titleInformation: {
      color: '#7A7C87',
      fontSize: 16,
      fontFamily: 'InterMedium',
    },
    subtitle: {
      color: '#000',
      fontSize: 12,
      fontFamily: 'MontserratExtraLight',
    }
  },
};

export type AppTheme = typeof theme;
export const useAppTheme = () => useTheme<AppTheme>();

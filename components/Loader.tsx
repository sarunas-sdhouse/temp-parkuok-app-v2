import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { IStyles, useAppTheme } from 'theme/theme';

interface ILoader {
  loadingText?: string;
  positioned?: boolean;
  size?: 'small' | 'large';
}

const Loader = ({ loadingText, positioned = false, size = "large" }: ILoader) => {
  const { text, colors } = useAppTheme();
  const styles = createStyles({positioned, text, colors});

  return (
    <View style={styles.container}>
      <ActivityIndicator animating={true} size={size} color={'#28A745'} />
      {loadingText && <Text style={styles.text}>{loadingText}</Text>}
    </View>
  );
};

export default Loader;

interface IExtendedStyles extends IStyles {
  positioned: boolean;
}

const createStyles = ({ positioned, text, colors }: IExtendedStyles) => {
  return StyleSheet.create({
    container: {
      position: positioned ? 'relative' : 'absolute',
      right: 0,
      ...(positioned ? {} : { width: '100%', height: '100%' }),
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: positioned ? 32 : 0,
      zIndex: 10,
    },
    text: {
      ...text?.interRegular
    }
  });
};

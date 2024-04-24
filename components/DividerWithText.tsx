import React from 'react';
import { View, Text } from 'react-native';
import { Divider } from 'react-native-paper';
import { useAppTheme } from 'theme/theme';

const DividerWithText = ({ text }: { text: string }) => {
  const { colors, text: textStyle } = useAppTheme();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
      <Divider style={{ flex: 1 }} />
      <Text style={{ ...textStyle.montseratRegular, marginHorizontal: 10, color: colors.grey }}>{text.toUpperCase()}</Text>
      <Divider style={{ flex: 1 }} />
    </View>
  );
};

export default DividerWithText
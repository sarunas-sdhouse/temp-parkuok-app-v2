import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme, IStyles } from 'theme/theme';
import { IconButton, Tooltip } from 'react-native-paper';

interface DataItem {
  title: string;
  value: string | number;
  tooltip?: string;
}

interface DataListProps {
  data: DataItem[];
}

const DataList: React.FC<DataListProps> = ({ data }) => {
  const { colors, text } = useAppTheme();
  const styles = createStyles({ colors, text });

  return (
    <View style={styles.container}>
      {data.map((item, index) => (
        <View key={index} style={styles.row}>
          <View style={styles.title__container}>
            <Text style={styles.title}>{item.title}</Text>
            {item.tooltip && (
              <View style={styles.iconContainer}>
                <Tooltip title={item.tooltip} enterTouchDelay={0}>
                  <IconButton
                    icon="information-outline"
                    selected
                    size={24}
                  />
                </Tooltip>
              </View>
            )}
          </View>
          <Text style={styles.value}>{item.value}</Text>
          <View style={styles.divider} />
        </View>
      ))}
    </View>
  );
};

const createStyles = ({ colors, text }: IStyles) => {
  return StyleSheet.create({
    container: {
      // flex: 1,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
    },
    title: {
      ...text?.interLight,
      color: colors.darkGrey,
    },
    title__container: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconContainer: {
      margin: -18,
      marginLeft: -5,
    },
    value: {
      ...text?.title,
      fontSize: 14,
    },
    divider: {
      height: 1,
      backgroundColor: colors.primary,
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: -3,
    },
  });
};

export default DataList;

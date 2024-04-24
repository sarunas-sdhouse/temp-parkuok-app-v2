import { Text, View, StyleSheet } from 'react-native';
import { useAppTheme, IStyles } from 'theme/theme';

type ProgressWidgetType = {
  style?: any;
  data: Array<{
    title: string;
    subtitle: string;
    icon: React.ReactNode;
  }>;
};

const ProgressWidget = (props: ProgressWidgetType) => {
  const { colors, text } = useAppTheme();
  const styles = createStyles({ colors, text });

  return (
    <View style={{ ...props.style, ...styles.container }}>
      {props.data.map((item, index) => (
        <View key={index}>
          <View style={styles.item}>
            <View style={styles.icon}>
              {item.icon}
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
            </View>
          </View>
          {index !== props.data.length - 1 && <View style={styles.divider} />}
        </View>
      ))}
    </View>
  );
};

export default ProgressWidget;

const createStyles = ({ colors, text }: IStyles) => {
  return StyleSheet.create({
    container: {
      borderWidth: 1,
      borderColor: colors.primary,
      borderStyle: 'solid',
      paddingVertical: 24,
      paddingHorizontal: 24,
      borderRadius: 15,
    },
    item: {
      flexDirection: 'row',
    },
    icon: {
      marginRight: 24,
    },
    title: {
      ...text?.regularSemiBold,
      fontSize: 18,
    },
    subtitle: {
      ...text?.subtitle,
    },
    divider: {
      height: 1,
      backgroundColor: colors.primary,
      marginVertical: 12,
    },
    textContainer: {
      flexShrink: 1,
    },
  });
};
import { View, StyleSheet } from 'react-native';
import MainLayout from 'components/layouts/MainLayout';
import Button from 'components/Button';
import { useAppTheme } from 'theme/theme';

interface IPromptProps {
  image: React.ReactNode;
  title: string;
  subtitle?: React.ReactNode;
  firstBtnText?: string;
  firstBtnAction?: () => void;
  secondBtnText?: string;
  secondBtnAction?: () => void;
  isLoading?: boolean;
  style?: any;
}

const Prompt = ({
  image,
  title,
  subtitle,
  firstBtnText,
  firstBtnAction,
  secondBtnText,
  secondBtnAction,
  isLoading,
  style
}: IPromptProps) => {
  const { colors } = useAppTheme();

  return (
    <MainLayout style={style} image={image} title={title} subtitle={subtitle}>
      <View style={styles.container}>
        {secondBtnAction && secondBtnText && (
          <View style={[styles.buttonContainer, styles.secondButton]}>
            <Button
              mode="outlined"
              outlineColor={colors.danger}
              textColor={colors.danger}
              title={secondBtnText}
              onPress={secondBtnAction}
              disabled={isLoading}
            />
          </View>
        )}
        {firstBtnAction && firstBtnText && (<View style={styles.buttonContainer}>
          <Button title={firstBtnText} onPress={firstBtnAction} disabled={isLoading} />
        </View>
        )}
      </View>
    </MainLayout>
  );
};

export default Prompt;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 30,
    justifyContent: 'space-between',
  },
  buttonContainer: {
    flex: 1,
    marginTop: 40,
  },
  secondButton: {
    marginRight: 10,
  },
});

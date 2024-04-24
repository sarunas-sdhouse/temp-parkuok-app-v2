import { View, StyleSheet } from 'react-native';
import { Text, Modal, Portal, Divider, Icon } from 'react-native-paper';
import { useAppTheme, IStyles } from 'theme/theme';

interface ModalComponentProps {
  title: string;
  visible: boolean;
  onDismiss: () => void;
  children: React.ReactNode;
}

const ModalComponent = ({ title, visible, onDismiss, children }: ModalComponentProps) => {
  const { colors, text } = useAppTheme();
  const styles = createStyles({ colors, text });

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        theme={{
          colors: {
            backdrop: 'rgba(0, 0, 0, 0.5)',
          },
        }}
      >
        <View style={styles.container}>
          <Text style={{ ...text?.header, ...styles.title }}>{title}</Text>
          {children}
        </View>
      </Modal>
    </Portal>
  );
};

export default ModalComponent;

const createStyles = ({ colors, text }: IStyles) => {
  return StyleSheet.create({
    container: {
      position: 'absolute',
      left: 32,
      right: 32,
      backgroundColor: colors.white,
      borderRadius: 15,
      paddingVertical: 32,
      paddingHorizontal: 16,
    },
    title: {
      marginBottom: 32,
    },
  });
};

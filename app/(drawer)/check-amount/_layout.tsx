import { View, StyleSheet } from 'react-native';
import { Stack, usePathname } from 'expo-router';
import Header from 'components/Header';
import { UserRoutes } from 'common/constants/routes';
import { useServiceState } from 'context/ServiceStateContext';

export default function indexLayout() {
  const { serviceType } = useServiceState();
  const pathname = usePathname();
  const isNestedRoute = pathname.split('/').length > 2;

  return (
    <View style={styles.container}>
      <Stack
        screenOptions={{
          header: () => (
            <Header
              back={isNestedRoute}
              backLink={
                serviceType === 'CHARGING' ? UserRoutes.HOME : UserRoutes.CHECK_AMOUNT
              }
            />
          ),
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: '#fff' },
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

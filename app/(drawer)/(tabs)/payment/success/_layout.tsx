import { View, StyleSheet } from 'react-native';
import { Stack } from "expo-router";
import Header from "components/Header";

export default function indexLayout() {
  
  return (
    <View style={styles.container}>
      <Stack
        screenOptions={{
          header: () => <Header back={false}/>,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: '#fff'}
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
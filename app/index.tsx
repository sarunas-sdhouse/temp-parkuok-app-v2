import { Text, View } from 'react-native'
import { Redirect } from 'expo-router';
import { useServiceState } from 'context/ServiceStateContext';

const Index = () => {
  const { charging } = useServiceState();
  return <Redirect href={`${charging ? '(drawer)/start-charging' : '(drawer)/services'}/`} />;
}

export default Index
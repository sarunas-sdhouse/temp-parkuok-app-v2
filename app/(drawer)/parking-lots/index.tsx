import { useState } from 'react';
import { useWindowDimensions, Text, View } from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from 'theme/theme';
import ListTab from 'components/parkingLots/ListTab';
import MapTab from 'components/parkingLots/MapTab';
import { useServiceState } from 'context/ServiceStateContext';
import { Platform } from 'react-native';

interface ITabStyles {
  backgroundColor: string;
}

const renderTabBar = (props: any, { backgroundColor }: ITabStyles) => {
  const { colors, text } = useAppTheme();
  return (
    <View
      style={{
        borderRadius: 15,
        marginHorizontal: 30,
        ...Platform.select({
          ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
          },
          android: {
            elevation: 5,
          },
        }),
      }}
    >
      <TabBar
        {...props}
        indicatorStyle={{ backgroundColor: colors.primary, height: '100%' }}
        style={{
          backgroundColor: colors.white,
          borderRadius: 15,
          overflow: 'hidden',
        }}
        renderLabel={({ route, focused, color }) => (
          <View style={{ flex: 1, }}>
            <Text
              style={{
                ...text.montseratRegular,
                padding: 8,
                fontFamily: 'MontserratBold',
                color: focused ? colors.white : colors.black,
              }}
            >
              {route.title}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const renderScene = SceneMap({
  list: ListTab,
  map: MapTab,
});

const ParkingLotsPage = () => {
  const { serviceType } = useServiceState();
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);

  const routes = [
    { key: 'list', title: t('labels.list') },
    { key: 'map', title: t('labels.map') },
  ];

  if (serviceType === 'CHARGING') return <MapTab />;

  return (
    <TabView
      renderTabBar={props => renderTabBar(props, { backgroundColor: colors.primary })}
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      sceneContainerStyle={{ width: '100%' }}
    />
  );
};

export default ParkingLotsPage;

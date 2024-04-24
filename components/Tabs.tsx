import { useEffect, useState } from 'react';
import { useWindowDimensions, Text, View } from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from 'theme/theme';
import { Platform } from 'react-native';

const renderTabBar = (props: any) => {
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

interface ITabsProps {
  firstTab: any;
  secondTab: any;
  firstTabLabel: string;
  secondTabLabel: string;
  idx?: number;
}

const Tabs = ({
  firstTab,
  secondTab,
  firstTabLabel,
  secondTabLabel,
  idx = 0,
}: ITabsProps) => {
  const renderScene = SceneMap({
    first: firstTab,
    second: secondTab,
  });

  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const layout = useWindowDimensions();

  const [index, setIndex] = useState(idx);

  useEffect(() => {
    setIndex(idx);
  }, [idx]);

  const routes = [
    { key: 'first', title: firstTabLabel },
    { key: 'second', title: secondTabLabel },
  ];

  return (
    <TabView
      renderTabBar={props => renderTabBar(props)}
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      // style={{ paddingHorizontal: 30 }}
      sceneContainerStyle={{ width: '100%' }}
    />
  );
};

export default Tabs;

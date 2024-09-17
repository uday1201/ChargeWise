import React, {forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef} from 'react';
import {useState} from 'react';
import {
  View,
  StyleProp,
  ViewStyle,
  TouchableWithoutFeedback,
  TextStyle,
  FlatList,
  Text,
} from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import StyleGuide, {SCREEN_WIDTH} from '../../config/StyleGuide';

import {CustomIcon} from '../CustomIcon';

export const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

import styles, {MAX_TAB_WIDTH} from './styles';
import { Tab } from '../../config/types';

interface Props {
  tabs: Tab[];
  onTabChange?: (index: number) => void;
  renderTab: (tab: Tab, index: number) => React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  tabContainerStyle?: StyleProp<ViewStyle>;
  tabStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
}

interface LabelProps {
  tab: Tab;
  index: number;
  width: number;
  labelStyle?: StyleProp<TextStyle>;
  translation: SharedValue<number>;
  onPress: (index: number) => void;
}

const TabLabel = ({
  tab,
  index,
  width,
  labelStyle,
  translation,
  onPress,
}: LabelProps) => {
  const tabWidthStyle = useMemo(() => {
    return {
      width,
    };
  }, [width]);

  const onTabPress = () => {
    onPress(index);
  };

  const labelOpacityStyle = useAnimatedStyle(() => {
    const startPoint = SCREEN_WIDTH * index;
    const endPoint = SCREEN_WIDTH * (index + 1);
    const halfScreen = SCREEN_WIDTH / 2;
    return {
      opacity: interpolate(
        translation.value,
        [startPoint - halfScreen, startPoint, endPoint - halfScreen, endPoint],
        [0.7, 1, 1, 0.7],
        Extrapolate.CLAMP,
      ),
    };
  });

  return (
    <TouchableWithoutFeedback onPress={onTabPress}>
      <View style={[styles.labelContainer, tabWidthStyle]}>
        <Animated.View style={[styles.labelTextContainer, labelOpacityStyle]}>
          {!!tab.icon && (
            <CustomIcon
              name={tab.icon}
              size={StyleGuide.size.s14}
              style={styles.labelIcon}
            />
          )}
          <Text style={[styles.label, labelStyle]}>{tab.label}</Text>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const Tabs = ({
  tabs,
  onTabChange,
  renderTab,
  containerStyle,
  tabContainerStyle,
  tabStyle,
  labelStyle,
}: Props,  ref: any) => {
  const tabBarTranslation = useSharedValue(0);
  const flatlistRef = useRef<any>(null);

  const [currentTabIndex, setCurrentTabIndex] = useState(-1);

  const scrollToIndex = (index: number, animated = true) => { 
    if (!flatlistRef.current) return;
    flatlistRef.current.scrollToIndex({index, animated})
  }

  useImperativeHandle(ref, () => ({
    scrollToIndex: (index: number) =>
    scrollToIndex(index),
  }));

  useEffect(() => {
    if (currentTabIndex === -1 || !onTabChange) return;
    onTabChange(currentTabIndex);
  }, [currentTabIndex]);

  const onViewRef = React.useRef((viewableItems: any) => {
    onViewableItemsChanged(viewableItems);
  });
  const viewabilityConfig = useRef<any>({
    viewAreaCoveragePercentThreshold: 95,
  });

  const onViewableItemsChanged = ({viewableItems}: any) => {
    if (viewableItems[0]) {
      setCurrentTabIndex(viewableItems[0].index);
    }
  };

  const getItemLayout = useCallback((data: any, index: number) => {
    return {
      length: SCREEN_WIDTH,
      offset: SCREEN_WIDTH * index,
      index,
    };
  }, []);

  const tabScrollHandler = useAnimatedScrollHandler(event => {
    tabBarTranslation.value = event.contentOffset.x;
  });

  const tabWidth = useMemo(() => {
    const width = (SCREEN_WIDTH * 0.9) / tabs.length;
    return width > MAX_TAB_WIDTH ? MAX_TAB_WIDTH : width;
  }, [tabs]);

  const blockStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            tabBarTranslation.value,
            [0, SCREEN_WIDTH * tabs.length],
            [0, tabWidth * tabs.length],
            'clamp',
          ),
        },
      ],
    };
  });

  const tabWidthStyle = useMemo(() => {
    return {
      width: tabWidth,
    };
  }, [tabWidth]);

  const onScrollFailed = () => null;
  const keyExtractor = (item: Tab) => item.id;

  const onPress = (index: number) => {
    if (flatlistRef.current) {
      flatlistRef.current.scrollToIndex({animated: true, index});
    }
  };

  const renderItem = ({item, index}: {item: Tab, index: number}) => (
    <View style={[styles.flatlistTab, tabStyle]}>{renderTab(item, index)}</View>
  );

  return (
    <View style={[styles.container, containerStyle]}>
      <AnimatedFlatList
        ref={flatlistRef}
        scrollEventThrottle={1}
        data={tabs}
        //@ts-ignore
        renderItem={renderItem}
        //@ts-ignore
        keyExtractor={keyExtractor}
        style={styles.flatList}
        keyboardShouldPersistTaps={'handled'}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        onScroll={tabScrollHandler}
        onScrollToIndexFailed={onScrollFailed}
        initialNumToRender={1}
        maxToRenderPerBatch={2}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewabilityConfig.current}
        getItemLayout={getItemLayout}
        // scrollEnabled={false}
        pagingEnabled
        horizontal
      />
      <Animated.View style={[styles.tabBarContainer, tabContainerStyle]}>
        <Animated.View
          style={[styles.blockContainer, tabWidthStyle, blockStyle]}>
          <View style={styles.block} />
        </Animated.View>
        <View style={styles.headers}>
          {tabs.map((tab, index) => (
            <TabLabel
              key={tab.id}
              tab={tab}
              index={index}
              width={tabWidth}
              labelStyle={labelStyle}
              onPress={onPress}
              translation={tabBarTranslation}
            />
          ))}
        </View>
      </Animated.View>
    </View>
  );
};

export default forwardRef(Tabs);

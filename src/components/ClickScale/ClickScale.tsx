import React, {useEffect} from 'react';
// import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {StyleProp, TouchableWithoutFeedback} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

// import { hapticFeedbackOptions } from '../../config/options';
//import styles from './styles';

interface Props {
  onPress?: Function;
  onPressIn?: Function;
  onLongPress?: Function;
  disabled?: boolean;
  style?: StyleProp<any>;
  noOpacity?: boolean;
  children?: any;
  toValue?: number;
  opacity?: number;
}

const ClickScale = ({
  onPress,
  onPressIn,
  onLongPress,
  disabled,
  style,
  noOpacity,
  children,
  toValue,
  opacity,
}: Props) => {
  const animatePress = useSharedValue(1);
  const animateOpacity = useSharedValue(opacity || 1);

  useEffect(() => {
    if (opacity === undefined) return;
    animateOpacity.value = opacity;
  }, [opacity]);

  const springConfig = {
    damping: 5,
    mass: 1,
    stiffness: 150,
  };

  const onButtonPress = () => {
    // ReactNativeHapticFeedback.trigger('impactMedium', hapticFeedbackOptions);
    if (!onPress) return;
    onPress();
  };

  const onButtonLongPress = () => {
    // ReactNativeHapticFeedback.trigger('impactMedium', hapticFeedbackOptions);
    if (!onLongPress) return;
    onLongPress();
    animateOut();
  };

  const animateIn = () => {
    if (onPressIn) {
      onPressIn();
    }
    animatePress.value = withTiming(toValue || 0.9, {
      duration: 400,
      easing: Easing.elastic(3),
    });
  };

  const animateOut = () => {
    animatePress.value = withSpring(1, springConfig);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: noOpacity ? 1 : animateOpacity.value,
    transform: [{scale: animatePress.value}],
  }));

  return (
    <TouchableWithoutFeedback
      onPressIn={animateIn}
      onPressOut={animateOut}
      onPress={onButtonPress}
      onLongPress={onButtonLongPress}
      disabled={disabled}>
      <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default ClickScale;

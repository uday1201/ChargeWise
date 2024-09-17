import React, {useMemo} from 'react';
import {StyleProp, Text, TextStyle, View, ViewStyle} from 'react-native';
import {colors} from '../../config/colors';
import StyleGuide from '../../config/StyleGuide';
import {ClickScale} from '../ClickScale';
import {CustomIcon} from '../CustomIcon';

import styles, {SIZE} from './styles';

interface Props {
  icon?: string;
  iconSize?: number;
  iconStyle?: StyleProp<ViewStyle>;
  primary?: boolean;
  accent?: boolean;
  danger?: boolean;
  label?: string;
  labelStyle?: StyleProp<TextStyle>;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  size?: number;
  badge?: number;
  disabled?: boolean;
}

const CircleButton = ({
  icon,
  iconSize,
  label,
  labelStyle,
  primary,
  accent,
  danger,
  style,
  containerStyle,
  children,
  size,
  badge,
  disabled,
  onPress,
}: Props) => {
  const backgroundColor = useMemo(() => {
    return primary
    ? colors.background
    : accent
    ? colors.accent
    : danger
    ? colors.danger
    : colors.text;
  }, [primary, accent, danger])

  const circleStyle = useMemo(() => {
    const circleSize = size || SIZE;
    return {
      borderRadius: circleSize / 2,
      width: circleSize,
      height: circleSize,
    };
  }, [size]);

  return (
    <View style={[styles.outerContainer, containerStyle ]}>
      <ClickScale onPress={onPress} disabled={disabled}>
        <View style={[styles.container, circleStyle, {backgroundColor}, style, {opacity: disabled ? 0 : 1}]}>
          {icon && (
            <CustomIcon
              name={icon}
              size={iconSize || StyleGuide.size.s32}
              color={'#fff'}
            />
          )}
          {children && children}
        </View>
        {!!badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
      </ClickScale>
      {!!label && <Text style={[styles.label, {color: backgroundColor}, labelStyle]}>{label}</Text>}
    </View>
  );
};

export default CircleButton;

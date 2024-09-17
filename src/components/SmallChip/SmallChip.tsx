import React, { useMemo } from 'react';
import { View, Text, StyleProp, TextStyle, ViewStyle } from 'react-native';
import StyleGuide from '../../config/StyleGuide';
import { CustomIcon } from '../CustomIcon';

import styles from './styles';
import { colors } from '../../config/colors';

interface Props {
  label: string;
  labelStyle?: StyleProp<TextStyle>;
  icon?: string;
  iconSize?: number;
  style?: StyleProp<ViewStyle>;
  primary?: boolean;
  accent?: boolean;
  warn?: boolean;
  danger?: boolean;
  success?: boolean;
}

const SmallChip = ({ label, labelStyle, icon, iconSize, style, primary, accent, warn, danger, success }: Props) => {
  const backgroundColor = useMemo(() => {
    if (danger) return colors.danger;
    if (success) return colors.success;
    if (warn) return colors.warn;
    if (primary) return colors.background;
    if (accent) return colors.accent;
    return colors.text
  }, [primary, accent, warn, danger]);
  return (
    <View style={[styles.chip, { backgroundColor }, style]}>
      {icon && <CustomIcon name={icon} size={iconSize || StyleGuide.size.s12} style={{ marginRight: iconSize ? (iconSize * 0.4) : 4 }} color={'#fff'}/>}
      <Text style={[styles.chipText, labelStyle]}>{label}</Text>
    </View>
  );
};

export default SmallChip;

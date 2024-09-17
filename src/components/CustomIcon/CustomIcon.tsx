import React from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import {colors} from '../../config/colors';

interface Props {
  size?: number;
  name: string;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

const CustomIcon = ({
  size,
  name,
  color,
  style,
}: Props) => {

  return (
    <Icon
      name={name}
      size={size || 24}
      color={color || colors.text}
      style={style}
    />
  );
};

export default CustomIcon;

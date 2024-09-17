import { Dimensions, PixelRatio, Platform } from 'react-native';

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const scale = SCREEN_WIDTH / 320;
export const CONTENT_SPACING = 15;
export const HEADER_HEIGHT = 100;
export const TAB_BAR_HEIGHT = SCREEN_HEIGHT * 0.095;

export const normalize = (size: number) => {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
};

const StyleGuide = {
  fonts: {
    bold: 'Roboto-Bold',
    semiBold: 'Roboto-Medium',
    extraBold: 'Roboto-Black',
    regular: 'Roboto-Regular',
  },
  size: {
    s3: normalize(3),
    s4: normalize(4),
    s5: normalize(5),
    s6: normalize(6),
    s7: normalize(7),
    s8: normalize(8),
    s9: normalize(9),
    s10: normalize(10),
    s11: normalize(11),
    s11p5: normalize(11.5),
    s12: normalize(12),
    s12p5: normalize(12.5),
    s13: normalize(13),
    s13p5: normalize(13.5),
    s14: normalize(14),
    s14p5: normalize(14.5),
    s15: normalize(15),
    s16: normalize(16),
    s17: normalize(17),
    s18: normalize(18),
    s19: normalize(19),
    s20: normalize(20),
    s22: normalize(22),
    s24: normalize(24),
    s26: normalize(26),
    s28: normalize(28),
    s30: normalize(30),
    s32: normalize(32),
    s34: normalize(34),
    s35: normalize(35),
    s36: normalize(36),
    s38: normalize(38),
    s40: normalize(40),
    s42: normalize(42),
    s44: normalize(44),
    s46: normalize(46),
    s48: normalize(48),
    s50: normalize(50),
    s52: normalize(52),
    s54: normalize(54),
    s56: normalize(56),
    s58: normalize(58),
    s60: normalize(60),
    s62: normalize(62),
    s64: normalize(64),
    s66: normalize(66),
    s68: normalize(68),
    s70: normalize(70),
    s72: normalize(72),
    s74: normalize(74),
    s76: normalize(76),
    s78: normalize(78),
    s80: normalize(80),
    s82: normalize(82),
    s84: normalize(84),
    s90: normalize(90),
    s100: normalize(100),
    s110: normalize(110),
    s120: normalize(120),
    s140: normalize(140),
    s160: normalize(160),
  },
};

export default StyleGuide;

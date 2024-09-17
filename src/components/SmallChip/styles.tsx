import { StyleSheet } from 'react-native';
import { colors } from '../../config/colors';
import StyleGuide, { SCREEN_WIDTH } from '../../config/StyleGuide';

export default StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 4,
  },
  chipText: {
    fontSize: StyleGuide.size.s12,
    fontFamily: StyleGuide.fonts.extraBold,
    color: '#fff',
  },
  animation: {
    width: SCREEN_WIDTH * 0.1,
    opacity: 0.9,
    marginRight: 10,
  },
});

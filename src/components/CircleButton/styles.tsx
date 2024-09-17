import {StyleSheet} from 'react-native';
import {colors} from '../../config/colors';
import StyleGuide from '../../config/StyleGuide';

export const SIZE = StyleGuide.size.s78;

export default StyleSheet.create({
  outerContainer: {
    alignItems: 'center',
  },
  container: {
    backgroundColor: colors.text,
    // padding: '5%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(0,0,0,1)',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  label: {
    color: colors.text,
    fontFamily: StyleGuide.fonts.extraBold,
    fontSize: StyleGuide.size.s16,
    lineHeight: StyleGuide.size.s18,
    textAlign: 'center',
    marginTop: 12,
  },
  badge: {
    position: 'absolute',
    top: '-9%',
    right: '-2%',
    backgroundColor: colors.danger,
    width: StyleGuide.size.s24,
    height: StyleGuide.size.s24,
    borderRadius: StyleGuide.size.s24 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: colors.text,
    fontFamily: StyleGuide.fonts.extraBold,
    fontSize: StyleGuide.size.s13p5,
    textAlign: 'center',
    marginTop: 1,
  },
});

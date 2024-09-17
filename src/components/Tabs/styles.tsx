import {StyleSheet} from 'react-native';
import {colors} from '../../config/colors';
import StyleGuide, {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../config/StyleGuide';



const TAB_BAR_HEIGHT = SCREEN_HEIGHT * 0.045;
export const MAX_TAB_WIDTH = SCREEN_WIDTH * 0.36;

export default StyleSheet.create({
  container: {alignItems: 'center', height: '100%'},
  tabBarContainer: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: TAB_BAR_HEIGHT,
    left: 0,
    justifyContent: 'flex-end',
    paddingHorizontal: '5%',
},
headers: {
    flexDirection: 'row',
    height: '100%',
    // justifyContent: 'center',
},
blockContainer: {
    position: 'absolute',
    left: SCREEN_WIDTH * 0.05,
    height: TAB_BAR_HEIGHT,
    justifyContent: 'flex-end',
},
block: {
    backgroundColor: colors.primary,
    height: '10%',
},
labelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  labelIcon: {
    marginRight: 5,
  },
  labelTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flatList: {
    marginTop: TAB_BAR_HEIGHT,
  },
  flatlistTab: {
    width: SCREEN_WIDTH,
    height: '100%',
    marginTop: '4%',
    // paddingTop: '4%',
    overflow: 'hidden',
  },
  label: {
    fontFamily: StyleGuide.fonts.bold,
    fontSize: StyleGuide.size.s14p5,
    color: colors.text,
    letterSpacing: 0.7,
  },
});

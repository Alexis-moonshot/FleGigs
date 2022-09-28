import {BaseColor} from '@config';
import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center',
    height: 150,
    backgroundColor: BaseColor.primaryColor,
  },
  drawerAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginLeft: 30,
  },
  drawerHeaderContent: {
    marginLeft: 10,
  },
  drawerHeaderText: {
    color: BaseColor.whiteColor,
    fontSize: 20,
    marginTop: 5,
  },
  icon: {
    marginLeft: 10,
    width: 30,
  },
  versionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 30,
  },
});

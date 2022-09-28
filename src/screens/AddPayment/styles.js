import {StyleSheet} from 'react-native';
import {BaseColor} from '@config';

export default StyleSheet.create({
  contain: {
    flex: 1,
    padding: 20,
  },
  title: {
    marginBottom: 20,
  },
  checkDefault: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopColor: BaseColor.textSecondaryColor,
    borderTopWidth: 1,
    paddingVertical: 15,
    marginTop: 10,
  },
  bottomButtonContainer: {
    padding: 20,
  },
});

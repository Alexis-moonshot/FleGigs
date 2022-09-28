import {StyleSheet} from 'react-native';
import {BaseColor} from '@config';

export default StyleSheet.create({
  leftPart: {
    flex: 5,
  },
  rightPart: {
    flex: 5,
  },
  customerImage: {
    alignItems: 'center',
    marginTop: 30,
    borderColor: BaseColor.primaryColor,
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 20,
  },
  helperListWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    borderBottomColor: BaseColor.grayColor,
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  bottomButtonContainer: {
    padding: 20,
  },
});

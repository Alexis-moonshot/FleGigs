import {StyleSheet} from 'react-native';
import {BaseColor} from '@config';

export default StyleSheet.create({
  contentTitle: {
    alignItems: 'flex-start',
    width: '100%',
    height: 32,
    justifyContent: 'center',
  },
  contain: {
    alignItems: 'center',
    padding: 20,
    width: '100%',
  },
  textInput: {
    height: 46,
    backgroundColor: BaseColor.fieldColor,
    borderRadius: 5,
    padding: 10,
    width: '100%',
  },
  bottomButtonContainer: {
    padding: 20,
  },
  msg: {
    flex: 1,
    borderColor: BaseColor.grayColor,
    // borderWidth: 1,
    textAlignVertical: 'top',
    marginTop: 10,
    height: 320,
  },
});

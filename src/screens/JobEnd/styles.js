import {StyleSheet} from 'react-native';
import {BaseColor} from '@config';
export default StyleSheet.create({
  billContent: {
    marginTop: 10,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: BaseColor.grayColor,
    padding: 10,
  },
  billItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    fontSize: 15,
  },
  image: {
    width: 200,
    height: 140,
    marginTop: 20,
  },
});

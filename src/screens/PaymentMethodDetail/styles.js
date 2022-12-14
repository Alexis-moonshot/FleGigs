import {StyleSheet} from 'react-native';
import {BaseColor} from '@config';

export default StyleSheet.create({
  inputItem: {
    flex: 6.5,
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 46,
    backgroundColor: BaseColor.fieldColor,
    borderRadius: 5,
    padding: 10,
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
  card: {
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BaseColor.fieldColor,
    backgroundColor: BaseColor.whiteColor,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 1.5,
  },
  popupTitle: {
    fontSize: 20,
    paddingTop: 50,
  },
  bottomButtonGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 70,
    marginBottom: 30,
    borderWidth: 1,
    borderRadius: 100,
    borderColor: BaseColor.dividerColor,
  },
  bottomButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
  bottomButtonText: {
    fontSize: 16,
  },
  divider: {
    width: 1,
    backgroundColor: BaseColor.dividerColor,
    height: 20,
  },
});

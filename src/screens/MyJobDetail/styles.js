import {StyleSheet} from 'react-native';
import * as Utils from '@utils';
import {BaseColor} from '@config';
export default StyleSheet.create({
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: BaseColor.fieldColor,
  },
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

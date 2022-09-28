import {StyleSheet} from 'react-native';
import * as Utils from '@utils';
import {BaseColor} from '@config';
export default StyleSheet.create({
  imgBanner: {
    width: '100%',
    height: 250,
    position: 'absolute',
  },
  contentImageFollowing: {
    flexDirection: 'row',
    height: Utils.scaleWithPixel(160),
    marginTop: 10,
  },
  contentButtonBottom: {
    borderTopColor: BaseColor.textSecondaryColor,
    borderTopWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editDescription: {
    height: 100,
    borderColor: BaseColor.grayColor,
    borderWidth: 1,
    textAlignVertical: 'top',
    marginTop: 10,
  },
  genderImage: {
    height: 64,
    width: 64,
  },
  monetary: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: BaseColor.grayColor,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: BaseColor.grayColor,
  },
  jobImageContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 150,
  },
  jobImage: {
    width: '100%',
    height: 150,
  },
});

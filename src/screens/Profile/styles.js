import React from 'react';
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
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  tagFollow: {
    width: 100,
    marginTop: 15,
  },
  textInput: {
    height: 56,
    backgroundColor: BaseColor.fieldColor,
    borderRadius: 5,
    padding: 10,
    width: '100%',
  },
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: BaseColor.textSecondaryColor,
    borderBottomWidth: 1,
    paddingVertical: 20,
  },
  profileItemIcon: {
    marginLeft: 5,
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
  bottomButtonContainer: {
    padding: 20,
  },
});

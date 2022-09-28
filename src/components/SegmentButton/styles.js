import React from 'react';
import {StyleSheet} from 'react-native';
import {BaseColor} from '@config';

export default StyleSheet.create({
  contain: {
    flexDirection: 'row',
    width: '100%',
  },
  button: {
    // borderTopWidth: 2,
    // borderBottomWidth: 2,
    // borderRightWidth: 2,
    width: '20%',
    backgroundColor: BaseColor.fieldColor,
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
  },
  leftBound: {
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  rightBound: {
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  selected: {
    // borderWidth: 2,
    // borderColor: BaseColor.accentColor,
    backgroundColor: BaseColor.primaryColor,
  },
});

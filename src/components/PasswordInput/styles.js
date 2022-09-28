import React from 'react';
import {StyleSheet} from 'react-native';
import {BaseColor} from '@config';

export default StyleSheet.create({
  contain: {
    flexDirection: 'row',
    height: 46,
    backgroundColor: BaseColor.fieldColor,
    borderRadius: 5,
    // padding: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    height: 46,
    flex: 1,
    padding: 10,
    color: 'black',
  },
  icon: {
    color: 'gray',
    marginRight: 10,
  },
});

import React from 'react';
import {StyleSheet} from 'react-native';
import {BaseColor} from '@config';

export default StyleSheet.create({
  item: {
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 5,
    paddingBottom: 5,
  },
  contain: {
    flexDirection: 'row',
    // borderBottomColor: BaseColor.textSecondaryColor,
    // borderBottomWidth: 1,
    paddingTop: 5,
    paddingBottom: 5,
  },
  thumb: {width: 60, height: 60, marginRight: 10, borderRadius: 50},
  content: {
    flex: 1,
  },
});

import React from 'react';
import {StyleSheet} from 'react-native';
import {BaseColor} from '@config';

export default StyleSheet.create({
  description: {
    fontSize: 15,
    marginHorizontal: 20,
    color: BaseColor.primaryColor,
    marginTop: 15,
  },
  placeholder: {
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  placeholderMedia: {
    width: 55,
    height: 45,
    marginRight: 10,
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: BaseColor.textSecondaryColor,
  },
});

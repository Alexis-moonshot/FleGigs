import React from 'react';
import {StyleSheet} from 'react-native';
import {BaseColor} from '@config';

export default StyleSheet.create({
  contain: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bubbleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },
  bubble: {
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,255,0.3)',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  instruction: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 25,
    color: '#3D3D3D',
  },
  spinnerTextStyle: {
    color: '#FFF',
  },
});

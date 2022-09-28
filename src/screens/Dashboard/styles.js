import React from 'react';
import {StyleSheet} from 'react-native';
import {BaseColor} from '@config';

export default StyleSheet.create({
  thumb: {
    width: 80,
    height: 80,
    borderRadius: 40,
    margin: 10,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: BaseColor.whiteColor,
    shadowColor: 'black',
    shadowOffset: {width: 1.5, height: 1.5},
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 5,
  },
  avatarContainer: {
    alignItems: 'center',
    marginRight: 20,
  },
  overview: {
    flex: 1,
  },
  overviewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 5,
  },
  buttonGroup: {
    padding: 20,
  },
  buttonText: {
    marginLeft: 20,
  },
  activityTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activityTitle: {
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  tag: {
    height: 30,
    marginRight: 20,
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
  ongoingJobButton: {
    flexDirection: 'row',
    backgroundColor: '#38B5E6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  ongoingJobStatue: {
    marginLeft: 10,
  },
});

import React, {Component} from 'react';
import {View, TouchableOpacity} from 'react-native';
import Text from '../Text';
import Icon from '../Icon';
import {BaseColor} from '@config';
import styles from './styles';
import PropTypes from 'prop-types';

export default class MyJobListItem extends Component {
  jobStatusStr = status => {
    let str = '';
    switch (status) {
      case '0':
        str = 'Pending';
        break;
      case '1':
        str = 'In Progress';
        break;
      case '2':
        str = 'Completed';
        break;
      case '-1':
        str = 'Cancelled';
        break;
      default:
        break;
    }
    return str;
  };
  render() {
    const {style, onPress, job} = this.props;
    const {job_id, short_description, job_status, completed_job_date, posted_job_date} = job;

    return (
      <TouchableOpacity style={[styles.item, style]} onPress={onPress} activeOpacity={0.9}>
        <View>
          <Text headline semibold>
            {short_description}
          </Text>
          <Text grayColor>#{job_id}</Text>
        </View>
        <View style={styles.contain}>
          <View style={styles.content}>
            <View style={styles.left}>
              <Text headline semibold>
                Date
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon name="calendar-alt" color={BaseColor.primaryColor} size={20} />
                <Text headline semibold grayColor caption2 style={{fontSize: 12, marginLeft: 10}}>
                  {posted_job_date}
                </Text>
              </View>
            </View>
            <View style={styles.right}>
              <Text headline semibold>
                Status
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {job_status === '2' && <Icon name="check-circle" size={24} color={BaseColor.primaryColor} />}
                <Text caption2 grayColor style={{marginLeft: 10}}>
                  {this.jobStatusStr(job_status)}
                </Text>
              </View>
            </View>
          </View>
          {job_status === '2' && (
            <View
              style={{
                backgroundColor: '#00ff00',
                paddingHorizontal: 10,
                paddingVertical: 5,
                marginHorizontal: 10,
                marginVertical: 8,
                borderRadius: 5,
              }}>
              <Text>{completed_job_date}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }
}

MyJobListItem.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  id: PropTypes.string,
  title: PropTypes.string,
  date: PropTypes.string,
  status: PropTypes.string,
  onPress: PropTypes.func,
};

MyJobListItem.defaultProps = {
  style: {},
  id: '',
  title: '',
  date: '',
  status: '',
  onPress: () => {},
};

import React, {Component} from 'react';
import {View, TouchableOpacity} from 'react-native';
import Text from '../Text';
import styles from './styles';
import PropTypes from 'prop-types';

export default class ActivityItem extends Component {
  render() {
    const {style, onPress, item, index} = this.props;
    return (
      <TouchableOpacity style={[styles.item, style]} onPress={onPress} activeOpacity={0.9}>
        <View style={styles.contain}>
          <View style={styles.left}>
            <Text callout>
              {item.user_name && <Text style={{fontWeight: 'bold'}}>{item.user_name} </Text>}
              {item.message}
            </Text>
          </View>
          <View style={{alignItems: 'flex-end'}}>
            <Text note footnote grayColor style={{paddingTop: 5}}>
              {item.created_time}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

ActivityItem.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onPress: PropTypes.func,
};

ActivityItem.defaultProps = {
  style: {},
  onPress: () => {},
};

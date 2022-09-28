import React, {Component} from 'react';
import {View, TouchableOpacity} from 'react-native';
import styles from './styles';
import Text from '../Text';
import Icon from '../Icon';
import PropTypes from 'prop-types';
import {BaseColor} from '@config';

export default class StepProgress extends Component {
  render() {
    const {style, onPress, step, title, description, done} = this.props;
    return (
      <TouchableOpacity style={[styles.contain, style]} onPress={onPress} activeOpacity={0.9}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text headline accentColor semibold>
            {step}
          </Text>
          {done && (
            <View>
              <Icon name="check" size={16} color={BaseColor.accentColor} />
            </View>
          )}
        </View>
        <Text
          title3
          semibold
          whiteColor
          style={{
            marginTop: 8,
          }}
          numberOfLines={1}>
          {title}
        </Text>
        <Text
          body2
          grayColor
          style={{
            marginTop: 8,
          }}
          numberOfLines={5}>
          {description}
        </Text>
      </TouchableOpacity>
    );
  }
}

StepProgress.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onPress: PropTypes.func,
  step: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  done: PropTypes.bool,
};

StepProgress.defaultProps = {
  step: '',
  title: '',
  description: '',
  done: false,
  style: {},
  onPress: () => {},
};

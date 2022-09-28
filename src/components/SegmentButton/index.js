import React, {Component} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import Text from '../Text';
import styles from './styles';
import PropTypes from 'prop-types';

export default class SegmentButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: props.selected,
    };
  }

  renderButton = (item, index) => {
    const {id, title, selectedStyle, textStyle} = item;
    const {selected} = this.state;
    const count = this.props.data.length;

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={StyleSheet.flatten([
          styles.button,
          index === 0 && styles.leftBound,
          index === count - 1 && styles.rightBound,
          index === selected && styles.selected,
          index === selected && selectedStyle,
        ])}
        key={index}
        onPress={() => {
          this.setState({selected: index});
          this.props.onPress(index);
        }}>
        <Text style={StyleSheet.flatten([styles.text, textStyle])}>{title}</Text>
      </TouchableOpacity>
    );
  };

  render() {
    const {style, data} = this.props;
    return <View style={[styles.contain, style]}>{data.map((item, index) => this.renderButton(item, index))}</View>;
  }
}

SegmentButton.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onPress: PropTypes.func,
  data: PropTypes.array,
  seletedStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

SegmentButton.defaultProps = {
  style: {},
  onPress: index => {},
};

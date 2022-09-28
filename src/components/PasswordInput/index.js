import React, {Component} from 'react';
import {TouchableOpacity, View, TextInput} from 'react-native';
import {BaseColor} from '@config';
import PropTypes from 'prop-types';
import Icon from '../Icon';
import styles from './styles';

export default class PasswordInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: props.show,
      value: props.value,
    };
  }

  render() {
    const {containerStyle, textStyle, iconStyle, onChangeText, placeholder, placeholderTextColor, maxLength} = this.props;
    const {show, value} = this.state;

    return (
      <View style={[styles.contain, containerStyle]}>
        <TextInput
          style={[styles.textInput, textStyle]}
          onChangeText={text => {
            this.setState({value: text});
            onChangeText(text);
          }}
          autoCorrect={false}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          value={value}
          autoCapitalize={'none'}
          autoCompleteType={'password'}
          maxLength={maxLength}
          secureTextEntry={!show}
          textContentType={'password'}
        />
        <TouchableOpacity onPress={() => this.setState({show: !show})}>
          <Icon name={show ? 'eye-slash' : 'eye'} size={20} style={[styles.icon, iconStyle]} />
        </TouchableOpacity>
      </View>
    );
  }
}

PasswordInput.propTypes = {
  containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  textStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  iconStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  show: PropTypes.bool,
  onChangeText: PropTypes.func,
  placeholder: PropTypes.string,
  placeholderTextColor: PropTypes.string,
  maxLength: PropTypes.number,
};

PasswordInput.defaultProps = {
  value: '',
  containerStyle: {},
  textStyle: {},
  iconStyle: {},
  show: false,
  onChangeText: text => {},
  placeholder: 'Password',
  placeholderTextColor: BaseColor.grayColor,
  maxLength: 20,
};

import React, {Component} from 'react';
import {View, TouchableOpacity} from 'react-native';
import Image from '../Image';
import Text from '../Text';
import Tag from '../Tag';
import styles from './styles';
import PropTypes from 'prop-types';

export default class JobListItem extends Component {
  render() {
    const {style, children, title, description, status, onPress, image} = this.props;
    return (
      <View style={style}>
        {children}
        <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
          <Image style={styles.imagePost} source={image} />
          {/* <Icon
            name="bookmark"
            solid
            size={24}
            color={BaseColor.whiteColor}
            style={{ position: 'absolute', top: 10, right: 10 }}
          /> */}
          <Tag outline round status style={{height: 30, position: 'absolute', top: 20, right: 20}}>
            {status}
          </Tag>
        </TouchableOpacity>
        <View style={styles.content}>
          <Text headline semibold style={{marginBottom: 6}}>
            {title}
          </Text>
          <Text body2>{description}</Text>
        </View>
      </View>
    );
  }
}

JobListItem.propTypes = {
  image: PropTypes.node.isRequired,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
  title: PropTypes.string,
  description: PropTypes.string,
  status: PropTypes.string,
  onPress: PropTypes.func,
};

JobListItem.defaultProps = {
  image: '',
  title: '',
  description: '',
  status: '',
  style: {},
  onPress: () => {},
};

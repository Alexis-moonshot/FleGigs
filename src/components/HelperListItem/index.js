import React, {Component} from 'react';
import {View, TouchableOpacity, ActivityIndicator} from 'react-native';
import Image from '../Image';
import Text from '../Text';
import Icon from '../Icon';
import StarRating from '../StarRating';
import Button from '../Button';
import {BaseColor} from '@config';
import styles from './styles';
import PropTypes from 'prop-types';

export default class HelperListItem extends Component {
  constructor(props) {
    super();
    this.state = {
      checked: props.helperData.helper_status >= 1,
    };
  }
  render() {
    const {style, helperData, jobStatus, paymentStatus, onPress, onCheck, onTrack} = this.props;

    return (
      <TouchableOpacity style={[styles.item, style]} activeOpacity={0.9}>
        <View style={styles.contain}>
          <View style={styles.content}>
            <View style={styles.left}>
              <Image source={{uri: helperData.profile_image}} style={styles.thumb} />
              <View>
                <Text semibold>{helperData.helper_name}</Text>
                <View style={{flexDirection: 'row'}}>
                  <Text headline semibold grayColor caption2 style={{fontSize: 12, marginRight: 10}}>
                    {helperData.average_rating}
                  </Text>
                  <StarRating
                    disabled={true}
                    starSize={14}
                    maxStars={5}
                    rating={helperData.average_rating}
                    fullStarColor={BaseColor.yellowColor}
                  />
                </View>
              </View>
            </View>
            {paymentStatus === 1 && (
              <View style={styles.right}>
                {helperData.helper_status === '0' &&
                  (helperData.loading ? (
                    <ActivityIndicator size={'small'} />
                  ) : (
                    <Button
                      style={{marginRight: 10, height: 25, fontSize: 5}}
                      onPress={() => {
                        onTrack();
                      }}>
                      <Text style={{fontSize: 13}}>Track</Text>
                    </Button>
                  ))}
                {helperData.helper_status === '1' && (
                  <Button
                    style={{
                      marginRight: 10,
                      height: 25,
                      fontSize: 5,
                      backgroundColor: '#57bb6a',
                    }}>
                    <Text style={{fontSize: 13}}>On Site</Text>
                  </Button>
                )}
                <TouchableOpacity
                  style={[
                    styles.checkbox,
                    this.state.checked && {
                      backgroundColor: BaseColor.grayColor,
                      borderColor: BaseColor.grayColor,
                    },
                  ]}
                  onPress={() => {
                    this.setState({checked: !this.state.checked});
                    onCheck();
                  }}
                  disabled={this.state.checked}>
                  {this.state.checked && <Icon name="check" size={16} color={BaseColor.whiteColor} />}
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

HelperListItem.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  helperData: PropTypes.object,
  onPress: PropTypes.func,
};

HelperListItem.defaultProps = {
  style: {},
  helperData: {},
  onPress: () => {},
};

import React, {Component} from 'react';
import {View, TouchableOpacity, TextInput} from 'react-native';
import Image from '../Image';
import Text from '../Text';
import StarRating from '../StarRating';
import Button from '../Button';
import {BaseColor} from '@config';
import styles from './styles';
import PropTypes from 'prop-types';

export default class JobRatingListItem extends Component {
  constructor(props) {
    super();
    this.state = {
      rated: props.rating.rating !== 0,
      star: parseInt(props.rating.rating, 10),
      tipAmount: '',
      profile_image: props.rating.helper_image,
    };
  }

  onSelectStar = star => {
    const {onRating, rating} = this.props;
    this.setState({star: star, rated: true});
    onRating(rating.helper_user_id, star);
  };

  onPay = () => {
    const {onPayTip, rating} = this.props;
    const {tipAmount} = this.state;

    if (parseFloat(tipAmount) > 0) {
      onPayTip(rating.helper_user_id, tipAmount);
    }
  };

  render() {
    const {style, rating} = this.props;
    const {rated, star, tipAmount, profile_image} = this.state;

    return (
      <View style={[styles.item, style]}>
        <View style={styles.contain}>
          <View style={styles.content}>
            <View style={{alignItems: 'center', flexDirection: 'column'}}>
              <Image source={{uri: profile_image}} style={styles.thumb} />
            </View>
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'column',
                marginTop: 5,
              }}>
              <StarRating
                // disabled={rated}
                starSize={24}
                maxStars={5}
                rating={star}
                fullStarColor={BaseColor.yellowColor}
                selectedStar={this.onSelectStar}
              />
              <Text style={{marginBottom: 5}}>{rating.helper_name}</Text>
            </View>
            <Text style={{color: BaseColor.primaryColor}}>Pay Tip</Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View
                style={{
                  flex: 1,
                  marginRight: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: BaseColor.grayColor,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                {parseFloat(rating.tip) > 0 ? (
                  <Text>{`$${rating.tip} Paid`}</Text>
                ) : (
                  <>
                    <Text style={{}}>$</Text>
                    <TextInput
                      style={{
                        paddingLeft: 10,
                        color: 'black',
                        flex: 1,
                      }}
                      onChangeText={text => this.setState({tipAmount: text})}
                      autoCorrect={false}
                      placeholder="0"
                      placeholderTextColor={BaseColor.grayColor}
                      value={tipAmount}
                      selectionColor={BaseColor.primaryColor}
                    />
                  </>
                )}
              </View>
              <Button
                onPress={this.onPay}
                disabled={parseFloat(rating.tip) > 0 || tipAmount === '' || rating.paying}
                loading={rating.paying}
                style={[
                  {
                    width: 80,
                    height: 30,
                    fontSize: 5,
                    backgroundColor: '#ff0000',
                    borderRadius: 3,
                    marginTop: 15,
                  },
                  (parseFloat(rating.tip) > 0 || tipAmount === '' || rating.paying) && {
                    backgroundColor: BaseColor.grayColor,
                  },
                ]}>
                Pay
              </Button>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

JobRatingListItem.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  rating: PropTypes.object,
  title: PropTypes.string,
  date: PropTypes.string,
  status: PropTypes.string,
  onPress: PropTypes.func,
};

JobRatingListItem.defaultProps = {
  style: {},
  rating: {},
  onPress: () => {},
};

import React, {PropTypes} from 'react';
import MapView, {Marker} from 'react-native-maps';
import {Images} from '@config';
import styles from './styles';

export default class HelperMarker extends React.Component {
  render() {
    const {gender = 'male', name, ...rest} = this.props;
    return <MapView.Marker title={name} image={gender === 'male' ? Images.maleMapPicker : Images.femaleMapPicker} {...rest} />;
  }
}

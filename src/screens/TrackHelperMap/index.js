import React, {Component} from 'react';
import {View} from 'react-native';
import {BaseStyle, BaseColor} from '@config';
import {Header, SafeAreaView, Icon, HelperMarker} from '@components';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import styles from './styles';
import {useFocusEffect} from '@react-navigation/native';
import database from '@react-native-firebase/database';
import {BackendConfiguration} from '../../config/backend';
import MapViewDirections from 'react-native-maps-directions';

function FocusMap({onFocus}) {
  useFocusEffect(
    React.useCallback(() => {
      onFocus();
      return;
    }, [onFocus])
  );

  return null;
}

export default class TrackHelperMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      region: {
        latitude: parseFloat(props.route.params.jobData.latitude),
        longitude: parseFloat(props.route.params.jobData.longitude),
        latitudeDelta: 0.009,
        longitudeDelta: 0.004,
      },
      helperData: {
        helper_name: '',
        gender: '',
      },
      helper_location: {
        latitude: parseFloat(props.route.params.jobData.latitude),
        longitude: parseFloat(props.route.params.jobData.longitude),
      },
    };
  }

  onFocus = () => {
    const {helperData, jobData} = this.props.route.params;
    this.setState({
      helperData: helperData,
      region: {
        ...this.state.region,
        latitude: parseFloat(jobData.latitude),
        longitude: parseFloat(jobData.longitude),
      },
    });

    database()
      .ref('helper')
      .child('helper_location/helper_' + helperData.user_id)
      .on('value', value => {
        console.log(value);
        if (value) {
          this.setState(
            {
              helper_location: {
                latitude: parseFloat(value.val().latitude),
                longitude: parseFloat(value.val().longitude),
              },
            },
            () => {
              this.fitMap();
            }
          );
        }
      });
  };

  fitMap() {
    this.map.fitToSuppliedMarkers(['helper', 'me'], true);
  }

  render() {
    const {navigation} = this.props;
    const {region, helperData, helper_location} = this.state;
    console.log('region ', region);
    console.log('helper_location ', helper_location);
    return (
      <>
        <FocusMap onFocus={this.onFocus} />
        <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'never'}}>
          <Header
            title="Track your helper"
            renderLeft={() => {
              return <Icon name="arrow-left" size={20} color={BaseColor.headerIconColor} />;
            }}
            onPressLeft={() => {
              navigation.goBack();
            }}
          />
          <View style={styles.contain}>
            <MapView
              // provider={PROVIDER_GOOGLE}
              ref={ref => {
                this.map = ref;
              }}
              style={styles.map}
              initialRegion={region}>
              <HelperMarker identifier={'helper'} name={helperData.helper_name} coordinate={helper_location} gender={helperData.gender} />
              <HelperMarker
                identifier={'me'}
                name={'Me'}
                coordinate={{
                  latitude: region.latitude,
                  longitude: region.longitude,
                }}
                gender={'male'}
              />
              <MapViewDirections
                origin={{
                  latitude: region.latitude,
                  longitude: region.longitude,
                }}
                destination={helper_location}
                apikey={BackendConfiguration.GOOGLE_DIRECTION_API_KEY}
                strokeWidth={5}
                strokeColor="hotpink"
              />
            </MapView>
          </View>
        </SafeAreaView>
      </>
    );
  }
}

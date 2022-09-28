import React, {Component} from 'react';
import {View, DeviceEventEmitter} from 'react-native';
import {BaseStyle, BaseColor} from '@config';
import {Header, SafeAreaView, Icon, Text, Button, HelperMarker} from '@components';
import {UserData} from '@data';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import styles from './styles';

export default class WaitingAccept extends Component {
  constructor(props) {
    super(props);

    // const { data, coordinate } = props.route.params;
    const {data, coordinate} = {
      data: {
        helper_list: [{id: 3}, {id: 12}],
        job_id: 390,
        job_no: 48899028,
        msg: 'Job added successfully',
        no_of_helper: 1,
        success: 1,
      },
      coordinate: {latitude: 22.5831267, longitude: 88.4135583},
    };

    console.log(data, coordinate);
    // Temp data define
    this.state = {
      loading: false,
      region: {
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
        latitudeDelta: 0.009,
        longitudeDelta: 0.004,
      },
      job_id: data.job_id,
      no_of_helper: data.no_of_helper,
      job_no: data.job_no,
      helper_list: data.helper_list,
    };
  }

  render() {
    const {navigation} = this.props;
    return (
      <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'never'}}>
        <Header
          title="Waiting helpers to accept"
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
            style={styles.map}
            initialRegion={this.state.region}
            onRegionChange={region => this.onRegionChange(region)}>
            {UserData.map((user, index) => (
              <HelperMarker name={user.name} coordinate={user.coordinate} gender={user.gender} />
            ))}
          </MapView>
          {/* <View style={[styles.bubble, styles.latlng]}>
            <Text style={{ textAlign: 'center' }}>
              {this.state.region.latitude.toPrecision(7)},
              {this.state.region.longitude.toPrecision(7)}
            </Text>
          </View> */}
        </View>
      </SafeAreaView>
    );
  }
}

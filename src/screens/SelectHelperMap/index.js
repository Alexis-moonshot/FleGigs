import React, {Component} from 'react';
import {View, ScrollView, TextInput} from 'react-native';
import {BaseStyle, BaseColor} from '@config';
import {Header, SafeAreaView, Icon, Text, Button, HelperMarker} from '@components';
import {UserData} from '@data';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import styles from './styles';

export default class SelectHelperMap extends Component {
  constructor(props) {
    super(props);

    // Temp data define
    this.state = {
      loading: false,
      region: {
        latitude: 10.73902,
        longitude: 106.709938,
        latitudeDelta: 0.009,
        longitudeDelta: 0.004,
      },
    };
  }

  onRegionChange(region) {
    this.setState({region});
  }

  render() {
    const {navigation} = this.props;
    return (
      <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'never'}}>
        <Header
          title="Select Helpers"
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
          <View style={[styles.bubble, styles.latlng]}>
            <Text style={{textAlign: 'center'}}>
              {this.state.region.latitude.toPrecision(7)},{this.state.region.longitude.toPrecision(7)}
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

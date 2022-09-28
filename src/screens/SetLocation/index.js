import React, {Component} from 'react';
import {View} from 'react-native';
import {BaseStyle, BaseColor} from '@config';
import {Header, SafeAreaView, Icon, Text} from '@components';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import styles from './styles';
import {LocationServices} from '../../services';
import {showMessage} from 'react-native-flash-message';
import {BackendConfiguration} from '../../config/backend';
import Spinner from 'react-native-loading-spinner-overlay';

export default class SetLocation extends Component {
  constructor(props) {
    super(props);

    // Temp data define
    this.state = {
      loading: false,
      coordinate:
        props.route.params.coordinate.latitude === 0 ? {latitude: 30.310931, longitude: -81.70577} : props.route.params.coordinate,
      location: '',
    };
  }

  onMapPress(e) {
    this.setState({
      coordinate: e.nativeEvent.coordinate,
    });
  }

  onPressAutoComplete(data, details) {
    // console.log('onPressAutoComplete');
    if (details) {
      this.setState({
        coordinate: {
          latitude: details.geometry.location.lat,
          longitude: details.geometry.location.lng,
        },
      });
      this.map.animateToRegion({
        latitude: this.state.coordinate.latitude,
        longitude: this.state.coordinate.longitude,
        latitudeDelta: 0.009,
        longitudeDelta: 0.004,
      });
    }
    // this.setState({ location: data.description });
  }

  render() {
    const {navigation} = this.props;
    const {coordinate, loading} = this.state;
    // console.log(coordinate);
    return (
      <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'never'}}>
        <Spinner visible={loading} />
        <Header
          title="Set Location"
          renderLeft={() => {
            return <Icon name="times" size={20} color={BaseColor.headerIconColor} />;
          }}
          renderRight={() => {
            return <Icon name="check" size={20} color={BaseColor.headerIconColor} />;
          }}
          onPressLeft={() => {
            navigation.navigate('PostJob', {
              type: 'set_location',
              result: false,
            });
          }}
          onPressRight={() => {
            this.setState({loading: true});
            LocationServices.getPlaceDetailsFromCoordinate(coordinate.latitude, coordinate.longitude, (geocode_success, geocode_result) => {
              this.setState({loading: false});
              if (geocode_success) {
                navigation.navigate('PostJob', {
                  type: 'set_location',
                  result: true,
                  locationData: {
                    ...coordinate,
                    location: geocode_result.formatted_address,
                  },
                });
              } else {
                showMessage({
                  message: 'Geocoding failed',
                  description: 'Could not get location information',
                  type: 'warning',
                  icon: 'auto',
                  duration: 6000,
                });
              }
            });
          }}
        />
        <View style={styles.contain}>
          <MapView
            ref={map => {
              this.map = map;
            }}
            // provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={{
              latitude: coordinate.latitude,
              longitude: coordinate.longitude,
              latitudeDelta: 0.009,
              longitudeDelta: 0.004,
            }}
            onPress={e => this.onMapPress(e)}>
            {coordinate && <MapView.Marker draggable coordinate={coordinate} onDragEnd={e => this.onMapPress(e)} />}
          </MapView>
          <GooglePlacesAutocomplete
            placeholder="Enter Location"
            autoFocus={false}
            minLength={2}
            returnKeyType={'search'}
            fetchDetails={true}
            isRowScrollable={false}
            onPress={(data, details = null) => {
              // 'details' is provided when fetchDetails = true
              this.onPressAutoComplete(data, details);
            }}
            query={{
              // available options: https://developers.google.com/places/web-service/autocomplete
              key: BackendConfiguration.GOOGLE_GEO_AUTOCOMPLETE_API_KEY,
              language: 'en',
              types: '(cities)',
            }}
            styles={{
              container: {
                padding: 15,
              },
              textInputContainer: {
                backgroundColor: '#FFFFFF00',
                borderTopWidth: 0,
                borderBottomWidth: 0,
                marginHorizontal: 0,
                marginTop: 20,
              },
              textInput: {
                marginHorizontal: 0,
                height: 38,
                color: '#5d5d5d',
                backgroundColor: '#FFFFFFDD',
                fontSize: 16,
                elevation: 16,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 8,
                },
                shadowOpacity: 0.44,
                shadowRadius: 10.32,
              },
              predefinedPlacesDescription: {
                color: '#1faadb',
              },
              listView: {
                marginTop: 10,
                marginHorizontal: 10,
              },
              row: {
                backgroundColor: 'rgba(255,255,255,0.9)',
              },
            }}
            currentLocation={false}
            enablePoweredByContainer={false}
          />
          <View style={styles.bubbleRow}>
            <View style={styles.bubble}>
              <Text style={styles.instruction}>{'Place pin on the map\nOr input address manually'}</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

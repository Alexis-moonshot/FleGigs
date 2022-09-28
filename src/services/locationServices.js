import {Platform, PermissionsAndroid} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import {BackendConfiguration} from '@config';

async function hasLocationPermission() {
  if (Platform.OS === 'ios' || (Platform.OS === 'android' && Platform.Version < 23)) {
    return true;
  }

  const hasPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);

  if (hasPermission) {
    return true;
  }

  const status = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);

  if (status === PermissionsAndroid.RESULTS.GRANTED) {
    return true;
  }

  if (status === PermissionsAndroid.RESULTS.DENIED) {
    console.log('Location permission denied by user.');
  } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    console.log('Location permission revoked by user.');
  }

  return false;
}

async function getLocation(callback) {
  const hasPermission = await hasLocationPermission();

  if (!hasPermission) {
    callback(false, 'No permission to get location');
  }

  Geolocation.getCurrentPosition(
    position => {
      //   this.setState({ location: position, loading: false });
      callback(true, position);
      //   console.log(position);
    },
    error => {
      //   this.setState({ location: error, loading: false });
      callback(false, error);
      //   console.log(error);
    },
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 10000,
      distanceFilter: 50,
      forceRequestLocation: true,
    }
  );
}

function getPlaceDetailsFromCoordinate(lat, long, callback) {
  axios
    .get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${BackendConfiguration.GOOGLE_GEO_API_KEY}`)
    .then(res => {
      if (res.status === 200) {
        const {data} = res;
        if (data.status === 'OK') {
          callback(true, data.results[0]);
        } else {
          callback(false);
        }
      }
    })
    .catch(error => {
      console.error(error);
      callback(false, error);
    });
}

export const LocationServices = {
  hasLocationPermission,
  getLocation,
  getPlaceDetailsFromCoordinate,
};

import React, {Component} from 'react';
import {store, persistor} from './store';
import {StatusBar} from 'react-native';
import {BaseColor} from '@config';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import Navigation from './navigation';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import messaging from '@react-native-firebase/messaging';

console.disableYellowBox = true;

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    StatusBar.setBackgroundColor(BaseColor.primaryColor, true);

    await messaging().registerDeviceForRemoteMessages();
    await messaging().requestPermission();
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SafeAreaProvider>
            <Navigation />
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    );
  }
}

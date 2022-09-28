import React, {Component} from 'react';
import {connect} from 'react-redux';
import {AuthActions} from '@actions';
import {ActivityIndicator, View, StatusBar} from 'react-native';
import {bindActionCreators} from 'redux';
import {Images, BaseColor} from '@config';
import SplashScreen from 'react-native-splash-screen';
import {Image} from '@components';
import styles from './styles';
import {useFocusEffect} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';

function FocusEffect({auth, navigation}) {
  useFocusEffect(
    React.useCallback(() => {
      const status = auth.login.success;
      switch (status && auth.user !== undefined) {
        case true:
          setTimeout(() => {
            navigation.navigate('Main', {screen: 'DashboardStack'});
          }, 500);
          break;
        case false:
          setTimeout(() => {
            navigation.navigate('Walkthrough');
          }, 500);
          break;
        default:
          break;
      }

      return;
    }, [auth, navigation])
  );

  return null;
}

class Loading extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    SplashScreen.hide();

    this.initNotification();
  }

  initNotification() {
    // notification opened
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification caused app to open from background state:', remoteMessage);
      this.handleNotification(remoteMessage);
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('Notification caused app to open from quit state:', remoteMessage);
          this.handleNotification(remoteMessage);
        }
      });
  }

  handleNotification(remoteMessage) {
    console.log('--------------', remoteMessage.data.type);
  }

  render() {
    const {navigation, auth} = this.props;
    return (
      <>
        <FocusEffect navigation={navigation} auth={auth} />
        <StatusBar hidden={true} />
        <View style={styles.container}>
          <Image source={Images.logo} style={styles.logo} resizeMode="contain" />
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={BaseColor.whiteColor} style={styles.loading} />
          </View>
        </View>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(AuthActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Loading);

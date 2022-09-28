import React, {Component} from 'react';
import {View, ScrollView, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {AuthActions} from '@actions';
import {BaseStyle, BaseColor, BaseSetting, Images} from '@config';
import {Header, SafeAreaView, Icon, Text, Button, Image} from '@components';
import styles from './styles';
import {useFocusEffect} from '@react-navigation/native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {UserServices} from '../../services';

function FocusProfile({onFocus}) {
  useFocusEffect(
    React.useCallback(() => {
      onFocus();
      return;
    }, [onFocus])
  );

  return null;
}

class Profile extends Component {
  constructor(props) {
    super();
    this.state = {
      loading: false,
      userData: {
        email: '',
        average_rating: '',
        first_name: '',
        last_name: '',
        location: '',
        latitude: '',
        longitude: '',
        profile_image: '',
      },
    };
  }

  fetchProfileData = () => {
    const {auth} = this.props;

    this.setState({refreshing: true});
    UserServices.getProfileData(auth.user.token)
      .then(response => {
        if (response.data.success === 1) {
          this.handleUpdate(true, response.data);
        } else {
          this.handleUpdate(false, response.data.msg);
        }
      })
      .catch(error => {
        this.handleUpdate(false, error.response);
      });
  };

  handleUpdate = (result, response) => {
    // console.log('Profile handleUpdate ----------', response);
    if (result) {
      this.setState({userData: response.data});
    } else {
    }
    this.setState({refreshing: false});
  };

  onLogOut() {
    const {actions, navigation} = this.props;

    actions.logout(response => {
      console.log('------- logout response', response);
      if (response.success) {
        navigation.navigate('Loading');
      } else {
        console.log(response.msg);
      }
    });
  }

  onCancel = () => {
    this.RBSheet.close();
  };

  onOK = () => {
    this.RBSheet.close();
    this.onLogOut();
  };

  renderPopup() {
    return (
      <RBSheet
        ref={ref => {
          this.RBSheet = ref;
        }}
        height={300}
        closeOnDragDown={true}
        dragFromTopOnly={true}
        openDuration={500}
        customStyles={{
          container: {
            alignItems: 'center',
            backgroundColor: BaseColor.fieldColor,
            paddingHorizontal: 10,
          },
          draggableIcon: {
            backgroundColor: BaseColor.primaryColor,
          },
        }}>
        <View>
          <Text style={styles.popupTitle}>Are you sure you want to sign out?</Text>
          <View style={styles.bottomButtonGroup}>
            <TouchableOpacity style={styles.bottomButton} onPress={this.onCancel}>
              <Text style={styles.bottomButtonText}>Keep signed in</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.bottomButton} onPress={this.onOK}>
              <Text style={styles.bottomButtonText}>Sign out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </RBSheet>
    );
  }

  render() {
    const {navigation, auth} = this.props;
    const {userData} = this.state;
    const loading = auth.login && auth.login.isLoading;
    return (
      <>
        <FocusProfile onFocus={this.fetchProfileData} />
        <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'never'}}>
          <Header
            title="Profile"
            renderLeft={() => {
              return <Icon name="arrow-left" size={20} color={BaseColor.headerIconColor} />;
            }}
            onPressLeft={() => {
              navigation.goBack();
            }}
          />
          {this.renderPopup()}
          <ScrollView>
            <View style={styles.contain}>
              <View style={{alignItems: 'center'}}>
                <Image source={userData.profile_image ? {uri: userData.profile_image} : Images.defaultAvatar} style={styles.image} />
                <Text title1 semibold>
                  {userData.first_name + ' ' + userData.last_name}
                </Text>
                <Text subhead grayColor>
                  {userData.email}
                </Text>
                <View style={styles.location}>
                  <Icon name="map-marker-alt" size={16} color={BaseColor.primaryColor} />
                  <Text caption1 primaryColor style={{marginLeft: 3}}>
                    {userData.location}
                  </Text>
                </View>
              </View>
              <View style={{width: '100%'}}>
                <TouchableOpacity
                  style={styles.profileItem}
                  onPress={() => {
                    navigation.navigate('ProfileEdit', {
                      profileData: userData,
                    });
                  }}>
                  <Text body1>Edit Profile</Text>
                  <Icon name="angle-right" size={18} color={BaseColor.primaryColor} style={styles.profileItemIcon} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.profileItem}
                  onPress={() => {
                    navigation.navigate('ChangePassword');
                  }}>
                  <Text body1>Change Password</Text>
                  <Icon name="angle-right" size={18} color={BaseColor.primaryColor} style={styles.profileItemIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.profileItem} onPress={() => navigation.navigate('MyPaymentMethod')}>
                  <Text body1>My Cards</Text>
                  <Icon name="angle-right" size={18} color={BaseColor.primaryColor} style={styles.profileItemIcon} />
                </TouchableOpacity>
                <View style={styles.profileItem}>
                  <Text body1>App Version</Text>
                  <Text body1 grayColor>
                    {BaseSetting.appVersion}
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
          <View style={styles.bottomButtonContainer}>
            <Button full loading={loading} onPress={() => this.RBSheet.open()}>
              Sign Out
            </Button>
          </View>
        </SafeAreaView>
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

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

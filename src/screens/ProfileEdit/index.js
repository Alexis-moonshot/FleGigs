import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {AuthActions} from '@actions';
import {View, ScrollView, TextInput, TouchableOpacity, ActivityIndicator} from 'react-native';
import {BaseStyle, BaseColor, Images} from '@config';
import {Image, Header, SafeAreaView, Icon, Text, Button} from '@components';
import styles from './styles';
import {useFocusEffect} from '@react-navigation/native';
import {UserServices} from '../../services';
import {showMessage} from 'react-native-flash-message';
import storage from '@react-native-firebase/storage';
import fbauth from '@react-native-firebase/auth';
import {launchImageLibrary} from 'react-native-image-picker';

function FocusProfileEdit({onFocus}) {
  useFocusEffect(
    React.useCallback(() => {
      onFocus();
      return;
    }, [onFocus])
  );

  return null;
}

class ProfileEdit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uploading: false,
      userData: {
        email: '',
        user_id: '',
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
    const {profileData} = this.props.route.params;

    this.setState({userData: profileData});
  };

  onSave = () => {
    const {auth, actions} = this.props;
    const {userData} = this.state;

    this.setState({saving: true});
    const body = {
      first_name: userData.first_name,
      last_name: userData.last_name,
      location: userData.location,
      latitude: userData.latitude,
      longitude: userData.longitude,
    };
    UserServices.updateProfile(body, auth.user.token)
      .then(response => {
        if (response.data.success === 1) {
          showMessage({
            message: response.data.msg,
            type: 'success',
            icon: 'auto',
            duration: 10000,
          });
          actions.updateName(userData.first_name + ' ' + userData.last_name);
        } else {
          console.log(response.data.msg);
          showMessage({
            message: response.data.msg,
            type: 'danger',
            icon: 'auto',
            duration: 10000,
          });
        }
      })
      .catch(error => {
        console.log(error);
        showMessage({
          message: 'Something went wrong while saving profile',
          type: 'success',
          icon: 'auto',
          duration: 10000,
        });
      })
      .finally(() => {
        this.setState({saving: false});
      });
  };

  onChooseFile = () => {
    var options = {
      mediaType: 'photo',
      maxWidth: 512,
      maxHeight: 512,
      allowsEditing: true,
      quality: 0.5,
    };

    launchImageLibrary(options, response => {
      if (response.assets) {
        this.setState({uploading: true});
        this.saveProfileImage(response.assets[0]);
      }
    });
  };

  saveProfileImage = photo => {
    const {auth, actions} = this.props;

    fbauth()
      .signInAnonymously()
      .then(() => {
        const reference = storage().ref('profile_images/user_' + auth.user.user_id);
        const task = reference.putFile(photo.uri);

        task.then(() => {
          reference.getDownloadURL().then(url => {
            const body = {file_name: url};
            UserServices.updateProfileImage(body, auth.user.token)
              .then(response => {
                if (response.data.success === 1) {
                  this.setState({
                    userData: {...this.state.userData, profile_image: url},
                  });
                  actions.saveProfileImage(response.data.profile_image);
                } else {
                  console.log(response.data.msg);
                }
              })
              .catch(error => {
                console.log(error);
              })
              .finally(() => {
                this.setState({uploading: false});
              });
          });
        });
      })
      .catch(error => {
        console.error(error);
      });
  };

  render() {
    const {navigation} = this.props;
    const {userData, saving, uploading} = this.state;
    return (
      <>
        <FocusProfileEdit onFocus={this.fetchProfileData} />
        <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'never'}}>
          <Header
            title="Edit Profile"
            renderLeft={() => {
              return <Icon name="arrow-left" size={20} color={BaseColor.headerIconColor} />;
            }}
            onPressLeft={() => {
              navigation.goBack();
            }}
          />
          <ScrollView>
            <View style={styles.contain}>
              <View>
                <Image
                  source={userData.profile_image ? {uri: userData.profile_image} : Images.defaultAvatar}
                  style={styles.avatar}
                  // resizeMode="contain"
                />
                <TouchableOpacity style={styles.camera} activeOpacity={0.9} disabled={uploading} onPress={this.onChooseFile}>
                  {uploading ? (
                    <ActivityIndicator size="large" color={'white'} />
                  ) : (
                    <Icon name="pen" size={24} color={BaseColor.primaryColor} />
                  )}
                </TouchableOpacity>
              </View>
              <View style={styles.contentTitle}>
                <Text headline semibold>
                  First name
                </Text>
              </View>
              <TextInput
                style={BaseStyle.textInput}
                onChangeText={text => this.setState({userData: {...userData, first_name: text}})}
                autoCorrect={false}
                placeholder="First name"
                placeholderTextColor={BaseColor.grayColor}
                value={userData.first_name}
                selectionColor={BaseColor.primaryColor}
                maxLength={20}
                autoCompleteType={'name'}
                textContentType={'givenName'}
                editable={false}
              />
              <View style={styles.contentTitle}>
                <Text headline semibold>
                  Last name
                </Text>
              </View>
              <TextInput
                style={BaseStyle.textInput}
                onChangeText={text => this.setState({userData: {...userData, last_name: text}})}
                autoCorrect={false}
                placeholder="Last name"
                placeholderTextColor={BaseColor.grayColor}
                value={userData.last_name}
                selectionColor={BaseColor.primaryColor}
                maxLength={20}
                autoCompleteType={'name'}
                textContentType={'familyName'}
                editable={false}
              />
              <View style={styles.contentTitle}>
                <Text headline semibold>
                  Location
                </Text>
              </View>
              <TextInput
                style={BaseStyle.textInput}
                onChangeText={text => this.setState({userData: {...userData, location: text}})}
                autoCorrect={false}
                placeholder="Input Address"
                placeholderTextColor={BaseColor.grayColor}
                value={userData.location}
                selectionColor={BaseColor.primaryColor}
              />
            </View>
          </ScrollView>
          <View style={styles.bottomButtonContainer}>
            <Button loading={saving} disabled={saving} full onPress={this.onSave}>
              Save
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

export default connect(mapStateToProps, mapDispatchToProps)(ProfileEdit);

import React, {Component} from 'react';
import {View, TouchableOpacity, TextInput, Platform} from 'react-native';
import {connect} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import {BaseStyle, BaseColor} from '@config';
import {showMessage} from 'react-native-flash-message';
import {Header, SafeAreaView, Icon, Text, Button, SegmentButton, Image} from '@components';
import styles from './styles';
import {LocationServices, UserServices} from '../../services';
import storage from '@react-native-firebase/storage';
import fbauth from '@react-native-firebase/auth';
import {launchImageLibrary} from 'react-native-image-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const difficulties = [
  {id: '0', title: 'Easy', selectedStyle: {backgroundColor: '#11BB55'}},
  {id: '1', title: 'Medium', selectedStyle: {backgroundColor: '#909E30'}},
  {id: '2', title: 'Hard', selectedStyle: {backgroundColor: '#EF3011'}},
];

const genders = [
  {id: '0', title: 'Male', selectedStyle: {backgroundColor: '#56B6DE'}},
  {id: '1', title: 'Female', selectedStyle: {backgroundColor: '#F286A0'}},
  {id: '2', title: 'Any', selectedStyle: {backgroundColor: '#909E30'}},
];

const yesno = [
  {id: '0', title: 'Yes', selectedStyle: {backgroundColor: '#56B6DE'}},
  {id: '1', title: 'No', selectedStyle: {backgroundColor: '#F286A0'}},
];

function FocusPostJob({onFocus}) {
  useFocusEffect(
    React.useCallback(() => {
      onFocus();
      return;
    }, [onFocus])
  );

  return null;
}

const initialState = {
  short_desc: '',
  helpers: 1,
  duration: '',
  monetary: '',
  location: '',
  latitude: 30.310931,
  longitude: -81.70577,
  difficulty: 0,
  gender: 2,
  tools: '',
  vehicle: 0,
  posting: false,
  job_image: '',
};

class PostJob extends Component {
  constructor(props) {
    super(props);
    this.state = {...initialState};
  }

  componentDidMount() {
    // this.checkLocation();
  }

  onFocus = () => {
    // console.log('onFocus', this.props.route.params.type);
    const {type, jobData, locationData, result} = this.props.route.params;
    if (type && type === 'repost') {
      this.setState(
        {
          short_desc: jobData.short_description,
          helpers: parseInt(jobData.no_of_helper, 10),
          gender: jobData.gender_preference === 'Any' ? 2 : jobData.gender_preference === 'Female' ? 1 : 0,
          difficulty: jobData.difficulty_level === 'Easy' ? 0 : jobData.difficulty_level === 'Medium' ? 1 : 2,
          duration: jobData.duration,
          latitude: parseFloat(jobData.latitude, 10),
          longitude: parseFloat(jobData.longitude, 10),
          location: jobData.location,
          monetary: jobData.monitary_compensation,
          vehicle: parseInt(jobData.vehicle, 10),
          tools: jobData.tools,
        },
        () => {
          if (this.state.location === '') {
            this.checkLocation();
          }
        }
      );
    } else if (type === 'set_location') {
      if (result) {
        this.setState(
          {
            ...this.state,
            ...locationData,
          },
          () => {
            if (this.state.location === '') {
              this.checkLocation();
            }
          }
        );
      } else {
        // console.log(this.state);
      }
    } else {
      this.setState(
        {
          ...initialState,
        },
        () => {
          if (this.state.location === '') {
            this.checkLocation();
          }
        }
      );
    }
  };

  checkLocation() {
    LocationServices.getLocation((success, result) => {
      if (success) {
        this.setState({
          latitude: result.coords.latitude,
          longitude: result.coords.longitude,
        });
        LocationServices.getPlaceDetailsFromCoordinate(
          result.coords.latitude,
          result.coords.longitude,
          (geocode_success, geocode_result) => {
            if (geocode_success) {
              this.setState({location: geocode_result.formatted_address});
            } else {
              // this.setState({ location: 'Unable to fetch location' });
            }
          }
        );
      } else {
      }
    });
  }

  onJobPost = async () => {
    if (!this.checkInput()) {
      return;
    }

    try {
      const cardResponse = await UserServices.getSavedCard(auth.user.token);
      if (cardResponse.data.success === 1 && cardResponse.data.data?.length > 1) {
      } else {
        throw "Please add card before posting job.";
      }
    } catch (error) {
      showMessage({
        message: 'Please add card before posting job.',
        type: 'warning',
        icon: 'auto',
        duration: 10000,
      });
      this.props.navigation.navigate('MyPaymentMethod');
      return;
    }

    const {short_desc, helpers, duration, monetary, location, latitude, longitude, difficulty, gender, tools, vehicle, job_image} =
      this.state;
    const {auth} = this.props;

    this.setState({posting: true});
    if (job_image === '') {
      const body = {
        short_description: short_desc,
        no_of_helper: helpers,
        estimate_time: duration,
        compensation: monetary,
        location: location,
        latitude: latitude,
        longitude: longitude,
        difficulty_level: difficulties[difficulty].title,
        gender: genders[gender].title,
        tools: tools,
        vehicle: vehicle,
        radius_range: '',
        source: Platform.OS,
        job_image: '',
      };

      UserServices.postJob(body, auth.user.token)
        .then(response => {
          // console.log(response);
          if (response.data.success === 1) {
            this.handlePostJobResult(true, response.data);
          } else {
            this.handlePostJobResult(false, response.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
          this.handlePostJobResult(false, 'Server error');
        });
    } else {
      const job_image_url = 'job_images/' + uuidv4();
      fbauth()
        .signInAnonymously()
        .then(() => {
          const reference = storage().ref(job_image_url);
          const task = reference.putFile(Platform.OS === 'ios' ? job_image.replace('file://', '') : job_image);

          task.then(() => {
            reference
              .getDownloadURL()
              .then(url => {
                const body = {
                  short_description: short_desc,
                  no_of_helper: helpers,
                  estimate_time: duration,
                  compensation: monetary,
                  location: location,
                  latitude: latitude,
                  longitude: longitude,
                  difficulty_level: difficulties[difficulty].title,
                  gender: genders[gender].title,
                  tools: tools,
                  vehicle: vehicle,
                  radius_range: '',
                  source: Platform.OS,
                  job_image: url,
                };

                UserServices.postJob(body, auth.user.token)
                  .then(response => {
                    // console.log(response);
                    if (response.data.success === 1) {
                      this.handlePostJobResult(true, response.data);
                    } else {
                      this.handlePostJobResult(false, response.data.msg);
                    }
                  })
                  .catch(error => {
                    console.log(error);
                    this.handlePostJobResult(false, error.response);
                  });
              })
              .catch(error => {
                console.log(error);
                this.setState({posting: false});
              });
          });
        })
        .catch(error => {
          console.error(error);
          this.setState({posting: false});
        });
    }
  };

  handlePostJobResult(success, result) {
    this.setState({posting: false});
    if (success) {
      const {navigation} = this.props;
      showMessage({
        message: 'Job posted successfully',
        type: 'success',
        icon: 'auto',
        duration: 10000,
      });
      navigation.navigate('MyJobs');
    } else {
      showMessage({
        message: result,
        type: 'warning',
        icon: 'auto',
        duration: 10000,
      });
    }
  }

  checkInput() {
    const {short_desc, duration, monetary, location} = this.state;

    if (short_desc.length === 0) {
      showMessage({
        message: 'Please input job description',
        type: 'danger',
        icon: 'auto',
      });
      return false;
    }
    if (duration.length === 0) {
      showMessage({
        message: 'Please input duration',
        type: 'danger',
        icon: 'auto',
      });
      return false;
    }
    if (monetary.length === 0) {
      showMessage({
        message: 'Please input monetary compensation',
        type: 'danger',
        icon: 'auto',
      });
      return false;
    }
    if (location.length === 0) {
      showMessage({
        message: 'Please select location',
        type: 'danger',
        icon: 'auto',
      });
      return false;
    }
    return true;
  }

  onSelectDifficulty(index) {
    this.setState({difficulty: index});
  }

  onSelectGender(index) {
    this.setState({gender: index});
  }

  onSelectVehicle(index) {
    this.setState({vehicle: index});
  }

  onSetLocation = () => {
    const {navigation} = this.props;

    navigation.navigate('SetLocation', {
      coordinate: {
        latitude: this.state.latitude,
        longitude: this.state.longitude,
      },
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
        this.setState({job_image: response.assets[0].uri});
      }
    });
  };

  render() {
    const {navigation} = this.props;
    const {helpers, difficulty, gender, vehicle, tools, duration, monetary, short_desc, location, posting, job_image} = this.state;
    return (
      <>
        <FocusPostJob onFocus={this.onFocus} />
        <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'never'}}>
          <Header
            title="Post New Job"
            renderLeft={() => {
              return <Icon name="arrow-left" size={20} color={BaseColor.headerIconColor} />;
            }}
            onPressLeft={() => {
              navigation.goBack();
            }}
          />
          <KeyboardAwareScrollView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            getTextInputRefs={() => {
              return [this._textInputRef];
            }}>
            <View
              style={{
                paddingHorizontal: 20,
                marginBottom: 20,
              }}>
              <Text headline semibold numberOfLines={1} style={{color: BaseColor.primaryColor, marginTop: 15}}>
                Short Description
              </Text>
              <TextInput
                style={[BaseStyle.textInput, styles.editDescription]}
                onChangeText={text => this.setState({short_desc: text})}
                autoCorrect={false}
                placeholder="Enter Short Description"
                placeholderTextColor={BaseColor.grayColor}
                value={short_desc}
                selectionColor={BaseColor.primaryColor}
                multiline={true}
              />
              <Text headline semibold numberOfLines={1} style={{marginTop: 20, color: BaseColor.primaryColor}}>
                Difficulty Level
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  paddingTop: 20,
                  justifyContent: 'center',
                }}>
                <SegmentButton data={difficulties} onPress={index => this.onSelectDifficulty(index)} selected={difficulty} />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text
                  headline
                  semibold
                  numberOfLines={1}
                  style={{
                    color: BaseColor.primaryColor,
                    marginTop: 30,
                  }}>
                  No of Helpers Needed
                </Text>
                <View style={{flexDirection: 'row', marginTop: 30}}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        helpers: helpers - 1 > 1 ? helpers - 1 : 1,
                      });
                    }}>
                    <Icon name="minus-circle" size={24} color={BaseColor.grayColor} />
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontSize: 20,
                      lineHeight: 27,
                      marginHorizontal: 10,
                    }}>
                    {helpers}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        helpers: helpers + 1,
                      });
                    }}>
                    <Icon name="plus-circle" size={24} color={'#ff0000'} />
                  </TouchableOpacity>
                </View>
              </View>
              <Text headline semibold numberOfLines={1} style={{marginTop: 20, color: BaseColor.primaryColor}}>
                Gender Preference
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  paddingTop: 20,
                  justifyContent: 'center',
                }}>
                <SegmentButton data={genders} onPress={index => this.onSelectGender(index)} selected={gender} />
              </View>
              <Text headline semibold numberOfLines={1} style={{marginTop: 20, color: BaseColor.primaryColor}}>
                Tools required
              </Text>
              <TextInput
                style={[
                  BaseStyle.textInput,
                  {
                    backgroundColor: '#ffffff',
                    borderBottomColor: BaseColor.grayColor,
                    borderBottomWidth: 1,
                    borderRadius: 0,
                  },
                ]}
                onChangeText={text => this.setState({tools: text})}
                autoCorrect={false}
                placeholder="Enter needed tools"
                placeholderTextColor={BaseColor.grayColor}
                value={tools}
                selectionColor={BaseColor.primaryColor}
              />
              <Text headline semibold numberOfLines={1} style={{marginTop: 20, color: BaseColor.primaryColor}}>
                Vehicle required
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  paddingTop: 20,
                  justifyContent: 'center',
                }}>
                <SegmentButton data={yesno} onPress={index => this.onSelectVehicle(index)} selected={vehicle} />
              </View>
              <Text headline semibold numberOfLines={1} style={{color: BaseColor.primaryColor, marginTop: 20}}>
                Average duration by hour
              </Text>
              <TextInput
                style={[
                  BaseStyle.textInput,
                  {
                    backgroundColor: '#ffffff',
                    borderBottomColor: BaseColor.grayColor,
                    borderBottomWidth: 1,
                    borderRadius: 0,
                  },
                ]}
                onChangeText={text => this.setState({duration: text.replace(/[^0-9]/g, '')})}
                autoCorrect={false}
                placeholder="Enter duration"
                placeholderTextColor={BaseColor.grayColor}
                keyboardType={'numeric'}
                value={duration}
                selectionColor={BaseColor.primaryColor}
              />
              <View style={{marginTop: 30}}>
                <Text headline semibold numberOfLines={1} style={{color: BaseColor.primaryColor}}>
                  Monetary Compensation
                </Text>
                <View style={styles.monetary}>
                  <Text>$</Text>
                  <TextInput
                    style={[
                      BaseStyle.textInput,
                      {
                        backgroundColor: '#ffffff',
                      },
                    ]}
                    onChangeText={text => this.setState({monetary: text})}
                    autoCorrect={false}
                    placeholder="0.00"
                    placeholderTextColor={BaseColor.grayColor}
                    keyboardType={'numeric'}
                    value={monetary}
                    selectionColor={BaseColor.primaryColor}
                  />
                </View>
              </View>
              <Text headline semibold numberOfLines={1} style={{color: BaseColor.primaryColor, marginTop: 30}}>
                Location
              </Text>
              <TouchableOpacity activeOpacity={0.9} onPress={this.onSetLocation} style={styles.locationButton}>
                <Text
                  numberOfLines={1}
                  style={[
                    BaseStyle.textInput,
                    {
                      backgroundColor: '#ffffff',
                    },
                  ]}>
                  {location ? location : 'Tap to set location'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.onChooseFile} style={styles.jobImageContainer}>
                {job_image === '' ? (
                  <>
                    <Icon name="camera" size={24} color={BaseColor.grayColor} />
                    <Text style={{marginLeft: 20}}>Upload job image</Text>
                  </>
                ) : (
                  <Image source={{uri: 'file://' + job_image}} style={styles.jobImage} resizeMode="stretch" />
                )}
              </TouchableOpacity>
            </View>
            <View style={{padding: 20}}>
              <Button full onPress={this.onJobPost} loading={posting} disabled={posting}>
                Post
              </Button>
            </View>
          </KeyboardAwareScrollView>
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
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(PostJob);

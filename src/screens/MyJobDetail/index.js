import React, {Component} from 'react';
import {View, ScrollView, TouchableOpacity, ActivityIndicator} from 'react-native';
import {connect} from 'react-redux';
import {BaseStyle, BaseColor} from '@config';
import {Header, SafeAreaView, Icon, Text, Button, HelperListItem, Image} from '@components';
import styles from './styles';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {UserServices} from '../../services';
import RBSheet from 'react-native-raw-bottom-sheet';
import {showMessage} from 'react-native-flash-message';
import messaging from '@react-native-firebase/messaging';

function FetchJobDetail({onFocus}) {
  useFocusEffect(
    React.useCallback(() => {
      onFocus();
      return;
    }, [onFocus])
  );

  return null;
}

class _MyJobDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jobDetail: {},
      short_desc: '',
      helpers: [],
      duration: '',
      monetary: '',
      location: '',
    };
  }

  componentDidMount() {
    this.initNotification();
  }

  initNotification() {
    // foreground
    messaging().onMessage(async remoteMessage => {
      const {isFocused} = this.props;
      if (isFocused) {
        console.log('A new FCM message arrived from MyJobDetail', remoteMessage);
        if (remoteMessage.data.type === 'job_declined_by_all_helper') {
          this.onFocus();
        } else if (remoteMessage.data.type === 'job_declined_by_timeout') {
          this.onFocus();
        } else if (remoteMessage.data.type === 'acceptjob') {
          this.onFocus();
        }
      }
    });
  }

  handleUpdate = (result, response) => {
    console.log('MyJobDetail handleUpdate ----------', response);
    if (result) {
      this.setState({
        jobDetail: response.job_details[0],
        helpers: response.helper_details,
      });
    } else {
      console.log(response);
    }
    this.setState({refreshing: false});
  };

  onFocus = () => {
    this.setState({refreshing: true});

    const {auth} = this.props;
    const {jobData} = this.props.route.params;

    const body = {
      job_id: jobData.id,
    };
    UserServices.getJobDetail(body, auth.user.token)
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

  onPressRight = () => {
    const {jobDetail} = this.state;
    if (jobDetail.job_status === '0' || jobDetail.job_status === '1') {
      this.RBSheet.open();
    } else if (jobDetail.job_status === '-1') {
      this.onRepost();
    }
  };

  onRepost() {
    const {jobDetail} = this.state;
    const {navigation} = this.props;

    navigation.navigate('PostJob', {
      type: 'repost',
      jobData: jobDetail,
    });
  }

  onCancel = () => {
    this.RBSheet.close();
  };

  onOK = () => {
    this.RBSheet.close();
    this.setState({cancelling: true});

    const {jobDetail} = this.state;
    const {navigation, auth} = this.props;
    const body = {
      job_id: jobDetail.id,
    };
    UserServices.cancelJob(body, auth.user.token)
      .then(response => {
        if (response.data.success === 1) {
          showMessage({
            message: response.data.msg,
            type: 'success',
            icon: 'auto',
            duration: 10000,
          });
          navigation.navigate('Dashboard');
        } else {
          showMessage({
            message: response.data.msg,
            type: 'warning',
            icon: 'auto',
            duration: 10000,
          });
        }
      })
      .catch(error => {
        console.log(error.response);
      })
      .finally(() => {
        this.setState({cancelling: false});
      });
  };

  onStartJob = () => {
    this.setState({starting: true});
    const {jobDetail} = this.state;
    const {auth} = this.props;
    const body = {
      job_id: jobDetail.id,
    };
    UserServices.startJob(body, auth.user.token)
      .then(response => {
        if (response.data.success === 1) {
          showMessage({
            message: response.data.msg,
            type: 'success',
            icon: 'auto',
            duration: 10000,
          });
          this.setState({
            starting: false,
            jobDetail: {...jobDetail, job_status: '1'},
          });
        } else {
          console.log(response.data.msg);
        }
      })
      .catch(error => {
        console.log(error.response);
      })
      .finally(() => {
        this.setState({starting: false});
      });
  };

  onEndJob = () => {
    this.setState({ending: true});
    const {jobDetail} = this.state;
    const {auth, navigation} = this.props;
    const body = {
      job_id: jobDetail.id,
    };
    UserServices.endJob(body, auth.user.token)
      .then(response => {
        // console.log(response.data);
        if (response.data.success === 1) {
          showMessage({
            message: response.data.msg,
            type: 'success',
            icon: 'auto',
            duration: 10000,
          });
          navigation.navigate('JobRating', {jobData: jobDetail});
        } else {
          console.log(response.data.msg);
        }
      })
      .catch(error => {
        console.log(error.response);
      })
      .finally(() => {
        this.setState({ending: false});
      });
  };

  onRating = () => {
    const {navigation} = this.props;
    const {jobDetail} = this.state;

    navigation.navigate('JobRating', {jobData: jobDetail});
  };

  onPay = () => {
    this.setState({paying: true});
    const {jobDetail} = this.state;
    const {navigation, auth} = this.props;
    const body = {
      job_id: jobDetail.id,
    };
    UserServices.payToEscrow(body, auth.user.token)
      .then(response => {
        console.log(response.data);
        if (response.data.success === 1) {
          showMessage({
            message: response.data.status,
            type: 'success',
            icon: 'auto',
            duration: 10000,
          });
          this.setState({
            refreshing: false,
            jobDetail: {...jobDetail, payment_status: 1},
          });
        } else {
          showMessage({
            message: response.data.status,
            type: 'warning',
            icon: 'auto',
            duration: 10000,
          });
          navigation.navigate('MyPaymentMethod');
        }
      })
      .catch(error => {
        console.log(error.response);
      })
      .finally(() => {
        this.setState({paying: false});
      });
  };

  onCheckArrived(helper, index) {
    const {jobDetail} = this.state;
    const {auth} = this.props;
    const body = {
      job_id: jobDetail.id,
      helper_id: helper.user_id,
    };
    this.setState({
      helpers: this.state.helpers.map((item, i) => {
        if (i === index) {
          return {...item, loading: true};
        } else {
          return item;
        }
      }),
    });
    UserServices.helperArrived(body, auth.user.token)
      .then(response => {
        console.log(response.data);
        if (response.data.success === 1) {
          showMessage({
            message: response.data.msg,
            type: 'success',
            icon: 'auto',
            duration: 10000,
          });
          this.setState({
            helpers: this.state.helpers.map((item, i) => {
              if (i === index) {
                return {...item, helper_status: '1'};
              } else {
                return item;
              }
            }),
          });
        } else {
          console.log(response.data.msg);
        }
      })
      .catch(error => {
        console.log(error.response);
      })
      .finally(() => {
        this.setState({
          helpers: this.state.helpers.map((item, i) => {
            if (i === index) {
              return {...item, loading: false};
            } else {
              return item;
            }
          }),
        });
      });
  }

  onTrack(helper) {
    const {navigation} = this.props;
    const {jobDetail} = this.state;

    navigation.navigate('TrackHelperMap', {
      jobData: jobDetail,
      helperData: helper,
    });
  }

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
          <Text style={styles.popupTitle}>Are you sure you want to cancel this job?</Text>
          <View style={styles.bottomButtonGroup}>
            <TouchableOpacity style={styles.bottomButton} onPress={this.onCancel}>
              <Text style={styles.bottomButtonText}>Keep</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.bottomButton} onPress={this.onOK}>
              <Text style={styles.bottomButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </RBSheet>
    );
  }

  renderBottomButtons() {
    const {navigation} = this.props;
    const {jobDetail, helpers, cancelling, paying, starting, ending} = this.state;
    if (jobDetail.payment_status !== 1) {
      if (jobDetail.job_status !== '-1') {
        return (
          <>
            <Button full onPress={this.onPressRight} loading={cancelling} style={{flex: 1, marginRight: 10, alignItems: 'center'}}>
              Decline
            </Button>
            <Button
              full
              onPress={this.onPay}
              loading={paying}
              disabled={helpers.length === 0 || paying}
              style={[
                {flex: 1, marginLeft: 10, backgroundColor: '#ff0000'},
                (helpers.length === 0 || paying) && {
                  backgroundColor: BaseColor.grayColor,
                },
              ]}>
              Start Job
            </Button>
          </>
        );
      }
    } else {
      return (
        <>
          {(jobDetail.job_status === '0' || jobDetail.job_status === '1') && (
            <Button
              full
              onPress={() => navigation.navigate('Messages', {jobData: jobDetail})}
              style={{flex: 1, marginRight: 10, alignItems: 'center'}}>
              <Icon style={{marginRight: 20}} name="rocketchat" size={24} color={'#ffffff'} />
              {' Chat'}
            </Button>
          )}
          {jobDetail.job_status === '0' && (
            <Button full onPress={this.onStartJob} loading={starting} style={{flex: 1, marginLeft: 10, backgroundColor: '#ff0000'}}>
              Start Job
            </Button>
          )}
          {jobDetail.job_status === '1' && (
            <Button full onPress={this.onEndJob} loading={ending} style={{flex: 1, marginLeft: 10, backgroundColor: '#ff0000'}}>
              End Job
            </Button>
          )}
          {jobDetail.job_status === '2' && (
            <Button full onPress={this.onRating} style={{flex: 1}}>
              {'Rating & Review'}
            </Button>
          )}
        </>
      );
    }
  }

  render() {
    const {navigation} = this.props;
    const {jobData} = this.props.route.params;
    const {helpers, jobDetail, refreshing} = this.state;

    return (
      <>
        <FetchJobDetail onFocus={this.onFocus} />
        <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'never'}}>
          <Header
            title="Job Details"
            subTitle={`#${jobData.job_id}`}
            renderLeft={() => {
              return <Icon name="arrow-left" size={20} color={BaseColor.headerIconColor} />;
            }}
            renderRight={() => {
              return (
                <Text style={{color: BaseColor.headerIconColor}}>
                  {(jobDetail.job_status === '0' || jobDetail.job_status === '1') && 'Cancel'}
                  {jobDetail.job_status === '-1' && 'Repost'}
                </Text>
              );
            }}
            onPressLeft={() => {
              navigation.goBack();
            }}
            onPressRight={this.onPressRight}
          />
          {this.renderPopup()}
          {refreshing ? (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <ActivityIndicator size="large" />
            </View>
          ) : (
            <>
              <ScrollView>
                <View
                  style={{
                    paddingHorizontal: 20,
                    marginBottom: 20,
                  }}>
                  <Text title3 numberOfLines={1} style={{marginTop: 15}}>
                    {jobDetail.short_description}
                  </Text>
                  <View>
                    <View style={styles.detailItem}>
                      <Text headline semibold numberOfLines={1} style={{color: BaseColor.primaryColor}}>
                        Difficulty Level
                      </Text>
                      <Text headline semibold numberOfLines={1} style={{textAlign: 'right'}}>
                        {jobDetail.difficulty_level}
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text headline semibold numberOfLines={1} style={{color: BaseColor.primaryColor}}>
                        Duration Estimate
                      </Text>
                      <Text headline semibold numberOfLines={1} style={{textAlign: 'right'}}>
                        {jobDetail.duration} hr
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text headline semibold numberOfLines={1} style={{color: BaseColor.primaryColor}}>
                        Gender Preference
                      </Text>
                      <Text headline semibold numberOfLines={1} style={{textAlign: 'right'}}>
                        {jobDetail.gender_preference}
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text headline semibold numberOfLines={1} style={{color: BaseColor.primaryColor}}>
                        Monetary Compensation
                      </Text>
                      <Text headline semibold numberOfLines={1} style={{textAlign: 'right'}}>
                        $ {jobDetail.monitary_compensation} / helper
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text headline semibold numberOfLines={1} style={{color: BaseColor.primaryColor}}>
                        Vehicle required
                      </Text>
                      <Text headline semibold numberOfLines={3} style={{textAlign: 'right'}}>
                        {jobDetail.vehicle ? 'Yes' : 'No'}
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text headline semibold numberOfLines={1} style={{color: BaseColor.primaryColor}}>
                        Tools required
                      </Text>
                      <Text headline semibold numberOfLines={3} style={{textAlign: 'right'}}>
                        {jobDetail.tools ? jobDetail.tools : 'Not Specified'}
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <View style={{}}>
                        <Text headline semibold numberOfLines={1} style={{color: BaseColor.primaryColor}}>
                          Location
                        </Text>
                      </View>
                      <View style={{flex: 1, paddingLeft: 30}}>
                        <Text headline semibold numberOfLines={3} style={{textAlign: 'right'}}>
                          {jobDetail.location}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {jobDetail.images ? (
                    <Image source={{uri: jobDetail.images}} style={{width: '100%', height: 150, marginTop: 30}} resizeMode="stretch" />
                  ) : (
                    <View style={styles.customerImage}>
                      <Icon name="camera" size={40} color={BaseColor.grayColor} />
                      <Text headline semibold numberOfLines={3} style={{marginTop: 5}}>
                        NO IMAGE AVAILABLE
                      </Text>
                    </View>
                  )}
                  <View style={styles.helperListWrapper}>
                    <Text headline semibold numberOfLines={1} style={{marginTop: 5, color: BaseColor.primaryColor}}>
                      Helper{helpers.length !== 0 && `(${helpers.length})`}
                    </Text>
                    <Text headline semibold numberOfLines={1} style={{marginTop: 5, color: BaseColor.primaryColor}}>
                      Arrived
                    </Text>
                  </View>
                  {helpers.length !== 0 &&
                    helpers.map((item, index) => (
                      <HelperListItem
                        key={`${item.user_id}`}
                        helperData={item}
                        jobStatus={jobDetail.job_status}
                        paymentStatus={jobDetail.payment_status}
                        onPress={() => {}}
                        onCheck={() => this.onCheckArrived(item, index)}
                        onTrack={() => this.onTrack(item)}
                      />
                    ))}
                </View>
              </ScrollView>
              <View
                style={{
                  padding: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                {this.renderBottomButtons()}
              </View>
            </>
          )}
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

function MyJobDetail(props) {
  const isFocused = useIsFocused();
  return <_MyJobDetail {...props} isFocused={isFocused} />;
}

export default connect(mapStateToProps, mapDispatchToProps)(MyJobDetail);

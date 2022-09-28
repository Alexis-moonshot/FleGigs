import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {AuthActions} from '@actions';
import {View, FlatList, StatusBar, TouchableOpacity} from 'react-native';
import {BaseStyle, BaseColor, GreenColor, Images} from '@config';
import {Header, SafeAreaView, Icon, Image, Text, Button, Tag, StarRating, ActivityItem} from '@components';
import styles from './styles';
import {useFocusEffect} from '@react-navigation/native';
import {UserServices, NotificationServices} from '../../services';
import messaging from '@react-native-firebase/messaging';
import {Placeholder, PlaceholderLine, ShineOverlay} from 'rn-placeholder';
import {Placeholders} from '@data';

function FocusDashboardData({onFocus}) {
  useFocusEffect(
    React.useCallback(() => {
      onFocus();
      return;
    }, [onFocus])
  );

  return null;
}

class Dashboard extends Component {
  constructor(props) {
    super();
    this.state = {
      loading: false,
      posted_job: '',
      ongoing_job: null,
      rating: 0,
      total_paid: 0,
      profile_image: '',
      activityData: [],
    };
  }

  componentDidMount() {
    this.updateToken();
    this.initNotification();
  }

  initNotification() {
    // foreground
    messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', remoteMessage);
      var title = '';
      switch (remoteMessage.data.type) {
        case 'acceptjob':
          title = 'Job was accepted by helper';
          break;
        case 'job_declined_by_all_helper':
          title = 'Job was cancelled by all helper';
          break;
        case 'job_declined_by_a_helper':
          title = 'Job was rejected by a helper';
          break;
        case 'job_declined_by_timeout':
          title = 'Job was cancelled by timeout';
          break;
        case 'end_job_by_helper':
          title = 'Job was ended by a helper';
          break;
        default:
          title = remoteMessage.data.title || 'Flegigs';
          break;
      }
      NotificationServices.showNotification(title, remoteMessage.data.msg);
    });
  }

  onFocus = () => {
    this.fetchDashboardData();
  };

  fetchDashboardData() {
    const {auth} = this.props;
    this.setState({loading: true});

    UserServices.getDashboardData(auth.user.token)
      .then(response => {
        if (response?.data?.success === 1) {
          this.handleUpdate(true, response?.data);
        } else {
          this.handleUpdate(false, response?.data?.msg);
        }
      })
      .catch(error => {
        this.handleUpdate(false, error.response);
      });
  }

  handleUpdate = (result, response) => {
    const {actions} = this.props;
    console.log('Dashboard handleUpdate ----------', response?.data);
    if (result) {
      this.setState({
        posted_job: response.data.posted_job,
        completed_jobs: response.data.completed_jobs,
        total_paid: parseFloat(response.data.total_paid).toFixed(2),
        ongoing_job: response.data.ongoing_job,
        rating: parseFloat(response.data.feedback),
        activityData: response.data.recent_activity,
        profile_image: response.data.profile_image,
      });
      actions.saveProfileImage(response.data.profile_image);
    } else {
    }
    this.setState({loading: false});
  };

  updateToken() {
    messaging()
      .getToken()
      .then(token => {
        const {auth} = this.props;
        const body = {fcmToken: token};
        UserServices.saveFcmTokenToDatabase(body, auth.user.token)
          .then(response => {
            if (response.data.success === 1) {
              // console.log(response.data.msg);
            } else {
              console.log(response.data.msg);
            }
          })
          .catch(error => {
            console.log(error);
          });
      })
      .catch(error => {
        console.log('Get token failed', error);
      });
  }

  renderSeparator = () => {
    return <View style={styles.separator} />;
  };

  renderActivityPlaceholder(item, index) {
    return (
      <View style={styles.placeholder}>
        <Placeholder Animation={ShineOverlay}>
          <PlaceholderLine width={50} />
          <PlaceholderLine width={40} />
        </Placeholder>
      </View>
    );
  }

  render() {
    const {navigation, auth} = this.props;
    const {activityData, rating, total_paid, posted_job, completed_jobs, profile_image, ongoing_job, loading} = this.state;

    return (
      <>
        <FocusDashboardData onFocus={this.onFocus} />
        <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'never'}}>
          <StatusBar hidden={false} />
          <Header
            title="Dashboard"
            renderLeft={() => <Icon name="bars" size={20} color={BaseColor.headerIconColor} />}
            renderRight={() => <Icon name="bell" size={24} color={BaseColor.headerIconColor} />}
            onPressLeft={() => {
              navigation.openDrawer();
            }}
            onPressRight={() => {
              navigation.navigate('Notification');
            }}
          />
          <View style={styles.profileContainer}>
            <View style={styles.avatarContainer}>
              <Image source={profile_image ? {uri: profile_image} : Images.defaultAvatar} style={styles.thumb} />
              <Text>{auth.user.name}</Text>
            </View>
            <View style={styles.overview}>
              <View style={styles.overviewItem}>
                <Text>Feedback</Text>
                <StarRating disabled={true} starSize={14} maxStars={5} rating={rating} fullStarColor={BaseColor.yellowColor} />
              </View>
              <View style={styles.overviewItem}>
                <Text>Total Spent</Text>
                <Text>$ {total_paid}</Text>
              </View>
              <View style={styles.overviewItem}>
                <Text>Total Jobs</Text>
                <Text>{posted_job ? posted_job : 0}</Text>
              </View>
              <View style={styles.overviewItem}>
                <Text>Jobs Completed</Text>
                <Text>{completed_jobs ? completed_jobs : 0}</Text>
              </View>
            </View>
          </View>
          <View style={styles.buttonGroup}>
            {ongoing_job ? (
              <TouchableOpacity style={styles.ongoingJobButton} onPress={() => navigation.navigate('MyJobDetail', {jobData: ongoing_job})}>
                <Icon name="handshake" size={25} color="#ffffff" />
                <View style={{flex: 1, marginLeft: 10}}>
                  <Text title3 whiteColor>
                    {ongoing_job.short_description}
                  </Text>
                  <Text footnote whiteColor>
                    #{ongoing_job.job_id}
                  </Text>
                </View>
                <Text subhead whiteColor style={styles.ongoingJobStatue}>
                  {ongoing_job.payment_status === '0' ? (ongoing_job.job_status === '1' ? 'In progress' : 'Pending') : 'Waiting'}
                </Text>
              </TouchableOpacity>
            ) : (
              <Button
                full
                onPress={() => navigation.navigate('PostJob', {type: 'new'})}
                icon={<Icon name="edit" size={20} color={BaseColor.whiteColor} />}
                style={{backgroundColor: GreenColor.primaryColor}}
                styleText={styles.buttonText}>
                Post a job
              </Button>
            )}
          </View>
          <View>
            <View style={styles.activityTitleContainer}>
              <Text title3 semibold primaryColor style={styles.activityTitle}>
                Recent Activity
              </Text>
              <Tag outline round style={styles.tag} onPress={() => navigation.navigate('Notification')}>
                View All
              </Tag>
            </View>
            {loading ? (
              <FlatList
                data={Placeholders}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => this.renderActivityPlaceholder(item, index)}
                ItemSeparatorComponent={this.renderSeparator}
                scrollEnabled={false}
              />
            ) : (
              activityData.map((item, index) => <ActivityItem item={item} index={index} key={index.toString()} />)
            )}
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

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

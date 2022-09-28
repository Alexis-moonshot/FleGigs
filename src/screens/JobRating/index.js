import React, {Component} from 'react';
import {View, ScrollView} from 'react-native';
import {connect} from 'react-redux';
import {BaseStyle, BaseColor} from '@config';
import {Header, SafeAreaView, Icon, Button, JobRatingListItem} from '@components';
import {useFocusEffect} from '@react-navigation/native';
import {UserServices} from '../../services';
import styles from './styles';
import {showMessage} from 'react-native-flash-message';
import Spinner from 'react-native-loading-spinner-overlay';

function FetchJobRatingDetail({onFocus}) {
  useFocusEffect(
    React.useCallback(() => {
      onFocus();
      return;
    }, [onFocus])
  );

  return null;
}

class JobRating extends Component {
  constructor(props) {
    super(props);
    this.state = {
      helpersRating: [],
      total_tip: 0,
      loading: false,
    };
  }

  handleUpdate = (result, response) => {
    console.log('JobRating handleUpdate ----------', response);
    if (result) {
      this.setState({
        helpersRating: response.data,
        total_tip: parseInt(response.total_tip, 10),
      });
    } else {
      console.log(response);
    }
    this.setState({loading: false});
  };

  onFocus = () => {
    this.setState({loading: true});

    const {auth} = this.props;
    const {jobData} = this.props.route.params;

    const body = {
      job_id: jobData.id,
    };
    UserServices.getJobRatingDetails(body, auth.user.token)
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

  onRating = (helper_user_id, star) => {
    const {auth} = this.props;
    const {jobData} = this.props.route.params;

    const body = {
      job_id: jobData.id,
      helper_id: helper_user_id,
      rating: star,
    };
    this.setState({loading: true});
    UserServices.rateHelper(body, auth.user.token)
      .then(response => {
        if (response.data.success === 1) {
          console.log(response.data.data);
        } else {
          console.log(response.data.msg);
        }
        this.setState({loading: false});
      })
      .catch(error => {
        console.log(error);
        this.setState({loading: false});
      });
  };

  onPayTip = (helper_user_id, tip) => {
    console.log('onPayTip', helper_user_id, tip);
    const {auth} = this.props;
    const {jobData} = this.props.route.params;

    const body = {
      job_id: jobData.id,
      helper_id: helper_user_id,
      tip: tip,
    };
    this.setState({
      helpersRating: this.state.helpersRating.map((item, i) => {
        if (item.helper_user_id === helper_user_id) {
          return {...item, paying: true};
        } else {
          return item;
        }
      }),
    });
    UserServices.payTipToHelper(body, auth.user.token)
      .then(response => {
        console.log(response);
        if (response.data.success === 1) {
          showMessage({
            message: response.data.msg,
            type: 'success',
            icon: 'auto',
            duration: 10000,
          });
          this.setState({
            helpersRating: this.state.helpersRating.map((item, i) => {
              if (item.helper_user_id === helper_user_id) {
                return {...item, paying: false, tip: tip};
              } else {
                return item;
              }
            }),
            total_tip: this.state.total_tip + parseInt(tip, 10),
          });
        } else {
          console.log(response.data.msg);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  onNext = () => {
    const {navigation} = this.props;
    const {jobData} = this.props.route.params;
    const {total_tip, helpersRating} = this.state;

    navigation.navigate('JobEnd', {
      jobData: jobData,
      helper_count: helpersRating.length,
      total_tip: total_tip,
    });
  };

  render() {
    const {navigation} = this.props;
    const {helpersRating, loading} = this.state;
    const {jobData} = this.props.route.params;

    return (
      <>
        <FetchJobRatingDetail onFocus={this.onFocus} />
        <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'never'}}>
          <Spinner visible={loading} />
          <Header
            title="Job Finished"
            renderLeft={() => {
              return <Icon name="arrow-left" size={20} color={BaseColor.headerIconColor} />;
            }}
            subTitle={`#${jobData.job_id}`}
            onPressLeft={() => {
              navigation.goBack();
            }}
          />
          <ScrollView>
            <View
              style={{
                paddingHorizontal: 20,
                marginBottom: 20,
              }}>
              {helpersRating.map((item, index) => (
                <JobRatingListItem key={item.helper_user_id} rating={item} onRating={this.onRating} onPayTip={this.onPayTip} />
              ))}
            </View>
          </ScrollView>
          <View style={styles.bottomButtonContainer}>
            <Button full onPress={this.onNext}>
              Next
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
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(JobRating);

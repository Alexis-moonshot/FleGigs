import React, {Component} from 'react';
import {connect} from 'react-redux';
import {RefreshControl, FlatList, Text} from 'react-native';
import {BaseStyle, BaseColor} from '@config';
import {Header, SafeAreaView, Icon, MyJobListItem} from '@components';
import styles from './styles';
import {useFocusEffect} from '@react-navigation/native';
import {UserServices} from '../../services';

function FocusMyJob({onFocus}) {
  useFocusEffect(
    React.useCallback(() => {
      onFocus();
      return;
    }, [onFocus])
  );

  return null;
}

class MyJobs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      jobs: [],
    };
  }

  fetchJobList = () => {
    const {auth} = this.props;

    this.setState({refreshing: true});
    UserServices.getJobList(auth.user.token)
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
    // console.log('MyJobs handleUpdate ----------', response);
    if (result) {
      this.setState({
        jobs: response.job_details,
      });
    } else {
    }
    this.setState({refreshing: false});
  };

  render() {
    const {navigation, auth} = this.props;
    const {jobs} = this.state;
    return (
      <>
        <FocusMyJob onFocus={this.fetchJobList} />
        <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'never'}}>
          <Header
            title="My Jobs"
            renderLeft={() => {
              return <Icon name="arrow-left" size={20} color={BaseColor.headerIconColor} />;
            }}
            onPressLeft={() => {
              navigation.goBack();
            }}
          />
          <Text
            style={{
              fontSize: 15,
              marginHorizontal: 20,
              color: BaseColor.primaryColor,
              marginTop: 15,
            }}>
            {jobs.length ? jobs.length : 'No'} Jobs found
          </Text>
          <FlatList
            refreshControl={
              <RefreshControl
                colors={[BaseColor.primaryColor]}
                tintColor={BaseColor.primaryColor}
                refreshing={this.state.refreshing}
                onRefresh={this.fetchJobList}
              />
            }
            data={jobs}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => <MyJobListItem job={item} onPress={() => navigation.navigate('MyJobDetail', {jobData: item})} />}
          />
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

export default connect(mapStateToProps, mapDispatchToProps)(MyJobs);

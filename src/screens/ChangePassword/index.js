import React, {Component} from 'react';
import {View, ScrollView, TextInput} from 'react-native';
import {connect} from 'react-redux';
import {BaseStyle, BaseColor} from '@config';
import {Header, SafeAreaView, Icon, Text, Button, PasswordInput} from '@components';
import styles from './styles';
import {UserServices} from '../../services';
import {showMessage} from 'react-native-flash-message';

class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      old_password: '',
      password: '',
      repassword: '',
      loading: false,
    };
  }

  checkInput() {
    const {old_password, password, repassword} = this.state;

    if (old_password.length === 0) {
      showMessage({
        message: 'Please input old password',
        type: 'warning',
        icon: 'auto',
        duration: 6000,
      });
      return false;
    }
    if (password.length === 0) {
      showMessage({
        message: 'Please input password',
        type: 'warning',
        icon: 'auto',
        duration: 6000,
      });
      return false;
    }
    if (password !== repassword) {
      showMessage({
        message: 'Password does not match',
        type: 'warning',
        icon: 'auto',
        duration: 6000,
      });
      return false;
    }
    return true;
  }

  onChangePassword = () => {
    if (!this.checkInput()) {
      return;
    }

    const {auth, navigation} = this.props;
    const {old_password, password, repassword} = this.state;

    this.setState({changing: true});
    const body = {
      old_password: old_password,
      password: password,
      confirm_password: repassword,
    };
    UserServices.changePassword(body, auth.user.token)
      .then(response => {
        if (response.data.success === 1) {
          showMessage({
            message: response.data.msg,
            type: 'success',
            icon: 'auto',
            duration: 6000,
          });
          navigation.goBack();
        } else {
          showMessage({
            message: response.data.msg,
            type: 'warning',
            icon: 'auto',
            duration: 6000,
          });
        }
      })
      .catch(error => {
        console.log(error);
        showMessage({
          message: 'Failed to change password',
          type: 'warning',
          icon: 'auto',
          duration: 6000,
        });
      })
      .finally(() => {
        this.setState({changing: false});
      });
  };

  render() {
    const {navigation} = this.props;
    const {old_password, password, repassword, changing} = this.state;
    return (
      <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'never'}}>
        <Header
          title="Change Password"
          renderLeft={() => {
            return <Icon name="arrow-left" size={20} color={BaseColor.headerIconColor} />;
          }}
          onPressLeft={() => {
            navigation.goBack();
          }}
        />
        <ScrollView>
          <View style={styles.contain}>
            <View style={styles.contentTitle}>
              <Text headline semibold>
                Current Password
              </Text>
            </View>
            <PasswordInput onChangeText={text => this.setState({old_password: text})} placeholder="Current Password" value={old_password} />
            <View style={styles.contentTitle}>
              <Text headline semibold>
                New Password
              </Text>
            </View>
            <PasswordInput onChangeText={text => this.setState({password: text})} placeholder="New Password" value={password} />
            <View style={styles.contentTitle}>
              <Text headline semibold>
                Confirm Password
              </Text>
            </View>
            <PasswordInput onChangeText={text => this.setState({repassword: text})} placeholder="Confirm Password" value={repassword} />
          </View>
        </ScrollView>
        <View style={styles.bottomButtonContainer}>
          <Button loading={changing} disabled={changing} full onPress={this.onChangePassword}>
            Confirm
          </Button>
        </View>
      </SafeAreaView>
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

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {AuthActions} from '@actions';
import {bindActionCreators} from 'redux';
import {View, ScrollView, TouchableOpacity, TextInput, StatusBar} from 'react-native';
import {BaseStyle, BaseColor} from '@config';
import {Header, SafeAreaView, Icon, Text, Button, PasswordInput} from '@components';
import styles from './styles';
import {showMessage} from 'react-native-flash-message';

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      loading: false,
    };
  }

  checkInput = () => {
    const {email, password} = this.state;

    if (email.length === 0) {
      showMessage({
        message: 'Please enter your email address',
        type: 'warning',
        icon: 'auto',
      });
      return false;
    }
    if (password.length === 0) {
      showMessage({
        message: 'Please enter your password',
        type: 'warning',
        icon: 'auto',
      });
      return false;
    }
    return true;
  };

  onLogin = () => {
    if (!this.checkInput()) {
      return;
    }

    const {email, password} = this.state;
    const {navigation, actions} = this.props;

    const credential = {
      email: email,
      password: password,
    };
    actions.login(credential, response => {
      console.log('------- login response', response);
      if (response.success) {
        // showMessage({
        //   message: response.msg,
        //   type: 'success',
        //   icon: 'auto',
        // });
        navigation.navigate('Loading');
      } else {
        showMessage({
          message: response.msg,
          type: 'warning',
          icon: 'auto',
        });
      }
    });
  };

  render() {
    const {navigation, auth} = this.props;
    const {email, password} = this.state;

    return (
      <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'never'}}>
        <StatusBar hidden={false} />
        <Header
          title="Sign In"
          renderLeft={() => {
            return <Icon name="arrow-left" size={20} color={BaseColor.headerIconColor} />;
          }}
          onPressLeft={() => {
            navigation.goBack();
          }}
        />
        <ScrollView>
          <View style={styles.contain}>
            <TextInput
              style={[BaseStyle.textInput, {marginTop: 65}]}
              onChangeText={text => this.setState({email: text})}
              autoCorrect={false}
              placeholder="Email Address"
              placeholderTextColor={BaseColor.grayColor}
              value={email}
              maxLength={40}
              autoCapitalize={'none'}
              autoCompleteType={'email'}
              keyboardType={'email-address'}
              textContentType={'emailAddress'}
            />
            <PasswordInput containerStyle={{marginTop: 10}} onChangeText={text => this.setState({password: text})} value={password} />
            <View style={{width: '100%', marginTop: 20}}>
              <Button full loading={auth.login.isLoading} disabled={auth.login.isLoading} onPress={this.onLogin}>
                Sign In
              </Button>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')}>
              <Text body1 grayColor style={{marginTop: 25}}>
                Forgot your password?
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  return {
    actions: bindActionCreators(AuthActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);

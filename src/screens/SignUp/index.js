import React, {Component} from 'react';
import {View, ScrollView, TextInput, StatusBar, TouchableOpacity, Linking} from 'react-native';
import {connect} from 'react-redux';
import {AuthActions} from '@actions';
import {bindActionCreators} from 'redux';
import {BaseStyle, BaseColor} from '@config';
import {Header, SafeAreaView, Icon, Button, PasswordInput, Text} from '@components';
import styles from './styles';
import {showMessage} from 'react-native-flash-message';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      password2: '',
      loading: false,
      termsChecked: false,
    };
  }

  checkInput = () => {
    const {firstname, lastname, email, password, password2} = this.state;

    if (firstname.length === 0) {
      showMessage({
        message: 'Please enter your first name',
        type: 'warning',
        icon: 'auto',
      });
      return false;
    }
    if (lastname.length === 0) {
      showMessage({
        message: 'Please enter your last name',
        type: 'warning',
        icon: 'auto',
      });
      return false;
    }
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

    if (password !== password2) {
      showMessage({
        message: 'Password does not match',
        type: 'warning',
        icon: 'auto',
      });
      return false;
    }
    return true;
  };

  onSignUp = () => {
    if (!this.checkInput()) {
      return;
    }

    const {actions} = this.props;
    const {firstname, lastname, email, password} = this.state;

    const credential = {
      email: email,
      first_name: firstname,
      last_name: lastname,
      password: password,
    };
    this.setState({loading: true});
    actions.register(credential, response => {
      console.log('------- register response', response);
      if (response.success) {
        showMessage({
          message: response.msg,
          type: 'success',
          icon: 'auto',
        });

        this.doSignIn(credential);
      } else {
        showMessage({
          message: response.msg,
          type: 'danger',
          icon: 'auto',
        });
      }
      this.setState({loading: false});
    });
  };

  doSignIn = credential => {
    const {navigation, actions} = this.props;
    actions.login(credential, response => {
      console.log('------- login response', response);
      if (response.success) {
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

  onTerms = () => {
    const url = 'http://flegigs.toplev.io/terms';
    Linking.canOpenURL(url).then(res => {
      if (res) {
        Linking.openURL(url);
      }
    });
  };

  render() {
    const {navigation} = this.props;
    const {loading, termsChecked, firstname, lastname, email, password, password2} = this.state;
    return (
      <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'never'}}>
        <StatusBar hidden={false} />
        <Header
          title="Sign Up"
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
              onChangeText={text => this.setState({firstname: text})}
              autoCorrect={false}
              placeholder="First Name"
              placeholderTextColor={BaseColor.grayColor}
              value={firstname}
              maxLength={20}
              autoCompleteType={'name'}
              textContentType={'givenName'}
            />
            <TextInput
              style={[BaseStyle.textInput, {marginTop: 10}]}
              onChangeText={text => this.setState({lastname: text})}
              autoCorrect={false}
              placeholder="Last Name"
              placeholderTextColor={BaseColor.grayColor}
              value={lastname}
              maxLength={20}
              autoCompleteType={'name'}
              textContentType={'familyName'}
            />
            <TextInput
              style={[BaseStyle.textInput, {marginTop: 10}]}
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
            <PasswordInput
              containerStyle={{marginTop: 10}}
              onChangeText={text => this.setState({password2: text})}
              placeholder="Confirm Password"
              value={password2}
            />
            <View style={styles.termsContainer}>
              <TouchableOpacity style={styles.termsCheck} onPress={() => this.setState({termsChecked: !termsChecked})}>
                <Icon name="check" size={16} color={termsChecked ? 'black' : 'transparent'} />
              </TouchableOpacity>
              <Text callout style={{marginLeft: 10}}>
                {'I have read and agree to the '}
              </Text>
              <TouchableOpacity onPress={this.onTerms}>
                <Text callout style={styles.termsText}>
                  {'terms'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{width: '100%', marginTop: 20}}>
              <Button
                full
                loading={loading}
                disabled={!termsChecked || loading}
                style={[(!termsChecked || loading) && {backgroundColor: 'gray'}]}
                onPress={this.onSignUp}>
                Sign Up
              </Button>
            </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);

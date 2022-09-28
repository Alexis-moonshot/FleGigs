import React, {Component} from 'react';
import {View, ScrollView, Image, TextInput} from 'react-native';
import {BaseStyle, BaseColor} from '@config';
import {Header, SafeAreaView, Icon, Text, Button} from '@components';
import styles from './styles';
import {showMessage} from 'react-native-flash-message';
import {UserServices} from '../../services';

export default class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      loading: false,
    };
  }

  checkInput() {
    const {email} = this.state;

    if (email.length === 0) {
      showMessage({
        message: 'Please input email address',
        type: 'warning',
        icon: 'auto',
      });
      return false;
    }
    return true;
  }

  onReset = () => {
    if (!this.checkInput()) {
      return;
    }

    const {navigation} = this.props;
    const {email} = this.state;
    this.setState({loading: true});

    const body = {
      email: email,
      profile_id: 2,
    };

    UserServices.forgotPassword(body)
      .then(response => {
        if (response.data.success === 1) {
          showMessage({
            message: response.data.msg,
            type: 'success',
            icon: 'auto',
          });
          navigation.navigate('SignIn');
        } else {
          showMessage({
            message: response.data.msg,
            type: 'warning',
            icon: 'auto',
          });
        }
      })
      .catch(error => {
        console.log('error', error);
      })
      .finally(() => {
        this.setState({loading: false});
      });
  }

  render() {
    const {navigation} = this.props;
    const {email, loading} = this.state;

    return (
      <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'never'}}>
        <Header
          title="Reset Password"
          renderLeft={() => {
            return <Icon name="arrow-left" size={20} color={BaseColor.headerIconColor} />;
          }}
          onPressLeft={() => {
            navigation.goBack();
          }}
        />
        <ScrollView>
          <View
            style={{
              alignItems: 'center',
              padding: 20,
              width: '100%',
            }}>
            <TextInput
              style={[BaseStyle.textInput, {marginTop: 65}]}
              onChangeText={text => this.setState({email: text})}
              autoCorrect={false}
              placeholder="Email Address"
              placeholderTextColor={BaseColor.grayColor}
              value={email}
              selectionColor={BaseColor.primaryColor}
              maxLength={40}
              autoCapitalize={'none'}
              autoCompleteType={'email'}
              keyboardType={'email-address'}
              textContentType={'emailAddress'}
            />
            <View style={{width: '100%'}}>
              <Button
                full
                style={{marginTop: 20}}
                onPress={() => {
                  this.onReset();
                }}
                disabled={loading}
                loading={loading}>
                Reset Password
              </Button>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

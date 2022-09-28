import React, {Component} from 'react';
import {View, ScrollView, TextInput, Platform} from 'react-native';
import {connect} from 'react-redux';
import {BaseStyle, BaseColor} from '@config';
import {Header, SafeAreaView, Icon, Text, Button} from '@components';
import styles from './styles';
import {UserServices} from '@services';
import {showMessage} from 'react-native-flash-message';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

class AdminSupport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subject: '',
      msg: '',
      loading: false,
    };
  }

  checkInput() {
    const {subject, msg} = this.state;

    if (subject.length === 0) {
      showMessage({
        message: 'Please input subject',
        type: 'warning',
        icon: 'auto',
      });
      return false;
    }
    if (msg.length === 0) {
      showMessage({
        message: 'Please input message',
        type: 'warning',
        icon: 'auto',
      });
      return false;
    }
    return true;
  }

  onSubmit = () => {
    if (!this.checkInput()) {
      return;
    }

    const {auth, navigation} = this.props;
    const {subject, msg} = this.state;

    this.setState({submitting: true});
    const body = {
      subject: subject,
      message: msg,
    };
    UserServices.contactSupport(body, auth.user.token)
      .then(response => {
        if (response.data.success === 1) {
          showMessage({
            message: response.data.msg,
            type: 'success',
            icon: 'auto',
            duration: 10000,
          });
          navigation.goBack();
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
        console.log(error);
      })
      .finally(() => {
        this.setState({submitting: false});
      });
  };

  render() {
    const {navigation} = this.props;
    const {subject, msg, submitting} = this.state;
    return (
      <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'never'}}>
        <Header
          title="Admin Support"
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
          <View style={styles.contain}>
            <View style={styles.contentTitle}>
              <Text headline semibold>
                Subject
              </Text>
            </View>
            <TextInput
              style={[BaseStyle.textInput, {marginTop: 15}]}
              onChangeText={text => this.setState({subject: text})}
              autoCorrect={false}
              placeholder={'Subject'}
              placeholderTextColor={BaseColor.grayColor}
              value={subject}
              selectionColor={BaseColor.primaryColor}
            />
            <View style={styles.contentTitle}>
              <Text headline semibold>
                Message
              </Text>
            </View>
            <TextInput
              style={[BaseStyle.textInput, styles.msg]}
              onChangeText={text => this.setState({msg: text})}
              multiline={true}
              autoCorrect={false}
              placeholder={'Write message'}
              placeholderTextColor={BaseColor.grayColor}
              value={msg}
              selectionColor={BaseColor.primaryColor}
              ref={r => {
                this._textInputRef = r;
              }}
            />
          </View>
          <View style={styles.bottomButtonContainer}>
            <Button loading={submitting} disabled={submitting} full onPress={this.onSubmit}>
              Submit
            </Button>
          </View>
        </KeyboardAwareScrollView>
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

export default connect(mapStateToProps, mapDispatchToProps)(AdminSupport);

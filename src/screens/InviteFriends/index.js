import React, {Component} from 'react';
import {View, ScrollView} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {AuthActions} from '@actions';
import {BaseStyle, BaseColor} from '@config';
import {Header, SafeAreaView, Icon, Text, Button} from '@components';
import styles from './styles';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import Clipboard from '@react-native-community/clipboard';
import Share from 'react-native-share';

class InviteFriends extends Component {
  constructor(props) {
    super();
    this.state = {
      loading: false,
      inviteLink: '',
    };
  }

  async componentDidMount() {
    const {auth} = this.props;

    const link = await dynamicLinks().buildShortLink({
      link: 'https://flegigs.toplev.io/invite/' + auth.user.user_id,
      // domainUriPrefix is created in your Firebase console
      domainUriPrefix: 'https://flegigs.page.link',
      // optional set up which updates Firebase analytics campaign
      // "banner". This also needs setting up before hand
      analytics: {
        campaign: 'banner',
      },
      android: {
        packageName: 'com.ahl.flegigscus',
      },
      ios: {
        bundleId: 'app.flegigscus.ahl.com',
        appStoreId: '123456789',
      },
    });

    this.setState({inviteLink: link});
  }

  onCopy = () => {
    const {inviteLink} = this.state;

    Clipboard.setString(inviteLink);
  };

  onWhatsapp = () => {};

  onEmail = async () => {
    const {inviteLink} = this.state;

    const shareOptions = {
      title: 'Invite Friends',
      email: 'email@example.com',
      failOnCancel: false,
      message: 'I recommend you to use the Flegigs app.\n' + inviteLink,
    };

    try {
      const ShareResponse = await Share.open(shareOptions);
      console.log(JSON.stringify(ShareResponse, null, 2));
    } catch (error) {
      console.log('Error =>', error);
    }
  };

  onSMS = async () => {
    const shareOptions = {
      title: 'Invite Friends',
      social: Share.Social.SMS,
      recipient: '',
      message: 'I recommend you to use the Flegigs app',
    };

    try {
      const ShareResponse = await Share.shareSingle(shareOptions);
      console.log(JSON.stringify(ShareResponse, null, 2));
    } catch (error) {
      console.log('Error =>', error);
    }
  };

  render() {
    const {navigation} = this.props;
    const {inviteLink} = this.state;

    return (
      <>
        <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'never'}}>
          <Header
            title="Invite Friends"
            renderLeft={() => {
              return <Icon name="arrow-left" size={20} color={BaseColor.headerIconColor} />;
            }}
            onPressLeft={() => {
              navigation.goBack();
            }}
          />
          <ScrollView>
            <View style={styles.contain}>
              <Text title1 semibold>
                {inviteLink}
              </Text>
            </View>
            <View style={styles.buttonContainer}>
              <Button full onPress={this.onCopy} style={{alignItems: 'center', marginBottom: 10}}>
                Copy link
              </Button>
              {/* <Button
                full
                onPress={this.onWhatsapp}
                style={{ alignItems: 'center' }}>
                Invite Friends by Whatsapp
              </Button> */}
              <Button full onPress={this.onEmail} style={{alignItems: 'center'}}>
                Invite Friends
              </Button>
              {/* <Button
                full
                onPress={this.onSMS}
                style={{ alignItems: 'center' }}>
                Invite Friends by SMS
              </Button> */}
            </View>
          </ScrollView>
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

export default connect(mapStateToProps, mapDispatchToProps)(InviteFriends);

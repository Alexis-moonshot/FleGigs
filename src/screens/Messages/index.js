import React, {Component} from 'react';
import {View, Platform, TouchableOpacity, PermissionsAndroid, Alert} from 'react-native';
import {BaseStyle, BaseColor} from '@config';
import {Header, SafeAreaView, Icon} from '@components';
import {GiftedChat, Send} from 'react-native-gifted-chat';
import {connect} from 'react-redux';
import styles from './styles';
import database from '@react-native-firebase/database';
import {useFocusEffect} from '@react-navigation/native';
import {UserServices, FirebaseServices} from '../../services';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import fbauth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import {NativeBaseProvider, Actionsheet, Divider} from 'native-base';

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const imagePickerOption = {
  mediaType: 'photo',
  maxWidth: 512,
  maxHeight: 512,
  allowsEditing: true,
  quality: 0.5,
};

function FocusMessageScreen({onFocus}) {
  useFocusEffect(
    React.useCallback(() => {
      onFocus();
      return;
    }, [onFocus])
  );

  return null;
}

class Messages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      groupTokens: [],
      isOpen: false,
      selectedUser: null,
    };
  }

  onFocus = async () => {
    const {auth} = this.props;
    const {jobData} = this.props.route.params;
    const body = {job_id: jobData.id};

    await fbauth().signInAnonymously();
    UserServices.getFcmTokensForGroupChat(body, auth.user.token)
      .then(response => {
        if (response.data.success === 1) {
          this.setState({
            groupTokens: response.data.data.map(item => {
              return item.device_token;
            }),
          });
        } else {
          console.log(response.data.msg);
        }
      })
      .catch(error => {
        console.log(error);
      });

    database()
      .ref('messages')
      .child('order_' + jobData.job_id)
      .on('child_added', value => {
        const arrValue = [value.val()];
        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, arrValue),
        }));
      });
  };

  onSend(messages = []) {
    const {jobData} = this.props.route.params;
    const {auth} = this.props;

    let msgId = database()
      .ref('messages')
      .child('order_' + jobData.job_id)
      .push().key;

    let updates = {};
    let message = {
      _id: messages[0]._id,
      text: messages[0].text,
      createdAt: database.ServerValue.TIMESTAMP,
      user: {
        _id: auth.user.email,
        avatar: auth.user.profileimg,
        name: auth.user.name,
      },
    };

    updates['messages/' + 'order_' + jobData.job_id + '/' + msgId] = message;
    database().ref().update(updates);

    this.sendNotification(jobData.job_id, message);
  }

  sendNotification(job_id, message) {
    const {groupTokens} = this.state;
    const msg = message.text ? message.text : message.user.name + ' sent you a image';
    if (groupTokens.length !== 0) {
      const body = {
        registration_ids: groupTokens,
        notification: {
          title: message.user.name,
          body: msg,
          icon: 'notification-icon',
        },
        data: {
          type: 'chat',
          msg: msg,
          title: message.user.name,
          job_id: job_id,
        },
      };

      FirebaseServices.sendNotification(body);
    }
  }

  onPhoto = () => {
    launchImageLibrary(imagePickerOption, this.handleImagePickerResult);
  };

  onCamera = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
        title: 'Flegigs Camera Permission',
        message: 'Flegigs needs access to your camera so you can send photos to helpers',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      });

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera permission denied');
        return;
      }
    }

    launchCamera(imagePickerOption, this.handleImagePickerResult);
  };

  handleImagePickerResult = async res => {
    const {auth} = this.props;
    if (res.assets) {
      this.setState({uploading: true});

      const reference = storage().ref('chat_images/' + auth.user.user_id + '-' + res.assets[0].fileName);
      const task = reference.putFile(res.assets[0].uri);

      task.then(async () => {
        const url = await reference.getDownloadURL();
        this.onSendImageMessage(url);
      });
    }
  };

  onSendImageMessage(url) {
    const {jobData} = this.props.route.params;
    const {auth} = this.props;

    let msgId = database()
      .ref('messages')
      .child('order_' + jobData.job_id)
      .push().key;

    let updates = {};
    let message = {
      _id: uuidv4(),
      image: url,
      createdAt: database.ServerValue.TIMESTAMP,
      user: {
        _id: auth.user.email,
        avatar: auth.user.profileimg,
        name: auth.user.name,
      },
    };

    updates['messages/' + 'order_' + jobData.job_id + '/' + msgId] = message;
    database().ref().update(updates);

    this.sendNotification(jobData.job_id, message);
  }

  renderActions = props => {
    return (
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.actionItem} onPress={this.onCamera}>
          <MaterialIcons color="#C8C8C8" name="camera-alt" size={29} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionItem} onPress={this.onPhoto}>
          <Ionicons color="#C8C8C8" name="md-images" size={29} />
        </TouchableOpacity>
      </View>
    );
  };

  renderSend = props => {
    return (
      <Send {...props} containerStyle={styles.sendContainer}>
        <MaterialIcons name="send" size={25} color={BaseColor.primaryColor} />
      </Send>
    );
  };

  onLongPressAvatar = user => {
    this.setState({selectedUser: user});
    this.onOpen();
  };

  onOpen = () => {
    this.setState({isOpen: true});
  };

  onClose = () => {
    this.setState({isOpen: false});
  };

  blockUser = () => {
    const {selectedUser} = this.state;

    const body = {
      user_id: selectedUser._id,
    };
    this.setState({loading: true});
    UserServices.blockUser(body, this.props.auth.user.token)
      .then(response => {
        this.setState({loading: false});
        if (response.data?.success === 1) {
          Alert.alert('', `You blocked ${selectedUser.name}`);
        } else {
          console.log(response.data?.msg);
        }
      })
      .catch(error => {
        console.log(error);
        this.setState({loading: false});
      });
  };

  onBlock = () => {
    const {selectedUser} = this.state;

    this.onClose();
    if (!selectedUser) {
      return;
    }

    Alert.alert(
      `Block ${selectedUser.name}`,
      "Your job posting won't be notified to the them. They won't be notified that you blocked them.",
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          style: 'default',
          onPress: this.blockUser,
        },
      ]
    );
  };

  render() {
    const {navigation, auth} = this.props;
    return (
      <NativeBaseProvider>
        <FocusMessageScreen onFocus={this.onFocus} />
        <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'never'}}>
          <Header
            title="Messages"
            renderLeft={() => {
              return <Icon name="arrow-left" size={20} color={BaseColor.whiteColor} />;
            }}
            onPressLeft={() => {
              navigation.goBack();
            }}
          />
          <View style={{flex: 1}}>
            <GiftedChat
              messages={this.state.messages}
              onSend={messages => this.onSend(messages)}
              user={{
                _id: auth.user.email,
              }}
              renderActions={this.renderActions}
              renderSend={this.renderSend}
              onLongPressAvatar={this.onLongPressAvatar}
              alwaysShowSend={true}
            />
          </View>
        </SafeAreaView>
        <Actionsheet isOpen={this.state.isOpen} onClose={this.onClose}>
          <Actionsheet.Content>
            <Divider borderColor="gray.300" />
            <Actionsheet.Item onPress={this.onBlock}>Block</Actionsheet.Item>
          </Actionsheet.Content>
        </Actionsheet>
      </NativeBaseProvider>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(Messages);

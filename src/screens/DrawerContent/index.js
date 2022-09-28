import React, {Component} from 'react';
import {View, StatusBar, Platform} from 'react-native';
import {connect} from 'react-redux';
import {BaseColor, BaseSetting, Images} from '@config';
import {Icon, Text, Image} from '@components';
import styles from './styles';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {getStatusBarHeight} from 'react-native-status-bar-height';

class DrawerContent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {auth, navigation} = this.props;
    return (
      <>
        {Platform.OS === 'ios' && (
          <View
            style={{
              height: getStatusBarHeight(true),
              backgroundColor: BaseColor.primaryColor,
            }}>
            <StatusBar />
          </View>
        )}
        <View style={styles.drawerHeader}>
          <Image source={auth.user.profileimg ? {uri: auth.user.profileimg} : Images.defaultAvatar} style={styles.drawerAvatar} />
          <View style={styles.drawerHeaderContent}>
            <Text style={styles.drawerHeaderText}>{'Welcome !'}</Text>
            <Text style={styles.drawerHeaderText}>{`${auth.user.name}`}</Text>
          </View>
        </View>
        <DrawerContentScrollView {...this.props}>
          <DrawerItem
            label="Post a Job"
            icon={({focused, color, size}) => <Icon color={color} size={size} name="edit" style={styles.icon} />}
            onPress={() => {
              navigation.navigate('PostJob', {type: 'new'});
            }}
            activeTintColor={BaseColor.lightPrimaryColor}
          />
          <DrawerItem
            label="Dashboard"
            icon={({focused, color, size}) => <Icon color={color} size={size} name="th" style={styles.icon} />}
            onPress={() => {
              // navigation.navigate('DashboardStack');
              navigation.closeDrawer();
            }}
            activeTintColor={BaseColor.lightPrimaryColor}
          />
          <DrawerItem
            label="Notifications"
            icon={({focused, color, size}) => <Icon color={color} size={size} name="bell" style={styles.icon} />}
            onPress={() => {
              navigation.navigate('Notification');
            }}
            activeTintColor={BaseColor.lightPrimaryColor}
          />
          <DrawerItem
            label="My Jobs"
            icon={({focused, color, size}) => <Icon color={color} size={size} name="list" style={styles.icon} />}
            onPress={() => {
              navigation.navigate('MyJobs');
            }}
            activeTintColor={BaseColor.lightPrimaryColor}
          />
          <DrawerItem
            label="Profile"
            icon={({focused, color, size}) => <Icon color={color} size={size} name="user" style={styles.icon} />}
            onPress={() => {
              navigation.navigate('Profile');
            }}
            activeTintColor={BaseColor.lightPrimaryColor}
          />
          {/* <DrawerItem
            label="Invite friends"
            icon={({ focused, color, size }) => (
              <Icon
                color={color}
                size={size}
                name="share-alt"
                style={styles.icon}
              />
            )}
            onPress={() => {
              navigation.navigate('InviteFriends');
            }}
            activeTintColor={BaseColor.lightPrimaryColor}
          /> */}
          <DrawerItem
            label="Admin Support"
            icon={({focused, color, size}) => <Icon color={color} size={size} name="server" style={styles.icon} />}
            onPress={() => {
              navigation.navigate('AdminSupport');
            }}
            activeTintColor={BaseColor.lightPrimaryColor}
          />
        </DrawerContentScrollView>
        <View style={styles.versionContainer}>
          <Text title3>Version {BaseSetting.appVersion}</Text>
        </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(DrawerContent);

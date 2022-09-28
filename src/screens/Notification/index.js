import React, {Component} from 'react';
import {connect} from 'react-redux';
import {RefreshControl, Text, View, FlatList} from 'react-native';
import {BaseStyle, BaseColor} from '@config';
import {Header, SafeAreaView, Icon, NotificationListItem} from '@components';
import styles from './styles';
import {useFocusEffect} from '@react-navigation/native';
import {UserServices} from '../../services';
import {Placeholder, PlaceholderLine, ShineOverlay} from 'rn-placeholder';
import {Placeholders} from '@data';

function FocusNotification({onFocus}) {
  useFocusEffect(
    React.useCallback(() => {
      onFocus();
      return;
    }, [onFocus])
  );

  return null;
}

class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      notification: [],
    };
  }

  fetchNotificationData = () => {
    const {auth} = this.props;
    this.setState({refreshing: true});
    UserServices.getNotificationData(auth.user.token)
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
    // console.log('Notification handleUpdate ----------', response);
    if (result) {
      this.setState({
        notification: response.data,
      });
    } else {
    }
    this.setState({refreshing: false});
  };

  renderSeparator = () => {
    return <View style={styles.separator} />;
  };

  renderNotificationPlaceholder(item, index) {
    return (
      <View style={styles.placeholder}>
        <Placeholder Animation={ShineOverlay}>
          <PlaceholderLine width={50} />
          <PlaceholderLine width={40} />
        </Placeholder>
      </View>
    );
  }

  render() {
    const {navigation} = this.props;
    const {notification, refreshing} = this.state;
    return (
      <>
        <FocusNotification onFocus={this.fetchNotificationData} />
        <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'never'}}>
          <Header
            title="Notification"
            renderLeft={() => {
              return <Icon name="arrow-left" size={20} color={BaseColor.headerIconColor} />;
            }}
            onPressLeft={() => {
              navigation.goBack();
            }}
          />
          {refreshing ? (
            <FlatList
              data={Placeholders}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, index}) => this.renderNotificationPlaceholder(item, index)}
              ItemSeparatorComponent={this.renderSeparator}
              scrollEnabled={false}
            />
          ) : notification.length === 0 ? (
            <View>
              <Text style={styles.description}>No notification</Text>
            </View>
          ) : (
            <FlatList
              refreshControl={
                <RefreshControl
                  colors={[BaseColor.primaryColor]}
                  tintColor={BaseColor.primaryColor}
                  refreshing={refreshing}
                  onRefresh={this.fetchNotificationData}
                />
              }
              data={notification}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, index}) => <NotificationListItem item={item} />}
            />
          )}
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

export default connect(mapStateToProps, mapDispatchToProps)(Notification);

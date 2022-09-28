import React, {Component} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import {BaseStyle, BaseColor} from '@config';
import {Header, SafeAreaView, Icon, Text, Button} from '@components';
import styles from './styles';
import {UserServices} from '../../services';
import {showMessage} from 'react-native-flash-message';
import RBSheet from 'react-native-raw-bottom-sheet';

class PaymentMethodDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleting: false,
      settingPrimary: false,
      primary: props.route.params.primary,
    };
  }

  onDeletePayment = () => {
    const {navigation, auth} = this.props;
    const {card} = this.props.route.params;
    this.setState({deleting: true});

    const body = {
      card_id: card.id,
    };

    UserServices.deleteCard(body, auth.user.token)
      .then(response => {
        if (response.data.success === 1) {
          showMessage({
            message: 'Successfully removed your payment method',
            type: 'success',
            icon: 'auto',
            duration: 10000,
          });
          this.setState({deleting: false});
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
        console.log(error.response);
      })
      .finally(() => {
        this.setState({deleting: false});
      });
  };

  onSetPrimaryPayment = () => {
    const {auth} = this.props;
    const {card} = this.props.route.params;
    this.setState({settingPrimary: true});

    const body = {
      card_id: card.id,
    };

    UserServices.setPrimaryCard(body, auth.user.token)
      .then(response => {
        if (response.data.success === 1) {
          showMessage({
            message: 'Successfully set this payment method as primary',
            type: 'success',
            icon: 'auto',
            duration: 10000,
          });
          this.setState({primary: true});
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
        console.log(error.response);
      })
      .finally(() => {
        this.setState({settingPrimary: false});
      });
  };

  onCancel = () => {
    this.RBSheet.close();
  };

  onOK = () => {
    this.RBSheet.close();
    this.onDeletePayment();
  };

  renderPopup() {
    return (
      <RBSheet
        ref={ref => {
          this.RBSheet = ref;
        }}
        height={300}
        closeOnDragDown={true}
        dragFromTopOnly={true}
        openDuration={500}
        customStyles={{
          container: {
            alignItems: 'center',
            backgroundColor: BaseColor.fieldColor,
            paddingHorizontal: 10,
          },
          draggableIcon: {
            backgroundColor: BaseColor.primaryColor,
          },
        }}>
        <View>
          <Text style={styles.popupTitle}>Are you sure you want to remove this card?</Text>
          <View style={styles.bottomButtonGroup}>
            <TouchableOpacity style={styles.bottomButton} onPress={this.onCancel}>
              <Text style={styles.bottomButtonText}>Keep</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.bottomButton} onPress={this.onOK}>
              <Text style={styles.bottomButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      </RBSheet>
    );
  }

  render() {
    const {navigation} = this.props;
    const {card} = this.props.route.params;
    const {settingPrimary, deleting, primary} = this.state;

    return (
      <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'never'}}>
        <Header
          title="Card Detail"
          renderLeft={() => {
            return <Icon name="arrow-left" size={20} color={BaseColor.headerIconColor} />;
          }}
          onPressLeft={() => {
            navigation.goBack();
          }}
        />
        {this.renderPopup()}
        <View style={{flex: 1, padding: 20}}>
          <View style={styles.card}>
            <Icon name="cc-visa" size={48} color={BaseColor.textPrimaryColor} />
            <Text body1 style={{marginTop: 10}}>
              {`**** **** **** ${card.last4}`}
            </Text>
            <Text footnote grayColor style={{marginTop: 4}}>
              {`Expiries ${(card.exp_month < 10 && '0') + card.exp_month}/${card.exp_year}`}
            </Text>
            <View style={{alignItems: 'flex-end'}}>
              <Text footnote primaryColor style={{marginTop: 15}}>
                {primary && 'Primary'}
              </Text>
            </View>
          </View>
          <Button
            style={[{marginTop: 20}, primary && {backgroundColor: BaseColor.grayColor}]}
            loading={settingPrimary}
            disabled={primary}
            onPress={this.onSetPrimaryPayment}>
            Set Primary
          </Button>
          <Button
            style={{marginTop: 20, borderColor: '#FF0000'}}
            styleText={{color: '#FF0000'}}
            loading={deleting}
            outline
            disabled={deleting}
            onPress={() => this.RBSheet.open()}>
            Remove
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

export default connect(mapStateToProps, mapDispatchToProps)(PaymentMethodDetail);

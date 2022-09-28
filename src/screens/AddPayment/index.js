import React, {Component} from 'react';
import {View, Switch} from 'react-native';
import {connect} from 'react-redux';
import {BaseStyle, BaseColor} from '@config';
import {Header, SafeAreaView, Icon, Text, Button} from '@components';
import styles from './styles';
import {UserServices} from '../../services';
import {CreditCardInput} from 'react-native-credit-card-input';
import {showMessage} from 'react-native-flash-message';

class AddPayment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      primary: true,
    };
  }

  toggleSwitch = value => {
    this.setState({primary: value});
  };

  _onChange = form => {
    this.setState({card: form});
  };

  onAddPayment() {
    const {navigation, auth} = this.props;
    const {card, primary} = this.state;
    this.setState({loading: true});

    if (!card.valid) {
      showMessage({
        message: 'Card information is invalid',
        type: 'warning',
        icon: 'auto',
        duration: 10000,
      });
      return;
    }

    const body = {
      card_number: card.values.number,
      name: card.values.name,
      exp_month: card.values.expiry.split('/')[0],
      exp_year: '20' + card.values.expiry.split('/')[1],
      cvc_number: card.values.cvc,
      is_default: primary,
    };

    UserServices.saveCard(body, auth.user.token)
      .then(response => {
        if (response.data.success === 1) {
          showMessage({
            message: 'Successfully added your payment method',
            type: 'success',
            icon: 'auto',
            duration: 10000,
          });
          this.setState({loading: false});
          navigation.goBack();
        } else {
          showMessage({
            message: response.data.msg,
            type: 'warning',
            icon: 'auto',
            // duration: 10000,
          });
        }
      })
      .catch(error => {
        console.log(error.response);
        showMessage({
          message: error.response.data.msg,
          type: 'warning',
          icon: 'auto',
          duration: 10000,
        });
      })
      .finally(() => {
        this.setState({loading: false});
      });
  }

  render() {
    const {navigation} = this.props;
    const {primary, loading} = this.state;
    return (
      <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'never'}}>
        <Header
          title="Add Payment Method"
          renderLeft={() => {
            return <Icon name="arrow-left" size={20} color={BaseColor.headerIconColor} />;
          }}
          onPressLeft={() => {
            navigation.goBack();
          }}
        />
        <View style={styles.contain}>
          <Text headline style={styles.title}>
            Card Information
          </Text>
          <CreditCardInput onChange={this._onChange} requiresName />
          <View style={styles.checkDefault}>
            <Text body2>Set as primary</Text>
            <Switch name="angle-right" size={18} onValueChange={this.toggleSwitch} value={primary} />
          </View>
        </View>
        <View style={styles.bottomButtonContainer}>
          <Button loading={loading} disabled={loading} full onPress={() => this.onAddPayment()}>
            Add
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

export default connect(mapStateToProps, mapDispatchToProps)(AddPayment);

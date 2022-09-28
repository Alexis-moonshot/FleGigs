import React, {Component} from 'react';
import {View, TouchableOpacity, RefreshControl, FlatList} from 'react-native';
import {connect} from 'react-redux';
import {BaseStyle, BaseColor} from '@config';
import {useFocusEffect} from '@react-navigation/native';
import {Header, SafeAreaView, Icon, Text, Button} from '@components';
import styles from './styles';
import {UserServices} from '../../services';
import {Placeholder, PlaceholderMedia, PlaceholderLine, ShineOverlay} from 'rn-placeholder';
import {Placeholders} from '@data';

function FocusMyPaymentMethod({onFocus}) {
  useFocusEffect(
    React.useCallback(() => {
      onFocus();
      return;
    }, [onFocus])
  );

  return null;
}

class MyPaymentMethod extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      cards: [],
    };
  }

  onSelectMethod(item, primary) {
    const {navigation} = this.props;
    navigation.navigate('PaymentMethodDetail', {
      card: item,
      primary: primary,
    });
  }

  fetchSavedCards = () => {
    const {auth} = this.props;
    this.setState({loading: true});
    UserServices.getSavedCard(auth.user.token)
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
    // console.log('MyPaymentMethod handleUpdate ----------', response);
    if (result) {
      this.setState({
        cards: response.data.data,
      });
    } else {
    }
    this.setState({loading: false});
  };

  getIconFromBrand(brand) {
    switch (brand) {
      case 'Visa':
        return 'cc-visa';
      case 'MasterCard':
        return 'cc-mastercard';
      case 'American Express':
      case 'Discover':
      case 'Diners Club':
      case 'JCB':
      case 'UnionPay':
      default:
        return 'credit-card';
    }
  }

  renderCardItem(item, index) {
    return (
      <TouchableOpacity style={styles.paymentItem} onPress={() => this.onSelectMethod(item, index === 0)}>
        <View style={styles.cardContent}>
          <View style={styles.iconContent}>
            <Icon name={this.getIconFromBrand(item.brand)} size={48} color={BaseColor.textPrimaryColor} />
          </View>
          <View>
            <Text body1>{`**** **** **** ${item.last4}`}</Text>
            <Text footnote grayColor style={styles.expire}>
              {`Expires ${(item.exp_month < 10 && '0') + item.exp_month}/${item.exp_year}`}
            </Text>
          </View>
        </View>
        {index === 0 ? (
          <Text footnote primaryColor>
            primary
          </Text>
        ) : null}
      </TouchableOpacity>
    );
  }

  renderCardPlaceholder(item, index) {
    return (
      <View style={styles.placeholder}>
        <Placeholder Left={props => <PlaceholderMedia style={styles.placeholderMedia} />} Animation={ShineOverlay}>
          <PlaceholderLine width={50} />
          <PlaceholderLine width={40} />
        </Placeholder>
      </View>
    );
  }

  render() {
    const {navigation} = this.props;
    const {loading, cards} = this.state;

    return (
      <>
        <FocusMyPaymentMethod onFocus={this.fetchSavedCards} />
        <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'never'}}>
          <Header
            title="My Cards"
            renderLeft={() => {
              return <Icon name="arrow-left" size={20} color={BaseColor.headerIconColor} />;
            }}
            onPressLeft={() => {
              navigation.goBack();
            }}
          />
          <View style={styles.contain}>
            {loading ? (
              <FlatList
                data={Placeholders}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => this.renderCardPlaceholder(item, index)}
                scrollEnabled={false}
              />
            ) : cards.length === 0 ? (
              <View>
                <Text style={styles.description}>No saved payment method</Text>
              </View>
            ) : (
              <FlatList
                refreshControl={
                  <RefreshControl
                    colors={[BaseColor.primaryColor]}
                    tintColor={BaseColor.primaryColor}
                    refreshing={this.state.refreshing}
                    onRefresh={() => {
                      this.fetchSavedCards();
                    }}
                  />
                }
                keyExtractor={(item, index) => item.id}
                data={cards}
                renderItem={({item, index}) => this.renderCardItem(item, index)}
              />
            )}
          </View>
          <View style={styles.bottomButtonContainer}>
            <Button full onPress={() => navigation.navigate('AddPayment')}>
              Add Payment Method
            </Button>
          </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(MyPaymentMethod);

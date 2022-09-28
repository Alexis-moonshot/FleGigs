import React, {Component} from 'react';
import {View, ScrollView} from 'react-native';
import {BaseStyle, BaseColor} from '@config';
import {Header, SafeAreaView, Button, Icon, Text, Image} from '@components';
import {GreatJob} from '@data';
import styles from './styles';

export default class JobEnd extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {navigation} = this.props;
    const {jobData, helper_count, total_tip} = this.props.route.params;
    return (
      <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'never'}}>
        <Header
          title="Job Finished"
          subTitle={`#${jobData.job_id}`}
          renderLeft={() => {
            return <Icon name="arrow-left" size={20} color={BaseColor.headerIconColor} />;
          }}
          onPressLeft={() => {
            navigation.goBack();
          }}
        />
        <ScrollView>
          <View style={{alignItems: 'center'}}>
            <Image source={{uri: GreatJob[Math.floor(Math.random() * 5)]}} resizeMode={'contain'} style={styles.image} />
          </View>
          <View
            style={{
              paddingHorizontal: 20,
              marginTop: 20,
            }}>
            <Text
              style={{
                color: BaseColor.primaryColor,
                fontSize: 15,
                fontWeight: 'bold',
              }}>
              Billing
            </Text>
            <View style={styles.billContent}>
              <View style={styles.billItem}>
                <Text>No of Helpers</Text>
                <Text>{helper_count}</Text>
              </View>
              <View style={styles.billItem}>
                <Text>Compensation</Text>
                {helper_count > 1 ? (
                  <Text>{`$${jobData.monitary_compensation} x ${helper_count}`}</Text>
                ) : (
                  <Text>{`$${jobData.monitary_compensation}`}</Text>
                )}
              </View>
              <View
                style={{
                  marginTop: 10,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  borderBottomWidth: 1,
                  borderColor: '#ff0000',
                  paddingBottom: 10,
                }}>
                <Text>Tips</Text>
                <Text>${total_tip}</Text>
              </View>
              <View style={styles.billItem}>
                <Text style={{fontWeight: 'bold'}}>Total</Text>
                <Text style={{fontWeight: 'bold'}}>{`$${
                  helper_count * parseFloat(jobData.monitary_compensation) + parseFloat(total_tip)
                }`}</Text>
              </View>
            </View>
          </View>
          <View style={{alignItems: 'center'}}>
            <Text style={{fontSize: 20, marginTop: 50}}>Thank you for using the app</Text>
          </View>
        </ScrollView>
        <View style={{padding: 20, flexDirection: 'row'}}>
          <Button full onPress={() => navigation.navigate('Dashboard')} style={{flex: 5, marginRight: 10, alignItems: 'center'}}>
            Tap to return Dashboard
          </Button>
        </View>
      </SafeAreaView>
    );
  }
}

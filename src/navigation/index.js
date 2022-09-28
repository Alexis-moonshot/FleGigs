import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Main from './main';
import Loading from '@screens/Loading';
import SignIn from '@screens/SignIn';
import SignUp from '@screens/SignUp';
import ResetPassword from '@screens/ResetPassword';
import Walkthrough from '@screens/Walkthrough';
import FlashMessage from 'react-native-flash-message';

const Stack = createStackNavigator();

function Navigation() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Loading">
          <Stack.Screen name="Loading" component={Loading} options={{headerShown: false, gestureEnabled: false}} />
          <Stack.Screen name="Walkthrough" component={Walkthrough} options={{headerShown: false, gestureEnabled: false}} />
          <Stack.Screen name="SignIn" component={SignIn} options={{headerShown: false, gestureEnabled: false}} />
          <Stack.Screen name="SignUp" component={SignUp} options={{headerShown: false, gestureEnabled: false}} />
          <Stack.Screen name="ResetPassword" component={ResetPassword} options={{headerShown: false, gestureEnabled: false}} />
          <Stack.Screen name="Main" component={Main} options={{headerShown: false, gestureEnabled: false}} />
        </Stack.Navigator>
      </NavigationContainer>
      <FlashMessage position="top" />
    </>
  );
}

export default Navigation;

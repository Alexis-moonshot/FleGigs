import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {AndroidBackHandler} from 'react-navigation-backhandler';
import {BaseColor} from '@config';

// Dashboard
import Dashboard from '@screens/Dashboard';
import PostJob from '@screens/PostJob';

// Profile Stack
import Profile from '@screens/Profile';
import Notification from '@screens/Notification';
import ProfileEdit from '@screens/ProfileEdit';
import ChangePassword from '@screens/ChangePassword';
import MyPaymentMethod from '@screens/MyPaymentMethod';
import PaymentMethodDetail from '@screens/PaymentMethodDetail';
import AddPayment from '@screens/AddPayment';
import MyJobs from '@screens/MyJobs';
import MyJobDetail from '@screens/MyJobDetail';
import Messages from '@screens/Messages';
import JobRating from '@screens/JobRating';
import JobEnd from '@screens/JobEnd';
import AdminSupport from '@screens/AdminSupport';
import SelectHelperMap from '@screens/SelectHelperMap';
import TrackHelperMap from '@screens/TrackHelperMap';
import WaitingAccept from '@screens/WaitingAccept';
import SetLocation from '@screens/SetLocation';
// import InviteFriends from '@screens/InviteFriends';
import DrawerContent from '@screens/DrawerContent';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function DashboardStack() {
  return (
    <Drawer.Navigator
      drawerContent={props => <DrawerContent {...props} />}
      drawerContentOptions={{
        activeTintColor: BaseColor.primaryColor,
      }}>
      <Drawer.Screen name="Dashboard" component={Dashboard} />
    </Drawer.Navigator>
  );
}

function MainStack() {
  return (
    <AndroidBackHandler
      onBackPress={() => {
        // BackHandler.exitApp();
        // return true;
      }}>
      <Stack.Navigator initialRouteName="DashboardStack">
        <Stack.Screen name="DashboardStack" component={DashboardStack} options={{headerShown: false, gestureEnabled: false}} />
        <Stack.Screen name="PostJob" component={PostJob} options={{headerShown: false, gestureEnabled: false}} />
        <Stack.Screen name="Profile" component={Profile} options={{headerShown: false, gestureEnabled: false}} />
        <Stack.Screen name="Notification" component={Notification} options={{headerShown: false, gestureEnabled: false}} />
        <Stack.Screen name="ProfileEdit" component={ProfileEdit} options={{headerShown: false, gestureEnabled: false}} />
        <Stack.Screen name="ChangePassword" component={ChangePassword} options={{headerShown: false, gestureEnabled: false}} />
        <Stack.Screen name="MyPaymentMethod" component={MyPaymentMethod} options={{headerShown: false, gestureEnabled: false}} />
        <Stack.Screen name="PaymentMethodDetail" component={PaymentMethodDetail} options={{headerShown: false, gestureEnabled: false}} />
        <Stack.Screen name="AddPayment" component={AddPayment} options={{headerShown: false, gestureEnabled: false}} />
        <Stack.Screen name="MyJobs" component={MyJobs} options={{headerShown: false, gestureEnabled: false}} />
        <Stack.Screen name="MyJobDetail" component={MyJobDetail} options={{headerShown: false, gestureEnabled: false}} />
        <Stack.Screen name="Messages" component={Messages} options={{headerShown: false, gestureEnabled: false}} />
        <Stack.Screen name="JobRating" component={JobRating} options={{headerShown: false, gestureEnabled: false}} />
        <Stack.Screen name="JobEnd" component={JobEnd} options={{headerShown: false, gestureEnabled: false}} />
        <Stack.Screen name="SelectHelperMap" component={SelectHelperMap} options={{headerShown: false, gestureEnabled: false}} />
        <Stack.Screen name="TrackHelperMap" component={TrackHelperMap} options={{headerShown: false, gestureEnabled: false}} />
        <Stack.Screen name="WaitingAccept" component={WaitingAccept} options={{headerShown: false, gestureEnabled: false}} />
        <Stack.Screen name="SetLocation" component={SetLocation} options={{headerShown: false, gestureEnabled: false}} />
        {/* <Stack.Screen
          name="InviteFriends"
          component={InviteFriends}
          options={{ headerShown: false, gestureEnabled: false }}
        /> */}
        <Stack.Screen name="AdminSupport" component={AdminSupport} options={{headerShown: false, gestureEnabled: false}} />
      </Stack.Navigator>
    </AndroidBackHandler>
  );
}

// export default MainDrawerNavigator;
export default MainStack;

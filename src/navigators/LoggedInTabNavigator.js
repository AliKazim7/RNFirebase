import React from 'react';
import PropTypes from 'prop-types';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
// import Icon from 'react-native-vector-icons/Ionicons';
// import Icon from 'react-native-vector-icons'
import ExploreContainer from '../containers/ExploreContainer';
import InboxContainer from '../containers/InboxContainer';
import ProfileContainer from '../containers/ProfileContainer';
import SavedContainer from '../containers/SavedContainer';
import TripsContainer from '../containers/TripsContainer';
import EditProfile from '../screen/ProfileScreen/EditProfile'
import PaymentScreen from '../screen/ProfileScreen/Payment'
import AddPayment from '../screen/ProfileScreen/AddPayment'
import TravelWork from '../screen/ProfileScreen/TravelWork'
import InviteFriends from '../screen/ProfileScreen/Invite'
import EditPaymentMethod from '../screen/ProfileScreen/AddPayment'
import SelectedItem from '../screen/ExploreScreen/SelectedItem'
import CreateList from "../screen/CreateList"
import ViewCategory from '../screen/ExploreScreen/ViewCategory'
import colors from '../styles/colors';
import { NavigationContainer } from '@react-navigation/native';
import Availability from '../screen/ExploreScreen/Availability';
import FilterModal from '../components/Modals/FilterModal';
import CreateModal from '../screen/ExploreScreen/CreateModal';
import { Icon } from 'native-base';
import SavedDetail from '../screen/SavedScreen/SavedDetail';
import SelectedSavedItem from '../screen/SavedScreen/SelectedSavedItem';

import Listitems from '../screen/ProfileScreen/ListItem';
import AddListDetails from '../screen/AddListScreens/AddDetails';
import UserProfile from '../screen/ProfileScreen/UserProfile';
import AddUserImg from '../screen/ProfileScreen/AddUserImg';
import ListCompany from '../screen/AddListScreens/ListComp';
import GuestList from '../screen/AddListScreens/GuestList';
import ListPhoto from '../screen/AddListScreens/ListPhoto';
import PreviewItem from '../screen/AddListScreens/PreviewItem';
import HostProfile from '../screen/HostProfile';
import HostSelected from '../screen/HostScreens/HostSelected';
import FeedBack from '../screen/ProfileScreen/FeedBack';
import Notifications from '../screen/ProfileScreen/Notifications';
import TermService from '../screen/ProfileScreen/TermsService';
import Home from '../screen/Home';
import MyOrders from '../screen/ProfileScreen/MyOrder';
import { color } from 'react-native-reanimated';
import SelectedListItem from '../screen/ListingScreens/SelectedList';
import UpdateListItem from '../screen/ListingScreens/UpdateListed'
import ImageList from '../components/ImageList';
import OrderDetails from '../screen/OrderScreens/OrderDetail';
import SaveAvail from '../screen/SavedScreen/SaveAvail';
import Messages from '../screen/ExploreScreen/Messages';
import ChatMessages from '../screen/InboxScreen/ChatMessages';
import RenterMessage from '../screen/InboxScreen/RenterMessage';
import RenterProfile from '../screen/ListingScreens/RenterProfile';
import GetFiltered from '../screen/ExploreScreen/GetFiltered';
const Tabs = createBottomTabNavigator()
const Stack = createStackNavigator()
const RootStack = createStackNavigator()

// const ExploreTab = createStackNavigator({
//   ExploreContainer: {
//     screen: ExploreContainer,
//     navigationOptions: {
//       header: null,
//     },
//   },
//   CreateList: { screen: CreateList },
//   SelectedItem: {
//     screen: SelectedItem, 
//     navigationOptions: {
//       header: null
//     },
//   },
//   ViewCategory:{ screen: ViewCategory }
// },
// {
//   mode: 'modal',
// });

function RootStacks(){
  return(
    <RootStack.Navigator mode="modal">
      <RootStack.Screen options={{headerShown: false}} name="MainContainer" component={ExploreTab} />
      <RootStack.Screen options={{headerShown: false}} name="FilterModal" component={FilterModal} />
      <RootStack.Screen options={{headerShown: false}} name="CreateModal" component={CreateModal} />
      <Stack.Screen options={{headerShown: false}} name="ImageGallery" component={ImageList} />
    </RootStack.Navigator>
  )
}

function SaveStacks(){
  return(
    <RootStack.Navigator mode="modal">
      <RootStack.Screen options={{headerShown: false}} name="Saved" component={SavedContainer} />
      <RootStack.Screen options={{headerShown: false}} name="SavedDetail" component={SavedDetail} />
      <RootStack.Screen options={{headerShown: false}} name="ImageGallery" component={ImageList} />
      <RootStack.Screen options={{headerShown: false}} name="SaveAvail" component={SaveAvail} />
      <RootStack.Screen options={{headerShown: false}} name="SelectedSave" component={SelectedSavedItem} />
    </RootStack.Navigator>
  )
}

function ExploreTab(){
  return(
    <Stack.Navigator>
      <Stack.Screen options={{headerShown: false}} name="ExploreContainer" component={ExploreContainer} />
      <Stack.Screen options={{headerShown: false}} name="CreateList" component={CreateList} />
      <Stack.Screen options={{headerShown: false}} name="SelectedItem" component={SelectedItem} />
      <Stack.Screen options={{headerShown: false}} name="Availability" component={Availability} />
      <Stack.Screen options={{headerShown: false}} name="ViewCategory" component={ViewCategory} />
      <Stack.Screen options={{headerShown: false}} name="GetFiltered" component={GetFiltered} />
      <Stack.Screen options={{headerShown: false}} name="Messages" component={Messages} />
      <Stack.Screen options={{headerShown: false}} name="HostProfile" component={HostProfile} />
      <Stack.Screen options={{headerShown: false}} name="ImageGallery" component={ImageList} />
      <Stack.Screen options={{headerShown: false}} name="HostSelected" component={HostSelected} />
      <Stack.Screen options={{headerShown: false}} name="MainSearch" component={Home} />
    </Stack.Navigator>
  )
}
// const ProfileTab = createStackNavigator({
//   ProfileTab: {
//     screen: ProfileContainer,
//     navigationOptions: {
//       header: null,
//     },
//   },
//   EditProfile: { screen: EditProfile },
//   PaymentScreen: { screen: PaymentScreen },
//   EditPayment: {screen: EditPaymentMethod},
//   AddPayment: {screen: AddPayment},
//   TravelWork:{screen: TravelWork},
//   InviteFriends:{screen: InviteFriends}
// },
// {
//   mode: 'modal',
// });

function UpdateList(){
  return(
    <Stack.Navigator mode="modal">
      <Stack.Screen options={{headerShown: false}} name="UpdateList" component={UpdateListItem} />
      <Stack.Screen options={{headerShown: false}} name="ImageGallery" component={ImageList} />
    </Stack.Navigator>
  )
}

function ListingTabs(){
  return(
    <Stack.Navigator>
      <Stack.Screen options={{headerShown: false}} name="Listing" component={TripsContainer} />
      <Stack.Screen options={{headerShown: false}} name="SelectList" component={SelectedListItem} />
      <Stack.Screen options={{headerShown: false}} name="ImageGallery" component={ImageList} />
      <Stack.Screen options={{headerShown: false}} name="UpdateList" component={UpdateList} />
      <Stack.Screen options={{headerShown: false}} name='RenterProfile' component={RenterProfile} />
    </Stack.Navigator>
  )
}

function ProfileTab(){
  return(
    <Stack.Navigator>
      <Stack.Screen options={{headerShown: false}} name="ProfileTab" component={ProfileContainer} />
      <Stack.Screen options={{headerShown: false}} name="EditProfile" component={EditProfile} />
      <Stack.Screen options={{headerShown: false}} name="PaymentScreen" component={PaymentScreen} />
      <Stack.Screen options={{headerShown: false}} name="EditPayment" component={EditPaymentMethod} />
      <Stack.Screen options={{headerShown: false}} name="AddPayment" component={AddPayment} />
      <Stack.Screen options={{headerShown: false}} name="TravelWork" component={TravelWork} />
      <Stack.Screen options={{headerShown: false}} name="ImageGallery" component={ImageList} />
      <Stack.Screen options={{headerShown: false}} name="InviteFriends" component={InviteFriends} />
      <Stack.Screen options={{headerShown: false}} name="UserProfile" component={UserProfile} />
      <Stack.Screen options={{headerShown: false}} name="AddUserImg" component={AddUserImg} />
      <Stack.Screen options={{headerShown: false}} name="ListItems" component={Listitems} />
      <Stack.Screen options={{headerShown: false}} name="AddListDetail" component={AddListDetails} />
      <Stack.Screen options={{headerShown: false}} name="ListCompany" component={ListCompany} />
      <Stack.Screen options={{headerShown: false}} name="GuestList" component={GuestList} />
      <Stack.Screen options={{headerShown: false}} name="AddListPhoto" component={ListPhoto} />
      <Stack.Screen options={{headerShown: false}} name="PreviewItemDetail" component={PreviewItem} />
      <Stack.Screen options={{headerShown: false}} name="FeedBack" component={FeedBack} />
      <Stack.Screen options={{headerShown: false}} name="Notifications" component={Notifications} />
      <Stack.Screen options={{headerShown: false}} name="TermsService" component={TermService} />
      <Stack.Screen options={{headerShown: false}} name="MyOrders" component={MyOrders} />
      <Stack.Screen options={{headerShown: false}} name="OrderListing" component={OrderDetails} />
    </Stack.Navigator>
  )
}

function InboxTab(){
  return(
    <Stack.Navigator>
      <Stack.Screen options={{headerShown: false}} name="InboxTab" component={InboxContainer} />
      <Stack.Screen options={{headerShown: false}} name="ChatBubble" component={ChatMessages} />
      <Stack.Screen options={{headerShown: false}} name="RenterChat" component={RenterMessage} />
    </Stack.Navigator>
  )
}

ExploreTab.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  if( routeName === "SelectedItem"){
    tabBarVisible = false
  }

  return {
    tabBarVisible,
  };
};

const CustomTabBarIcon = (name, size, type) => {
  const icon = ({ tintColor }) => (
    <Icon
    name={name}
    // size={size}
    style={name === "circle-o-notch" ? {fontSize:20} : null}
    type={type}
    color={tintColor}
    />
  );

  icon.propTypes = {
    tintColor: PropTypes.string.isRequired,
  };

  return icon;
};

function LoggedInTabNavigator(){
  return(
    <Tabs.Navigator tabBarOptions={{
      activeTintColor: colors.saagColor,
      inactiveTintColor: 'gray',
      // activeBackgroundColor:colors.saagColor,
      // inactiveBackgroundColor:colors.saagColor
    }}>
      <Tabs.Screen name="Explore"
        options={{
          tabBarLabel: 'Explore',
          tabBarIcon: CustomTabBarIcon('search', 22, 'EvilIcons')
        }} 
        component={RootStacks} 
      />
      <Tabs.Screen name="Saved" 
        options={{
          tabBarLabel: 'Saved',
          tabBarIcon: CustomTabBarIcon('heart', 22, 'EvilIcons')
        }} 
        component={SaveStacks} 
      />
      <Tabs.Screen name="Listing" 
        options={{
          tabBarLabel: 'Listing',
          tabBarIcon: CustomTabBarIcon('circle-o-notch', 18, 'FontAwesome')
        }} 
        component={ListingTabs} 
      />
      <Tabs.Screen name="Inbox" 
        options={{
          tabBarLabel: 'Inbox',
          tabBarIcon: CustomTabBarIcon('comment', 25, 'EvilIcons')
        }} 
        component={InboxTab} 
      />
      <Tabs.Screen name="Profile" 
        options={{
            tabBarLabel: 'Profile',
            tabBarIcon: CustomTabBarIcon('user', 22, 'EvilIcons')
        }}  
        component={ProfileTab} 
      />
    </Tabs.Navigator>
  )
}

export default LoggedInTabNavigator;
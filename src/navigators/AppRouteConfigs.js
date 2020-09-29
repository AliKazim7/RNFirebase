import React from 'react';
import PropTypes from 'prop-types';
import {
  createBottomTabNavigator,
  createStackNavigator,
} from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import ExploreContainer from '../containers/ExploreContainer';
import InboxContainer from '../containers/InboxContainer';
import ProfileContainer from '../containers/ProfileContainer';
import SavedContainer from '../containers/SavedContainer';
import TripsContainer from '../containers/TripsContainer';
import CreateList from '../screens/CreateList';
import colors from '../styles/colors';
import EditProfile from '../screens/ProfileScreen/EditProfile';
import PaymentScreen from '../screens/ProfileScreen/Payment';
import EditPaymentMethod from '../screens/ProfileScreen/PaymentMethods';
import AddPayment from '../screens/ProfileScreen/AddPayment';
import TravelWork from '../screens/ProfileScreen/TravelWork';
import InviteFriends from '../screens/ProfileScreen/Invite';
import SelectedItem from '../screens/ExploreScreen/SelectedItem';
import ViewCategory from '../screens/ExploreScreen/ViewCategory';

const ExploreTab = createStackNavigator({
  ExploreContainer: {
    screen: ExploreContainer,
    navigationOptions: {
      header: null,
    },
  },
  CreateList: { screen: CreateList },
  SelectedItem: {
    screen: SelectedItem, 
    navigationOptions: {
      header: null
    },
  },
  ViewCategory:{ screen: ViewCategory }
},
{
  mode: 'modal',
});

const ProfileTab = createStackNavigator({
  ProfileTab: {
    screen: ProfileContainer,
    navigationOptions: {
      header: null,
    },
  },
  EditProfile: { screen: EditProfile },
  PaymentScreen: { screen: PaymentScreen },
  EditPayment: {screen: EditPaymentMethod},
  AddPayment: {screen: AddPayment},
  TravelWork:{screen: TravelWork},
  InviteFriends:{screen: InviteFriends}
},
{
  mode: 'modal',
});

ExploreTab.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};

const CustomTabBarIcon = (name, size) => {
  const icon = ({ tintColor }) => (
    <Icon
      name={name}
      size={size}
      color={tintColor}
    />
  );

  icon.propTypes = {
    tintColor: PropTypes.string.isRequired,
  };

  return icon;
};

const LoggedInTabNavigator = createBottomTabNavigator({
  Explore: {
    screen: ExploreTab,
    navigationOptions: {
      tabBarLabel: 'Search',
      tabBarIcon: CustomTabBarIcon('ios-search', 22),
    },
  },
  Saved: {
    screen: SavedContainer,
    navigationOptions: {
      tabBarLabel: 'SAVED',
      tabBarIcon: CustomTabBarIcon('ios-heart-outline', 22),
    },
  },
  Trips: {
    screen: TripsContainer,
    navigationOptions: {
      tabBarLabel: 'TRIPS',
      tabBarIcon: CustomTabBarIcon('ios-ionic', 21),
    },
  },
  Inbox: {
    screen: InboxContainer,
    navigationOptions: {
      tabBarLabel: 'Messages',
      tabBarIcon: CustomTabBarIcon('ios-archive-outline', 25),
    },
  },
  // Host: {
  //   // screen: ,
  //   navigationOptions: {
  //     tabBarLabel: 'Host',
  //     tabBarIcon: CustomTabBarIcon('ios-archive-outline', 25),
  //   },
  // },
  Profile: {
    screen: ProfileTab,
    navigationOptions: {
      tabBarLabel: 'PROFILE',
      tabBarIcon: CustomTabBarIcon('ios-contact-outline', 22),
    },
  },
}, {
  tabBarOptions: {
    labelStyle: {
      fontWeight: '600',
      marginBottom: 5,
    },
    activeTintColor: colors.pink,
  },
  tabBarPosition: 'bottom',
});

export default LoggedInTabNavigator;
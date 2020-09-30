/**
 * Airbnb Clone App
 * @author: Andy
 * @Url: https://www.cubui.com
 */

import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  TouchableHighlight,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';
import colors from '../styles/colors';
import transparentHeaderStyle from '../styles/navigation';
import RoundedButton from '../components/buttons/RoundedButton';
import NavBarButton from '../components/buttons/NavBarButton';
import styles from './styles/LoggedOut';
import {
  Icon,
  Container,
  Content,
  Header,
  Left,
  Button,
  Body,
  Right,
} from 'native-base';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';
const airbnbLogo = require('../img/SAAAG.png');

export default class LoggedOut extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingVisible: false,
      //for google signIn
      userInfo: null,
      gettingLoginStatus: true,
    };
  }

  componentDidMount() {
    // this.setState({
    //   loadingVisible: true
    // })
    // this.getStorage()
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      webClientId:
        '107305454058-7q57vmja4o8srdvjbil0s0us0ja0p0jq.apps.googleusercontent.com',
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });
    this._isSignedIn();
  }
  _isSignedIn = async () => {
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (isSignedIn) {
      alert('User is already signed in');
      //Get the User details as user is already signed in
      this._getCurrentUserInfo();
    } else {
      //alert("Please Login");
      console.log('Please Login');
    }
    this.setState({gettingLoginStatus: false});
  };
  _getCurrentUserInfo = async () => {
    try {
      const userInfo = await GoogleSignin.signInSilently();
      console.log('User Info --> ', userInfo);
      this.setState({userInfo: userInfo});
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        alert('User has not signed in yet');
        console.log('User has not signed in yet');
      } else {
        alert("Something went wrong. Unable to get user's info");
        console.log("Something went wrong. Unable to get user's info");
      }
    }
  };
  _signIn = async () => {
    // Prompts a modal to let the user sign in into your application.
    try {
      await GoogleSignin.hasPlayServices({
        //Check if device has Google Play Services installed.
        //Always resolves to true on iOS.
        showPlayServicesUpdateDialog: true,
      });
      const userInfo = await GoogleSignin.signIn();
      console.log('User Info --> ', userInfo);
      this.setState({userInfo: userInfo});
    } catch (error) {
      console.log('Message', error.message);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User Cancelled the Login Flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Signing In');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play Services Not Available or Outdated');
      } else {
        console.log('Some Other Error Happened');
      }
    }
  };

  static navigationOptions = ({navigation}) => ({
    headerRight: (
      <NavBarButton
        handleButtonPress={() => navigation.navigate('LogIn')}
        location="right"
        color={colors.white}
        text="Log In"
      />
    ),
    headerStyle: transparentHeaderStyle,
    headerTransparent: true,
    headerTintColor: colors.white,
  });

  static onFacebookPress() {
    alert('Facebook button pressed');
  }

  static onCreateAccountPress() {
    alert('Create Account button pressed');
  }

  static onMoreOptionsPress() {
    alert('More options button pressed');
  }

  render() {
    if (this.state.userInfo != null) {
      //Showing the User detail
      return (
        <View style={styles.container}>
          <Image
            source={{uri: this.state.userInfo.user.photo}}
            style={styles.imageStyle}
          />
          <Text style={styles.text}>
            Name: {this.state.userInfo.user.name}{' '}
          </Text>
          <Text style={styles.text}>
            Email: {this.state.userInfo.user.email}
          </Text>
          <TouchableOpacity style={styles.button} onPress={this._signOut}>
            <Text>Logout</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        // <Container>
        <ScrollView style={styles.wrapper}>
          <Header transparent>
            <Left>
              <Button
                transparent
                onPress={() => this.props.navigation.goBack()}>
                {/* <Text style={{color:'black'}}>Back</Text> */}
                <Icon
                  type="AntDesign"
                  style={{color: 'white'}}
                  name="arrowleft"
                />
              </Button>
            </Left>
            <Body />
            <Right />
          </Header>
          <View style={styles.welcomeWrapper}>
            <Image source={airbnbLogo} style={styles.logo} />
            <Text style={styles.welcomeText}>Welcome to SAAG.</Text>
            <RoundedButton
              text="Continue with Facebook"
              textColor={colors.green01}
              background={colors.white}
              // icon={<Icon name="facebook" size={20} style={styles.facebookButtonIcon} />}
              icon={
                <Icon
                  type="FontAwesome"
                  name="facebook"
                  size={20}
                  style={styles.facebookButtonIcon}
                  name="facebook"
                />
              }
              handleOnPress={this.onFacebookPress}
            />
            {/* <RoundedButton
            text="Continue with Google"
            textColor={colors.green01}
            background={colors.white}
            icon={<Icon type="FontAwesome" name="google" size={20} style={styles.facebookButtonIcon} />}
            handleOnPress={this.onFacebookPress}
          /> */}
            <GoogleSigninButton
              style={{width: 312, height: 48}}
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Light}
              onPress={this._signIn}
            />
            {/* <RoundedButton
            text="Continue with Phone Number"
            textColor={colors.green01}
            background={colors.white}
            icon={<Icon type="FontAwesome" name="mobile" size={20} style={styles.facebookButtonIcon} />}
            handleOnPress={() => this.props.navigation.navigate('PhoneRegister')}
          /> */}
            <RoundedButton
              text="Create Account with Mail"
              textColor={colors.white}
              handleOnPress={() =>
                this.props.navigation.navigate('EmailRegister')
              }
            />
            <View style={styles.termsAndConditions}>
              <Text style={styles.termsText}>
                By tapping Continue, Create Account or More
              </Text>
              <Text style={styles.termsText}>{' options,'}</Text>
              <Text style={styles.termsText}>{"I agree to SAAG's "}</Text>
              <TouchableHighlight style={styles.linkButton}>
                <Text style={styles.termsText}>Terms of Service</Text>
              </TouchableHighlight>
              <Text style={styles.termsText}>,</Text>
              <TouchableHighlight style={styles.linkButton}>
                <Text style={styles.termsText}>Payments Terms of Service</Text>
              </TouchableHighlight>
              <Text style={styles.termsText}>,</Text>
              <TouchableHighlight style={styles.linkButton}>
                <Text style={styles.termsText}>Privacy Policy</Text>
              </TouchableHighlight>
              <Text style={styles.termsText}>, and</Text>
              <TouchableHighlight style={styles.linkButton}>
                <Text style={styles.termsText}>Nondiscrimination Policy</Text>
              </TouchableHighlight>
              <Text style={styles.termsText}>.</Text>
            </View>
          </View>
        </ScrollView>
        // </Container>
      );
    }
  }
}

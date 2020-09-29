import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ActionCreators from '../redux/actions';
import colors from '../styles/colors';
import transparentHeaderStyle from '../styles/navigation';
import InputField from '../components/form/InputField';
import NextArrowButton from '../components/buttons/NextArrowButton';
import Notification from '../components/Notification';
import Loader from '../components/Loader';
import NavBarButton from '../components/buttons/NavBarButton';
import styles from './styles/LogIn';
import auth from '@react-native-firebase/auth'
import { Header, Left, Button,Icon, Body, Right } from 'native-base';
const airbnbLogo = require('../img/airbnb-logo.png');

export default class RegisterAccount extends Component {
  static navigationOptions = ({ navigation }) => ({
    // headerRight: <NavBarButton handleButtonPress={() => navigation.navigate('LogIn')} location="right" color={colors.white} text="Log In" />,
    headerStyle: transparentHeaderStyle,
    headerTransparent: true,
    headerLeft:false,
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

  constructor(props) {
    super(props);
    this.state = {
      formValid: true,
      validEmail: false,
      validFirstName: false,
      validLastName: false,
      validNewPass:false,
      emailAddress: '',
      password: '',
      newpassword:'',
      validPassword: false,
      loadingVisible: false,
    };

    this.handleCloseNotification = this.handleCloseNotification.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleNextButton = this.handleNextButton.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.toggleNextButtonState = this.toggleNextButtonState.bind(this);
    this.handleUserName = this.handleUserName.bind(this);
    this.handleLastName = this.handleLastName.bind(this)
  }

  componentDidMount(){
  }

  handleNextButton = async () => {
    const { password, newpassword } = this.state
    this.setState({ loadingVisible: true });
    const { logIn, navigation } = this.props;
    const { navigate } = navigation;
    if(password === newpassword){
      this.setState({
        loadingVisible: false
      })

      const userCreted = await this.createUser()
      setTimeout(() => {
      //   this.setItem()
      navigate('TurnOnNotifications');
      // this.setState({ formValid: false, loadingVisible: false });
      // const { emailAddress, password } = this.state;
      // if (logIn(emailAddress, password)) {
      //   this.setState({ formValid: true, loadingVisible: false });
      //   navigate('TurnOnNotifications');
      // } else {
      //   this.setState({ formValid: false, loadingVisible: false });
      // }
    }, 2000);
    } else {
      setTimeout(() =>{
        this.setState({
          loadingVisible: false,
          validNewPass: false,
          validPassword: false
        })
      }, 2000)
    }
  }

  createUser = async() =>{
    return new Promise((resolve, reject)=>{
      auth().createUserWithEmailAndPassword(this.state.emailAddress, this.state.password)
        .then(() =>{
          resolve(true)
        })
        .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            resolve(false)
          }
      
          if (error.code === 'auth/invalid-email') {
            resolve(false)
          }
        });
    })
  }

  handleCloseNotification() {
    this.setState({ formValid: true });
  }

  handleEmailChange(email) {
    // eslint-disable-next-line
    const emailCheckRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const { validEmail } = this.state;
    this.setState({ emailAddress: email });

    if (!validEmail) {
      if (emailCheckRegex.test(email)) {
        this.setState({ validEmail: true });
      }
    } else if (!emailCheckRegex.test(email)) {
      this.setState({ validEmail: false });
    }
  }

  handleUserName(name){
    if(name !== ""){
      this.setState({
        firstName: name,
        validFirstName:true
      })
    } else {
      this.setState({
        firstName: name,
        validFirstName:false
      })
    }
  }

  handleLastName(name){
    if(name !== ""){
      this.setState({
        lastName: name,
        validLastName:true
      })
    } else {
      this.setState({
        lastName: name,
        validLastName:false
      })
    }
  }

  handlePasswordChange(password) {
    const { validPassword } = this.state;

    this.setState({ password });

    if (!validPassword) {
      if (password.length > 4) {
        // Password has to be at least 4 characters long
        this.setState({ validPassword: true });
      }
    } else if (password <= 4) {
      this.setState({ validPassword: false });
    }
  }

  handlePasswordChange1 =(password) => {
    const { validNewPass } = this.state;

    this.setState({ newpassword: password });

    if (!validNewPass) {
      if (password.length > 4) {
        // Password has to be at least 4 characters long
        this.setState({ validNewPass: true });
      }
    } else if (password <= 4) {
      this.setState({ validNewPass: false });
    }
  }

  toggleNextButtonState() {
    const { validEmail, validPassword, validFirstName, validLastName, validNewPass } = this.state;
    if (validEmail && validPassword && validFirstName && validLastName, validNewPass) {
      return false
    }
    return true;
  }

  render() {
    const {
      formValid, loadingVisible, validEmail, validPassword,validFirstName, validLastName, validNewPass
    } = this.state;
    const showNotification = !formValid;
    const background = formValid ? colors.green01 : colors.darkOrange;
    const notificationMarginTop = showNotification ? 10 : 0;
    return (
      <KeyboardAvoidingView
        style={[{ backgroundColor: background }, styles.wrapper]}
        behavior="padding"
      >
        <View style={styles.scrollViewWrapper}>
          <ScrollView style={styles.scrollView}>
          <InputField
              labelText="FIRST NAME"
              labelTextSize={14}
              labelColor={colors.white}
              textColor={colors.white}
              borderBottomColor={colors.white}
              inputType="email"
              customStyle={{ marginBottom: 30 }}
              onChangeText={this.handleUserName}
              showCheckmark={validFirstName}
              autoFocus
            />
            <InputField
              labelText="LAST NAME"
              labelTextSize={14}
              labelColor={colors.white}
              textColor={colors.white}
              borderBottomColor={colors.white}
              inputType="email"
              customStyle={{ marginBottom: 30 }}
              onChangeText={this.handleLastName}
              showCheckmark={validLastName}
              autoFocus
            />
            <InputField
              labelText="EMAIL ADDRESS"
              labelTextSize={14}
              labelColor={colors.white}
              textColor={colors.white}
              borderBottomColor={colors.white}
              inputType="email"
              customStyle={{ marginBottom: 30 }}
              onChangeText={this.handleEmailChange}
              showCheckmark={validEmail}
              autoFocus
            />
            <InputField
              labelText="PASSWORD"
              labelTextSize={14}
              labelColor={colors.white}
              textColor={colors.white}
              borderBottomColor={colors.white}
              inputType="password"
              customStyle={{ marginBottom: 30 }}
              onChangeText={this.handlePasswordChange}
              showCheckmark={validPassword}
            />
            <InputField
              labelText="CONFIRM PASSWORD"
              labelTextSize={14}
              labelColor={colors.white}
              textColor={colors.white}
              borderBottomColor={colors.white}
              inputType="password"
              customStyle={{ marginBottom: 30 }}
              onChangeText={this.handlePasswordChange1}
              showCheckmark={validNewPass}
            />
          </ScrollView>
          <NextArrowButton
            handleNextButton={this.handleNextButton}
            disabled={this.toggleNextButtonState()}
          />
        </View>
        <Loader
          modalVisible={loadingVisible}
          animationType="fade"
        />
        <View style={[styles.notificationWrapper, { marginTop: notificationMarginTop }]}>
          <Notification
            showNotification={showNotification}
            handleCloseNotification={this.handleCloseNotification}
            type="Error"
            firstLine="Those credentials don't look right."
            secondLine="Please try again."
          />
        </View>
      </KeyboardAvoidingView>
    );
  }
}
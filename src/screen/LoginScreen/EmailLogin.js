/**
 * Airbnb Clone App
 * @author: Andy
 * @Url: https://www.cubui.com
 */

import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
// import Icon from 'react-native-vector-icons/FontAwesome';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  AsyncStorage
} from 'react-native';
import colors from '../styles/colors';
import transparentHeaderStyle from '../styles/navigation';
import InputField from '../../components/form/InputField';
import NextArrowButton from '../../components/buttons/NextArrowButton';
import Notification from '../../components/Notification';
import Loader from '../../components/Loader';
import NavBarButton from '../../components/buttons/NavBarButton';
import styles from '../styles/LogIn';
import {Icon, Button} from 'native-base'
import RoundedButton from '../../components/buttons/RoundedButton';
import auth from '@react-native-firebase/auth'

// Icon.loadFont() 

export default class EmailLogin extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerRight: <NavBarButton
      handleButtonPress={() => navigation.navigate('ForgotPassword')}
      location="right"
      color={colors.white}
      text="Forgot Password"
    />,
    headerLeft: <NavBarButton
      handleButtonPress={() => navigation.goBack()}
      location="left"
      icon={<Icon name="angle-left" color={colors.white} size={30} />}
    />,
    headerStyle: transparentHeaderStyle,
    headerTitle:false,
    headerTransparent: true,
    headerTintColor: colors.white,
  });

  constructor(props) {
    super(props);
    this.state = {
      formValid: true,
      validEmail: false,
      emailAddress: '',
      password: '',
      passwordError:false,
      emailAddressError: false,
      validPassword: false,
      loadingVisible: false,
    };

    this.handleCloseNotification = this.handleCloseNotification.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleNextButton = this.handleNextButton.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.toggleNextButtonState = this.toggleNextButtonState.bind(this);
  }

  componentDidMount(){
    this.getData()
  }
  
  componentWillReceiveProps(nextProps){
   }

  getData = async() =>{
      auth().onAuthStateChanged(user => {
        if (!user) {
          this.setState({
            userLoggedIn: false,
          })
          // this.props.navigation.navigate("LogIn")
        } else {
          this.setState({
            userLoggedIn: true
          })
          this.props.navigation.navigate("LoggedIn")
        }
      })
  }

  handleNextButton = async() => {
    this.setState({ loadingVisible: true });
    const { logIn, navigation } = this.props;
    const { navigate } = navigation;
    var validationArray = []
    if(this.state.emailAddress === ''){
      validationArray.push("email address")
      this.state.emailAddressError = true
    }
    if(this.state.password === '' && this.state.password.length > 7){
      validationArray.push("password error")
      this.state.passwordError = true
    }
    if(validationArray.length > 0){
      this.setState({
        emailAddressError: this.state.emailAddressError,
        passwordError: this.state.passwordError,
        formValid:false
      })
    } else {
      const userSigning = await this.signUser()
      if(userSigning === true){
        setTimeout(() => {
          AsyncStorage.setItem("LoggedIn", "true")
          this.setState({ formValid: true, loadingVisible: false });
          navigate('LoggedIn');
        }, 2000);
      } else {
        this.setState({
          formValid: false
        })
      }
    }
  }

  signUser = async() =>{
    return new Promise((resolve, reject)=>{
      auth().signInWithEmailAndPassword(this.state.emailAddress, this.state.password)
      .then(()=>{
        resolve(true)
      }).catch(error => {
        // if (error.code === 'auth/invalid-email') {
        // }
          this.setState({
            validPassword: false,
            formValid: false
          })
        console.error(error);
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
    this.setState({ emailAddress: email, emailAddressError: false });

    if (!validEmail) {
      if (emailCheckRegex.test(email)) {
        this.setState({ validEmail: true });
      }
    } else if (!emailCheckRegex.test(email)) {
      this.setState({ validEmail: false });
    }
  }

  handlePasswordChange(password) {
    const { validPassword } = this.state;

    this.setState({ password:password, passwordError:false });

    if (!validPassword) {
      if (password.length > 4) {
        // Password has to be at least 4 characters long
        this.setState({ validPassword: true });
      }
    } else if (password <= 4) {
      this.setState({ validPassword: false });
    }
  }

  toggleNextButtonState() {
    const { validEmail, validPassword } = this.state;
    if (validEmail && validPassword) {
      return false;
    }
    return true;
  }

  forgotPassword = () =>{
    this.props.navigation.navigate("ForgotPassword")
  }

  render() {
    const {
      formValid, loadingVisible, validEmail, validPassword,
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
            <Text style={styles.loginHeader}>
Log In
            </Text>
            <InputField
              labelText="EMAIL ADDRESS"
              labelTextSize={14}
              labelColor={colors.white}
              textColor={colors.white}
              borderBottomColor={this.state.emailAddressError ? colors.black : colors.white}
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
              borderBottomColor={this.state.passwordError ? colors.black :colors.white}
              inputType="password"
              // customStyle={{ marginBottom: 30 }}
              onChangeText={this.handlePasswordChange}
              showCheckmark={validPassword}
            />
            <Button transparent onPress={() => this.forgotPassword()}>
              <Text style={{color:'white'}} >
                Forgot Password?
              </Text>
            </Button>
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
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet
} from 'react-native';
import colors from '../styles/colors';
import transparentHeaderStyle from '../styles/navigation';
import InputField from '../../components/form/InputField';
import NextArrowButton from '../../components/buttons/NextArrowButton';
import Notification from '../../components/Notification';
import Loader from '../../components/Loader';
import NavBarButton from '../../components/buttons/NavBarButton';
import styles from '../styles/LogIn'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { Header, Left, Button,Icon, Body, Right, CheckBox } from 'native-base';
import moment from 'moment'
import { saveItems } from '../../services/service';
const airbnbLogo = require('../../img/airbnb-logo.png');

export default class EmailRegister extends Component {
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
      receiveEmail:false,
      errorValue:'',
      emailAddress: '',
      password: '',
      newpassword:'',
      firstName:'',
      lastName:'',
      firstNameError:false,
      emailAddressError:false,
      passwordError:false,
      newpasswordError:false,
      validPassword: false,
      loadingVisible: false,
    };

    this.handleCloseNotification = this.handleCloseNotification.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleNextButton = this.handleNextButton.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.toggleNextButtonState = this.toggleNextButtonState.bind(this);
    this.handleUserName = this.handleUserName.bind(this);
  }

  handleNextButton = async () => {
    this.setState({ loadingVisible: true });
    const { navigation } = this.props;
    const { navigate } = navigation;
    this.setState({
      loadingVisible:true
    })
    var validationArray = []
    if(this.state.firstName === ''){
      validationArray.push("firstName")
      this.state.firstNameError = true
    }
    if(this.state.emailAddress === ''){
      validationArray.push("email Address")
      this.state.emailAddressError = true
    }
    if(this.state.password === '' && this.state.password.length > 7){
      validationArray.push("password not correct")
      this.state.passwordError = true
    }
    if(this.state.newpassword === '' && this.state.newpassword.length > 7){
      validationArray.push("newpassword not correct")
      this.state.newpasswordError = true
    }
    if(this.state.newpassword === this.state.password){
      validationArray.push("newpassword not correct")
      this.state.passwordError = true
      this.state.newpasswordError = true
    }
    if(validationArray.length > 0){
      this.setState({
        firstNameError: this.state.firstNameError,
        emailAddressError: this.state.emailAddressError,
        passwordError: this.state.passwordError,
        newpasswordError: this.state.newpasswordError,
        buttonDisabled:true,
        loadingVisible:false
      })
    } else {
      this.setState({
        buttonDisabled:false
      })
      const userCretedAuth = await this.createUser()
      if(userCretedAuth){
        const userProfile = await this.userProfile(userCretedAuth)
         if(userProfile === true){
          const saveItem = saveItems(userCretedAuth)
          setTimeout(() => {
           this.setState({ formValid: true, loadingVisible: false });
            navigate('LoggedIn');
          }, 4000);
        } else {
          setTimeout(() => {
            this.setState({ formValid: false, loadingVisible: false });
            }, 2000);
        }
      } else {
        setTimeout(() =>{
          this.setState({
            loadingVisible: false,
            formValid: false,
            emailAddressError: true
          })
        }, 2000)
      }
    }
  }

  createUser = async() =>{
    return new Promise((resolve, reject)=>{
      auth().createUserWithEmailAndPassword(this.state.emailAddress, this.state.password)
        .then((response) =>{
          resolve(response.user.uid )
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

  userProfile = async(uid) =>{
    const { firstName, lastName, emailAddress } = this.state;
    return new Promise((resolve, reject)=>{
      firestore().collection('Users').add({
        firstName: firstName,
        email: emailAddress,
        accountCreate:moment().format("MMMM , YYYY"),
        receiveEmail: this.state.receiveEmail === true ? true : false,
        supplierRating:0,
        renterRating:0,
        uid: uid,
        role: 'client'
      }).then(() => {
        resolve(true)
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

  handleUserName(name){
    if(name !== ""){
      this.setState({
        firstName: name,
        validFirstName:true, 
        firstNameError:false
      })
    } else {
      this.setState({
        firstName: name,
        validFirstName:false
      })
    }
  }
  handlePasswordChange(password) {
    const { validPassword } = this.state;

    this.setState({ password: password , passwordError:false});

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

    this.setState({ newpassword: password, newpasswordError:false });

    if (!validNewPass) {
      if (password.length > 4) {
        // Password has to be at least 4 characters long
        this.setState({ validNewPass: true });
      }
    } else if (password <= 4) {
      this.setState({ validNewPass: false });
    }
  }

  changeCheck = () => {
    this.setState({
      receiveEmail: !this.state.receiveEmail
    })
  }
  toggleNextButtonState() {
    const { validEmail, validPassword, validFirstName, validLastName, validNewPass } = this.state;
    if (validEmail && validPassword && validFirstName , validNewPass) {
        return false
    }
    return true;
  }

  render() {
    const {
      formValid, loadingVisible, validEmail, validPassword,validFirstName, validLastName, validNewPass
    } = this.state;
    const showNotification = !formValid;
    const background = formValid ? colors.saagColor : colors.darkOrange;
    const notificationMarginTop = showNotification ? 10 : 0;
    return (
      <KeyboardAvoidingView
        style={[{ backgroundColor: background }, styles.wrapper]}
        behavior="padding"
      >
        <View style={headerStyle.header}>
        <Header transparent style={{marginBottom:10}}>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon style={{color:'white'}} type="AntDesign" name="arrowleft" />
            </Button>
          </Left>
          <Body />
          <Right />
        </Header>
          <ScrollView style={styles.scrollView}>
          <InputField
              labelText="USER NAME"
              labelTextSize={14}
              labelColor={colors.white}
              textColor={colors.white}
              borderBottomColor={this.state.firstNameError ? colors.black : colors.white}
              inputType="email"
              customStyle={{ marginBottom: 30 }}
              onChangeText={this.handleUserName}
              showCheckmark={validFirstName}
              autoFocus
            />
            <InputField
              labelText="EMAIL ADDRESS"
              labelTextSize={14}
              labelColor={colors.white}
              textColor={colors.white}
              borderBottomColor={this.state.emailAddressError ? colors.black :colors.white}
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
              borderBottomColor={this.state.password ? colors.black : colors.white}
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
              borderBottomColor={this.state.newpasswordError ? colors.black : colors.white}
              inputType="password"
              customStyle={{ marginBottom: 30 }}
              onChangeText={this.handlePasswordChange1}
              showCheckmark={validNewPass}
            />

            <View style={{flexDirection:'row', marginBottom:20}} >
              <Left style={{flex:0.3, justifyContent:'flex-start'}}>
                <CheckBox color="white" onPress={() => this.changeCheck()} checked={this.state.receiveEmail} />
              </Left>
              <Body style={{flex:2, alignItems:'flex-start'}}>
                <Text style={{color:'white'}}>
                  Receive occasional emails from the SAAG team 
                </Text>
              </Body>
            </View>
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
            secondLine=""
          />
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const headerStyle = StyleSheet.create({
  header:{
    marginTop: 10,
    flex: 1,
    padding: 0,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  }
})